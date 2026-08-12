
import { useState } from "react"

const Upload = () => {
  const [isProcessing, setIsProcessing] = useState(false)
const [file, setFile] = useState<File | null>(null)
const handleFile = (file : File | null) => {
    setFile(file)
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
  file: File | null
}) => {
  console.log({
    jobTitle,
    jobDescription,
    companyName,
    file,
  })
}

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()

  const formData = new FormData(event.currentTarget)

  const jobTitle = formData.get("jobTitle")?.toString() ?? ""
  const jobDescription = formData.get("description")?.toString() ?? ""
  const companyName = formData.get("companyName")?.toString() ?? ""

  if (!jobTitle || !jobDescription || !companyName || !file) {
    return
  }

  setIsProcessing(true)
  await handleAnalyze({
    jobTitle,
    jobDescription,
    companyName,
    file,
  })
  if(!file) return
  handleAnalyze({
    jobTitle,
    jobDescription,
    companyName,
    file,
  })
  
}

  return (
    <div className="min-h-screen w-full">
      

      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center px-6 py-10">
        
        {isProcessing ? (
          // Processing Screen
          <section className="flex flex-col items-center text-center">
            <img
              src="/images/resume-scan.gif"
              alt="Scanning resume"
              className="mb-6 w-64"
            />

            <h2 className="text-2xl font-semibold">
              Processing your resume...
            </h2>

            <p className="mt-2 text-gray-500">
              We are analyzing your resume and preparing your ATS score.
            </p>
          </section>
        ) : (
          // Upload Form
          <section className="w-full max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold">
                Smart Feedback for your job
              </h1>

              <p className="mt-2 text-gray-500">
                Drop your resume for an ATS Score
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl border p-6"
            >
              {/* Company Name */}
              <div>
                <label
                  htmlFor="company-name"
                  className="mb-2 block font-medium"
                >
                  Company Name
                </label>

                <input
                  id="company-name"
                  type="text"
                  name="companyName"
                  placeholder="Company Name Here"
                  className="w-full rounded-lg border px-4 py-3 outline-none"
                  required
                />
              </div>

              {/* Job Title */}
              <div>
                <label
                  htmlFor="job-title"
                  className="mb-2 block font-medium"
                >
                  Job Title
                </label>

                <input
                  id="job-title"
                  type="text"
                  name="jobTitle"
                  placeholder="Job Title Here"
                  className="w-full rounded-lg border px-4 py-3 outline-none"
                  required
                />
              </div>

              {/* Job Description */}
              <div>
                <label
                  htmlFor="job-description"
                  className="mb-2 block font-medium"
                >
                  Job Description
                </label>

                <textarea
                  id="job-description"
                  name="description"
                  placeholder="Paste the job description here..."
                  rows={6}
                  className="w-full resize-none rounded-lg border px-4 py-3 outline-none"
                  required
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label
                  htmlFor="resume-upload"
                  className="mb-2 block font-medium"
                >
                  Upload Your Resume
                </label>

                <input
                  id="resume-upload"
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  className="w-full rounded-lg border p-3"
                  required
  onChange={(event) => {
    const selectedFile = event.target.files?.[0] || null
    handleFile(selectedFile)
  }}

/>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white"
              >
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