import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import { useSelector } from "react-redux";
import Loader from "../components/Loader.jsx";
import Login from "./Login.jsx";

const Layout =()=>{

  //check if user is logged in, if not redirect to login page

  const {user,loading}=useSelector(state=>state.auth);

  if(loading){
    return <Loader/>
  }


  return(
    <div>

      {
        //checking if user logged in, if yes show the dashboard, if not show the login page
        user ? (<div className="min-h-screen bg-gradient-to-b from-white via-green-50/40 to-white">
            <Navbar />
            <Outlet />
        </div>
        ) : <Login/>
      }



    </div>
  )
}

export default Layout
