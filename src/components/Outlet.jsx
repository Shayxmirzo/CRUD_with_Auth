import { Outlet } from "react-router-dom"
import SideBar from "./SideBar"


function Layout() {
  return (
    <div className="flex">
      <SideBar/>
      <main className="pl-[260px] w-full">
       <Outlet/> 
     </main>  
    </div>
  )
}

export default Layout