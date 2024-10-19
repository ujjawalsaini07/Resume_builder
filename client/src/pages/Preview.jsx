import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import ResumePreview from "../components/ResumePreview";
import { ArrowLeftIcon, Loader } from "lucide-react";
import api from "../configs/api";

const Preview =()=>{

  //loading resume data based on resumeId from url
  const resumeId = useParams().resumeId;
  const { pathname } = useLocation();
  const { token } = useSelector((state)=>state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [resumeData, setResumeData] = useState(null);

  const loadResume=useCallback(async()=>{
    setIsLoading(true);
    setErrorMessage("");

    try{
      const isOwnerPreview = pathname.startsWith('/app/view');

      if(isOwnerPreview && token){
        const {data} = await api.get(`/api/resumes/get/${resumeId}`, {headers:{Authorization: token}});
        if(data.resume){
          setResumeData(data.resume);
          return;
        }
      }

      const {data} = await api.get(`/api/resumes/public/${resumeId}`);
      setResumeData(data.resume || null);
    }
    catch(error){
      setResumeData(null);
      setErrorMessage(error?.response?.data?.message || "Resume not found. It may have been deleted or the URL is incorrect.");
    }
    finally{
      setIsLoading(false);
    }
  }, [pathname, resumeId, token])

  useEffect(()=>{
    loadResume();
  }, [loadResume])

  //but there will be a flash of empty content before data loads, so we can show a loading state

  return(
    <div>

      {resumeData ? (

        <div className="bg-slate-100">
          <div className="max-w-3xl mx-auto py-10">
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes="py-4 bg-white"/>
          </div>
        </div>

      ):(
        // if resume is not found or loading, show a message
        <div>
          {isLoading ? <Loader/> : (
            <div className="flex flex-col items-center justify-center h-screen">
              <p className="text-center text-6xl text-slate-400 font-medium">
                {errorMessage || "Resume not found. It may have been deleted or the URL is incorrect."}
              </p>
              <Link to="/" className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors">
                <ArrowLeftIcon  className="mr-2 size-4"/>
                Go to Home Page
              </Link>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default Preview
