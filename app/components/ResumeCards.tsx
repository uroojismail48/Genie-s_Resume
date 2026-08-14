import { Link } from "react-router"
import { useEffect, useState } from "react"
import ScoreCircle from "./CircleProgress"
import { usePuterStore } from "~/libs/puter"

const ResumeCards = ({ resume }: { resume: Resume }) => {
  const { fs } = usePuterStore()
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    const loadImage = async () => {
      if (!resume.imagePath) return
      const blob = await fs.read(resume.imagePath)
      if (blob) setImageUrl(URL.createObjectURL(blob))
    }
    loadImage()
  }, [resume.imagePath])

  return (
    <Link to={`/resume/${resume.id}`} className="flex w-full justify-center">
      <div className="w-full h-auto flex justify-between rounded-2xl p-2 bg-amber-50 text-black animate-in fade-in flex-col duration-1000">
        <div className="flex w-full justify-between">
          <div className="head">
            <h1 className="text-lg">{resume.jobTitle}</h1>
            <p>{resume.companyName}</p>
          </div>
          <div className="shrink-0">
            <ScoreCircle score={resume.feedback?.overallScore} />
          </div>
        </div>
        <div>
          {imageUrl && <img src={imageUrl} alt="Resume preview" />}
        </div>
      </div>
    </Link>
  )
}

export default ResumeCards