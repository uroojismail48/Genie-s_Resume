import { Link } from "react-router"
import ScoreCircle from "./CircleProgress"

const ResumeCards = ({resume} : {resume : Resume}) => {
  return (
<Link to ={`/resume/${resume.id} `  } className="flex  w-full justify-center "  > 
<div className="w-full h-auto flex justify-between  rounded-2xl p-2
 bg-amber-50 text-black  animate-in fade-in  flex-col
duration-1000 ">
<div className=" flex  w-full justify-between
">
    <div className="head ">
    <h1 className="text-lg">{resume.jobTitle} </h1>
<p>{resume.companyName}</p>
</div>
<div className="shrink-0">
  <ScoreCircle score={resume.feedback?.overallScore }  />
</div>
</div>
<div className="">
    <img src={resume.imagePath} alt="" />
</div>
</div>
</Link>

)
}

export default ResumeCards
