import { useState } from "react"
import { useNavigate } from "react-router"
import { usePuterStore } from "../libs/puter"
import { prepareInstructions } from "../../constants"
import { convertPdfToImage } from "../libs/pdf2Image" 
const generateUUID = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0
    const value = char === "x" ? random : (random & 0x3) | 0x8
    return value.toString(16)
  })
}

const Upload = () => {
  const { fs, ai, kv } = usePuterStore()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const handleFile = (file: File | null) => {
    setFile(file)
    setErrorMsg("")
  }

  const handleAnalyze = async ({
    jobTitle,
    jobDescription,
    companyName,
    file,
  }: {
    companyName: string
    jobDescription: string
    jobTitle: string
    file: File
  }) => {
    try {
      setIsProcessing(true)
      setErrorMsg("")
      setStatus("Uploading...")

      const uploadFile = await fs.upload([file])
      if (!uploadFile) {
        setStatus("")
        setErrorMsg("Failed to upload resume.")
        return
      }

      setStatus("Converting to image...")
      const imageResult = await convertPdfToImage(file)
      if (!imageResult.file) {
        setStatus("")
        setErrorMsg(imageResult.error || "Failed to convert PDF to image.")
        return
      }

      setStatus("Uploading image...")
      const uploadedImage = await fs.upload([imageResult.file])
      if (!uploadedImage) {
        setStatus("")
        setErrorMsg("Failed to upload converted image.")
        return
      }

      setStatus("Preparing data...")
      const uuid = generateUUID()
      const data = {
        id: uuid,
        resumePath: uploadFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "" as any,
      }

      await kv.set(`resume:${uuid}`, JSON.stringify(data))

      setStatus("Analyzing...")
      const feedback = await ai.feedback(
        uploadFile.path,
        prepareInstructions({
          jobTitle,
          jobDescription,
          AIResponseFormat: "json",
        })
      )

      if (!feedback) {
        setStatus("")
        setErrorMsg("AI provider unavailable. Please try again in a moment.")
        return
      }

      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0].text

      data.feedback = JSON.parse(feedbackText)
      await kv.set(`resume:${uuid}`, JSON.stringify(data))

      setStatus("Analysis complete! Redirecting...")
      navigate(`/resume/${uuid}`)
    } catch (err) {
      console.error(err)
      console.log(JSON.stringify(err, null, 2))
      setStatus("")
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong while analyzing your resume."
      )
      
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isProcessing) return // guard against double submit

    const formData = new FormData(event.currentTarget)
    const jobTitle = formData.get("jobTitle")?.toString() ?? ""
    const jobDescription = formData.get("description")?.toString() ?? ""
    const companyName = formData.get("companyName")?.toString() ?? ""

    if (!jobTitle || !jobDescription || !companyName || !file) {
      setErrorMsg("Please fill all fields and upload a resume.")
      return
    }

    await handleAnalyze({ jobTitle, jobDescription, companyName, file })
  }

  return (
    <div className="min-h-screen w-full">
      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center px-6 py-10">
        {isProcessing ? (
          <section className="flex flex-col items-center text-center">
            <img src="/images/resume-scan.gif" alt="Scanning resume" className="mb-6 w-64" />
            <h2 className="text-2xl font-semibold">Processing your resume...</h2>
            <p className="mt-2 text-gray-500">{status || "We are analyzing your resume and preparing your ATS score."}</p>
          </section>
        ) : (
          <section className="w-full max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold">Smart Feedback for your job</h1>
              <p className="mt-2 text-gray-500">Drop your resume for an ATS Score</p>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border p-6">
              <div>
                <label htmlFor="company-name" className="mb-2 block font-medium">Company Name</label>
                <input id="company-name" type="text" name="companyName" placeholder="Company Name Here" className="w-full rounded-lg border px-4 py-3 outline-none" required />
              </div>

              <div>
                <label htmlFor="job-title" className="mb-2 block font-medium">Job Title</label>
                <input id="job-title" type="text" name="jobTitle" placeholder="Job Title Here" className="w-full rounded-lg border px-4 py-3 outline-none" required />
              </div>

              <div>
                <label htmlFor="job-description" className="mb-2 block font-medium">Job Description</label>
                <textarea id="job-description" name="description" placeholder="Paste the job description here..." rows={6} className="w-full resize-none rounded-lg border px-4 py-3 outline-none" required />
              </div>

              <div>
                <label htmlFor="resume-upload" className="mb-2 block font-medium">Upload Your Resume</label>
                <input
                  id="resume-upload"
                  type="file"
                  name="resume"
                  accept=".pdf"
                  className="w-full rounded-lg border p-3"
                  required
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0] || null
                    handleFile(selectedFile)
                  }}
                />
                <p className="mt-1 text-xs text-gray-400">PDF only — .doc/.docx are not supported by the AI reviewer.</p>
              </div>

              <button type="submit" disabled={isProcessing} className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-50">
                Upload Now
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  )
}

export default Upload