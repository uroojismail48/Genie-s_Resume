import { Link } from "react-router"


const Navbar = () => {
  return (
    <nav className="flex bg-gray-400 rounded-md border border-black
    mt-10 w-100 font-bold  items-center max-sm:w-80
    h-10 
    
    text-center p-2 justify-between max-sm:flex-row
     text-black">
      <Link to="/" >
      <p className="pl-2 max-sm:text-md" >Genie's resume</p>
      </Link>



      <Link to="/" >
<span className="text-white">       Uplaod Your Resume</span>
      </Link>
      </nav>
          
  )
}

export default Navbar
