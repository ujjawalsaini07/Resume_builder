import {
  CalendarClock,
  FilePenIcon,
  Files,
  Globe,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  Sparkles,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api";
import pdfToText from "react-pdftotext";

const pdfToTextFn = pdfToText?.default || pdfToText;


const Dashboard =()=>{

  const {user,token}=useSelector(state=>state.auth);

  //state variables for listing and modal controls
  const [isLoading, setIsLoading] = useState(false);
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')

  //create colors
  const colors=["#5A9B82", "#6D96B5", "#897AB0", "#B57E91", "#BAA072", "#AC7269"]
  const navigate = useNavigate()


  const sortedResumes = [...allResumes].sort(
    (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
  );

  const totalResumes = sortedResumes.length;
  const publicResumes = sortedResumes.filter((item) => item.public).length;
  const latestResume = sortedResumes[0];

  const loadAllResumes = useCallback(async()=>{

    try{

      const {data} = await api.get('/api/users/resumes', {headers:{Authorization:token}})
      setAllResumes(data.resumes)

    }
    catch(error){
      toast.error(error?.response?.data?.message || error.message || "Something went wrong")
    }


  }, [token])

  //createresume functionwhich will be called when the user clicks on the create resume button and it will create a new resume

  const createResume = async(event)=>{
    try{

      event.preventDefault();
      const {data} =await api.post('/api/resumes/create',{title}, {headers:{Authorization:token}})

      setAllResumes((prev)=>[data.resume, ...prev])
      setTitle('');
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`)


    }catch(error){
      toast.error(error?.response?.data?.message || error.message || "Something went wrong")
    }

  }

  //upload resume function
  const uploadResume = async(event)=>{
    if(!resume){
      toast.error("Please choose a PDF resume file first")
      return;
    }

    event.preventDefault();
    setIsLoading(true);

    try{
      const resumeText = await pdfToTextFn(resume);
      const {data} = await api.post('/api/ai/upload-resume',{title, resumeText}, {headers:{Authorization:token}})

      setTitle('');
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`)

    }
    catch(error){

      toast.error(error?.response?.data?.error || error?.response?.data?.message || error.message || "Something went wrong")


    }
    finally{
      setIsLoading(false);
    }

  }

  //edit resume title function
  const editTitle = async(event)=>{

    try{
      event.preventDefault()
      const {data} = await api.put('/api/resumes/update', {resumeId: editResumeId, title}, {headers:{Authorization:token}})
      setAllResumes((prev)=>prev.map((item) => item._id === editResumeId ? {...item, title: title.trim()} : item))
      setTitle('');
      setEditResumeId('');
      toast.success(data.message)
    }
    catch(error){

      toast.error(error?.response?.data?.message || error.message || "Something went wrong")

    }

  }
  //delete resume function
  const deleteResume = async(resumeId)=>{

    const confirmDelete = window.confirm("Are you sure you want to delete this resume?")
    if(!confirmDelete){
      return;
    }

    try{

      const {data} = await api.delete(`/api/resumes/delete/${resumeId}`, {headers:{Authorization:token}})

      setAllResumes((prev)=>prev.filter((item) => item._id !== resumeId))
      toast.success(data.message)

    }
    catch(error){
      toast.error(error?.response?.data?.message || error.message || "Something went wrong")
    }

  }


  useEffect(()=>{
    loadAllResumes();
  }, [loadAllResumes])



  return(
    <div id="dashboard-top" className="relative overflow-hidden">
      <div className="absolute -top-24 left-1/4 -z-10 size-96 rounded-full bg-green-200/40 blur-[100px]"></div>
      <div className="absolute top-40 right-0 -z-10 size-72 rounded-full bg-emerald-100/60 blur-[100px]"></div>

      <div className="w-full py-2.5 font-medium text-sm text-green-800 text-center bg-gradient-to-r from-[#ABFF7E] to-[#FDFEFF] border-b border-green-200/40">
        <p>
          <span className="px-3 py-1 rounded-lg text-white bg-green-600 mr-2">Tip</span>
          Keep your resume updated weekly for better interview responses.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10 text-slate-800">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <section className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 text-sm text-green-800 bg-green-400/10 border border-green-200 rounded-full px-4 py-1">
              <Sparkles className="size-4" />
              <span>Resume Workspace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-semibold mt-4 leading-tight max-w-3xl">
              Welcome back, <span className="bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">{user?.name || "Creator"}</span>
            </h1>

            <p className="text-slate-600 text-base mt-4 max-w-2xl">
              Build, refine, and publish resumes with a cleaner workflow. Use AI enhancements, keep versions organized,
              and share polished public profiles confidently.
            </p>
          </section>

          <section className="lg:col-span-4 grid gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur p-4">
              <p className="text-sm text-slate-500">Most recent update</p>
              <p className="font-semibold text-slate-800 mt-1 truncate">{latestResume?.title || "No resumes yet"}</p>
              <p className="text-xs text-slate-500 mt-2">
                {latestResume?.updatedAt ? `Updated ${new Date(latestResume.updatedAt).toLocaleDateString()}` : "Create your first resume to begin"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur p-4">
              <p className="text-sm text-slate-500">Public resumes</p>
              <p className="font-semibold text-slate-800 mt-1">{publicResumes} of {totalResumes}</p>
              <p className="text-xs text-slate-500 mt-2">Set a resume to public from the builder to enable sharing.</p>
            </div>
          </section>
        </div>

        <section className="grid sm:grid-cols-3 gap-4 mt-8">
          <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
            <div className="inline-flex p-2 rounded-lg bg-green-100 text-green-700">
              <Files className="size-5" />
            </div>
            <p className="text-sm text-slate-500 mt-3">Total Resumes</p>
            <p className="text-2xl font-semibold mt-1">{totalResumes}</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
            <div className="inline-flex p-2 rounded-lg bg-blue-100 text-blue-700">
              <Globe className="size-5" />
            </div>
            <p className="text-sm text-slate-500 mt-3">Public Shares</p>
            <p className="text-2xl font-semibold mt-1">{publicResumes}</p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
            <div className="inline-flex p-2 rounded-lg bg-violet-100 text-violet-700">
              <CalendarClock className="size-5" />
            </div>
            <p className="text-sm text-slate-500 mt-3">Latest Activity</p>
            <p className="text-base font-semibold mt-1 truncate">{latestResume?.title || "No activity yet"}</p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4 mt-8">
          <button
            onClick={()=>setShowCreateResume(true)}
            className="text-left rounded-2xl border border-dashed border-slate-300 bg-white p-6 group hover:border-green-600 hover:shadow-md transition-all"
          >
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white">
              <PlusIcon className="size-5" />
            </div>
            <h3 className="text-lg font-semibold mt-4">Create a New Resume</h3>
            <p className="text-sm text-slate-600 mt-1">Start from a clean structure and customize template, sections, and style.</p>
          </button>

          <button
            onClick={()=> setShowUploadResume(true)}
            className="text-left rounded-2xl border border-dashed border-slate-300 bg-white p-6 group hover:border-green-600 hover:shadow-md transition-all"
          >
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-800 text-white">
              <UploadCloudIcon className="size-5" />
            </div>
            <h3 className="text-lg font-semibold mt-4">Upload and Parse Existing Resume</h3>
            <p className="text-sm text-slate-600 mt-1">Import a PDF and let AI convert it into editable, structured resume sections.</p>
          </button>
        </section>

        <section id="resume-library" className="mt-12">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-2xl font-semibold">Your Resume Library</h2>
            <p className="text-sm text-slate-500">{totalResumes} items</p>
          </div>

          {sortedResumes.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="inline-flex p-3 rounded-xl bg-green-100 text-green-700 mb-4">
                <FilePenIcon className="size-6" />
              </div>
              <h3 className="text-xl font-semibold">No resumes yet</h3>
              <p className="text-slate-600 mt-2 max-w-xl mx-auto">Create your first resume to unlock AI enhancement, live preview, and shareable public links.</p>
              <button
                onClick={()=>setShowCreateResume(true)}
                className="mt-5 px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition"
              >
                Create Resume
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedResumes.map((item, index)=>{
                const baseColor= colors[index % colors.length];
                const experienceCount = (item.experience || []).filter((exp) => exp?.company || exp?.position || exp?.description).length;
                const educationCount = (item.education || []).filter((edu) => edu?.institution || edu?.degree || edu?.field).length;
                const projectCount = (item.project || []).filter((project) => project?.name || project?.description).length;
                const skillCount = (item.skills || []).length;
                const hasSummary = Boolean(item.professional_summary?.trim());
                const filledSections = [
                  Boolean(item.personal_info?.full_name || item.personal_info?.email),
                  hasSummary,
                  experienceCount > 0,
                  educationCount > 0,
                  projectCount > 0,
                  skillCount > 0,
                ].filter(Boolean).length;
                const templateName = item.template
                  ? item.template
                      .split('-')
                      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                      .join(' ')
                  : 'Classic';

                return(
                  <button
                    onClick={()=> navigate(`/app/builder/${item._id}`)}
                    key={item._id}
                    className='relative h-64 rounded-2xl border p-5 text-left group hover:shadow-lg transition-all duration-300 overflow-hidden'
                    style={{background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}38)`,borderColor: baseColor + '55'}}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none" style={{background: `radial-gradient(circle at top right, ${baseColor}33, transparent 50%)`}}></div>

                    <div className="relative z-10 flex items-start justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-700">
                        <FilePenIcon className="size-3.5" />
                        {item.public ? "Public" : "Private"}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {templateName}
                      </span>
                      <div onClick={(e)=>e.stopPropagation()} className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={()=>{setEditResumeId(item._id); setTitle(item.title)}}
                          className="size-8 rounded-md bg-white/65 hover:bg-white text-slate-700 flex items-center justify-center transition-colors"
                          aria-label="Edit title"
                        >
                          <PencilIcon className="size-4"/>
                        </button>
                        <button
                          onClick={()=>deleteResume(item._id)}
                          className="size-8 rounded-md bg-white/65 hover:bg-white text-slate-700 flex items-center justify-center transition-colors"
                          aria-label="Delete resume"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    </div>

                    <div className="relative z-10 mt-5">
                      <p className="text-xl font-semibold text-slate-800 line-clamp-2">{item.title}</p>
                      <p className="text-sm text-slate-600 mt-2">
                        Updated {new Date(item.updatedAt).toLocaleDateString()}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                        <p>Sections: {filledSections}/6</p>
                        <p>Summary: {hasSummary ? 'Added' : 'Missing'}</p>
                        <p>Experience: {experienceCount}</p>
                        <p>Education: {educationCount}</p>
                        <p>Projects: {projectCount}</p>
                        <p>Skills: {skillCount}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </section>

        <section id="dashboard-tips" className="mt-12 grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Build Better Resumes Faster</h3>
            <ul className="mt-3 space-y-3 text-sm text-slate-600 list-disc pl-5">
              <li>Use measurable results in your experience lines (numbers, percentages, impact).</li>
              <li>Keep summaries to 3-4 lines and tailor keywords to the job role.</li>
              <li>Review each section in preview mode before sharing publicly.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Quick Workflow</h3>
            <p className="text-sm text-slate-600 mt-2">Create or upload, enhance text with AI, set visibility, then share your public link.</p>
          </div>
        </section>
      </div>


          {/* this is the pop up form for creating new resume which will be shown when the user clicks on the create resume button and it will have a input field for the title of the resume and a button to create the resume and also a button to close the form */}
        {
          showCreateResume && (
            <form onSubmit={createResume} onClick={()=>setShowCreateResume(false)} className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center px-4">

              <div onClick={e => e.stopPropagation()} className="relative bg-white border border-slate-200 shadow-xl rounded-2xl w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">Create a Resume</h2>
                <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder="Enter resume title" className="w-full px-4 py-2.5 mb-4 focus:border-green-600 ring-green-600" required/>

                <button className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Create Resume</button>
                <XIcon  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={()=>{setShowCreateResume(false); setTitle('')}}/>

              </div>

            </form>
          )
        }

        {
          showUploadResume && (
             <form onSubmit={uploadResume} onClick={()=>setShowUploadResume(false)} className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center px-4">

              <div onClick={e => e.stopPropagation()} className="relative bg-white border border-slate-200 shadow-xl rounded-2xl w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
                <input  onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder="Enter resume title" className="w-full px-4 py-2.5 mb-4 focus:border-green-600 ring-green-600" required/>

                {/* upload file input field */}
                <div>
                  <label htmlFor="resume-input" className="block text-sm text-slate-700">
                    Select your resume file
                    <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-300 border-dashed rounded-xl p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">

                      {/* checking if the resume state variable has data if it has data then show the name of the file otherwise show the upload icon and text to upload the resume */}
                      {resume ? (
                        <p className="text-green-700 text-slate-600 text-center break-all">{resume.name}</p>
                      ):(
                        <>
                           <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-r from-green-500 to-green-800 text-white rounded-full text-white rounded-full"/>
                          <p className="text-sm group-hover:text-green-600 transition-all duration-300">Click to upload your resume</p>
                        </>
                      )}
                    </div>
                  </label>
                  <input type="file" id='resume-input' accept=".pdf" hidden onChange={(e)=> setResume(e.target.files[0])} />

                </div>

                <button disabled={isLoading} className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  {/* checking if resume si being uploaded */}
                  {isLoading && <LoaderCircleIcon className="animate-spin size-4 text-white" />}
                  {isLoading ? 'Uploading...' : 'Upload Your Resume'}
                </button>
                <XIcon  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={()=>{setShowUploadResume(false); setTitle('')}}/>

              </div>

            </form>
          )
        }

        {
          editResumeId && (
            <form onSubmit={editTitle} onClick={()=>setEditResumeId('')} className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center px-4">

              <div onClick={e => e.stopPropagation()} className="relative bg-white border border-slate-200 shadow-xl rounded-2xl w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">Edit Resume Title</h2>
                <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder="Enter resume title" className="w-full px-4 py-2.5 mb-4 focus:border-green-600 ring-green-600" required/>

                <button className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Update</button>
                <XIcon  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={()=>{setEditResumeId(''); setTitle('')}}/>

              </div>

            </form>
          )
        }

    </div>
  )
}

export default Dashboard
