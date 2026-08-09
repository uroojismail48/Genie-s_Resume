import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import { usePuterStore } from "~/libs/puter"

export const meta = () => ([
{title : "Genie's | Auth "},
{name : "" , content : ""},
])
const Auth = () => {
const {isloading, auth } = usePuterStore()
const location = useLocation()
const next = location.search.split('next=')[1]
const navigate = useNavigate()

useEffect(() => 
{
  if(auth.isAuthenticated)navigate(next)
  },
[auth.isAuthenticated , next])
  return (
    <div className="w-auto h-screen flex flex-col justify-center items-center border">
<div className="border-2 gap-2 bg-white/5 text-center font-bold  h-auto rounded-2xl p-20 flex flex-col justify-center items-center">
    <h1 className="text-3xl">Welcome</h1>
    
    <h3 className="text-2xl">login to Continue</h3>
{
    isloading ? ( <button className="animate-pulse 
      cursor-pointer
      border border-white/20 bg-white/20 p-2 rounded-2xl">Signing in</button> ) 
    : (
      <>
      {auth.isAuthenticated ? (
         <button onClick={auth.signOut} className="animate-pulse border border-white/20 bg-white/20 p-2 rounded-2xl">Log -0ut</button>
      ) : (
<button onClick={auth.signIn} className="animate-pulse border border-white/20 bg-white/20 p-2 rounded-2xl">Log -0ut</button>

      )}
      </>
    ) }
   
</div>
    </div>
  )
}

export default Auth