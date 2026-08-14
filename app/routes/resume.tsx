import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router"
import { usePuterStore } from "~/libs/puter"
import ScoreCircle from "~/components/CircleProgress"

const ResumeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { auth, kv, fs } = usePuterStore()
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")

  const [imageUrl, setImageUrl] = useState("")

useEffect(() => {
  const loadImage = async () => {
    if (!resume?.imagePath) return
    const blob = await fs.read(resume.imagePath)
    if (blob) setImageUrl(URL.createObjectURL(blob))
  }
  loadImage()
}, [resume?.imagePath])

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`)
      return
    }

    const loadResume = async () => {
      if (!id) return
      try {
        const raw = await kv.get(`resume:${id}`)
        if (!raw) {
          setErrorMsg("Resume not found.")
          setLoading(false)
          return
        }
        setResume(JSON.parse(raw))
      } catch (err) {
        setErrorMsg("Failed to load resume feedback.")
      } finally {
        setLoading(false)
      }
    }

    loadResume()
  }, [id, auth.isAuthenticated])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading feedback...</p>
      </main>
    )
  }

  if (errorMsg || !resume) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-600">{errorMsg || "Something went wrong."}</p>
        <Link to="/" className="rounded-lg bg-black px-4 py-2 text-white">
          Go back home
        </Link>
      </main>
    )
  }

  const { feedback } = resume
  const categories = [
    { key: "ATS", label: "ATS" },
    { key: "toneAndStyle", label: "Tone & Style" },
    { key: "content", label: "Content" },
    { key: "structure", label: "Structure" },
    { key: "skills", label: "Skills" },
  ] as const

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link to="/" className="mb-6 inline-block text-sm text-gray-500 hover:underline">
        ← Back to all resumes
      </Link>

      <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-amber-50 p-6 text-black sm:flex-row">
        <div>
          <h1 className="text-2xl font-bold">{resume.jobTitle}</h1>
          <p className="text-gray-600">{resume.companyName}</p>
        </div>
        <ScoreCircle score={feedback?.overallScore} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
   {imageUrl && (
  <img src={imageUrl} alt="Resume preview" className="w-full rounded-xl border object-cover" />
)}

        <div className="flex flex-col gap-4">
          {categories.map(({ key, label }) => {
            const section = feedback?.[key]
            if (!section) return null
            return (
              <div key={key} className="rounded-xl border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="font-semibold">{label}</h2>
                  <span className="text-sm text-gray-500">{section.score}/100</span>
                </div>
                <ul className="space-y-2">
                  {section.tips?.map((tip: any, i: number) => (
                    <li key={i} className="text-sm">
                      <span
                        className={`mr-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                          tip.type === "good"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {tip.type === "good" ? "Good" : "Improve"}
                      </span>
                      <span className="font-medium">{tip.tip}</span>
                      {tip.explanation && (
                        <p className="mt-1 text-gray-500">{tip.explanation}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default ResumeDetail