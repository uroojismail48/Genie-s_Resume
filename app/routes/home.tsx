import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from '../../constants/index';
import ResumeCards from "~/components/ResumeCards";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeGenie" },
    { name: "description", content: "AI Feedback For Your Resume!" },
  ];
}

export default function Home() {
return <main  className="flex items-center flex-col  w-full h-screen gap-10">
  <Navbar/>
  <section className="h-50 w-auto flex justify-center items-center">
    <div className="gap-2 w-full flex justify-center items-center flex-col">
      
        <h1 className="text-6xl font-bold max-md:text-5xl max-sm:text-4xl text-center">Track Your Resume</h1>
        <p className="text-center text-gray-300 max-md:text-sm">Find Best Resume For Your Job!</p>
    </div>
  </section>

  {resumes.length > 0 && (
    <div className="resume-section w-full  flex  justify-center max-md:flex-col gap-4 p-2 mt-20 ">
{
  resumes.map((resume) => (
   <ResumeCards key={resume.id} resume={resume}/>
  ))
}
    </div>
  )}

</main>
}
