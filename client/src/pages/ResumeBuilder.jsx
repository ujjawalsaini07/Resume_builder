import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  BadgeCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Save,
  Share2Icon,
  Sparkles,
  User,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummary from "../components/ProfessionalSummary";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";


const ResumeBuilder =()=>{

  const {resumeId}= useParams();
  const {token}=useSelector((state)=>state.auth);
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    education: [],
    skills: [],
    project: [],
    template:"classic",
    accent_color: "#3B82F6",
    public:false,
  })

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [isFinalSaving, setIsFinalSaving] = useState(false);

  const sections = [
    {id: "personal", name: "Personal Info", icon:User},
    {id: "summary", name: "Summary", icon:FileText},
    {id: "experience", name: "Experience", icon: Briefcase},
    {id: "education", name: "Education", icon:GraduationCap},
    {id: "projects", name: "Projects", icon:FolderIcon},
    {id: "skills", name: "Skills", icon:Sparkles},
  ]

  const activeSection = sections[activeSectionIndex];

  const completionScore = useMemo(() => {
    const points = [
      Boolean(resumeData?.personal_info?.full_name && resumeData?.personal_info?.email),
      Boolean(resumeData?.professional_summary?.trim()),
      Boolean((resumeData?.experience || []).some((item) => item.company || item.position || item.description)),
      Boolean((resumeData?.education || []).some((item) => item.institution || item.degree)),
      Boolean((resumeData?.project || []).some((item) => item.name || item.description)),
      Boolean((resumeData?.skills || []).length >= 3),
    ];

    const completed = points.filter(Boolean).length;
    return Math.round((completed / points.length) * 100);
  }, [resumeData]);

  useEffect(()=>{
    let isMounted = true;

    const loadExistingResume = async () => {
      try{
        const {data}= await api.get('/api/resumes/get/'+ resumeId,{
          headers:{
            Authorization: token
          }
        })

        if(isMounted && data.resume){
          setResumeData(data.resume);
          document.title = data.resume.title;
        }
      }
      catch(error){
        toast.error(error?.response?.data?.message || error.message || "Failed to load resume");
      }
    };

    if(token){
      loadExistingResume();
    }

    return ()=>{
      isMounted = false;
    };
  },[resumeId, token])

  //function to toggle resume visibility
  const changeResumeVisibility = async()=>{
    try{

      const formdata = new FormData();
      formdata.append('resumeId', resumeData._id);
      formdata.append("resumeData", JSON.stringify({public: !resumeData.public}));

      const {data}= await api.put('/api/resumes/update/', formdata,{headers:{
        Authorization: token
      }})

      setResumeData((prev)=>({...prev, public: !prev.public}));
      toast.success(data.message);

    }
    catch(error){
      toast.error(error?.response?.data?.message || error.message || "Failed to update visibility");

    }

  }

  //function to handle resume shareing

  const handlShare =()=>{

    const resumeUrl = `${window.location.origin}/view/${resumeId}`;

    if(navigator.share){
      navigator.share({url: resumeUrl, title: resumeData.title}).catch(()=>{});
      return;
    }

    if(navigator.clipboard?.writeText){
      navigator.clipboard.writeText(resumeUrl);
      toast.success("Public link copied to clipboard");
      return;
    }

    window.prompt("Copy this public resume link:", resumeUrl);

  }


  const downloadResume =()=>{
    window.print();
  }

  //function to handle resume update when user click on save changes button

  const saveResume = useCallback(async()=>{

    try{

      let updatedResumeData = structuredClone(resumeData);

      //remove image from updatedResumeData before sending to backend if removeBackground is true

      if(typeof resumeData.personal_info.image==='object'){
        delete updatedResumeData.personal_info.image;
      }

      const formdata = new FormData();
      formdata.append('resumeId', resumeId);
      formdata.append('resumeData', JSON.stringify(updatedResumeData));
      removeBackground && formdata.append('removeBackground', 'yes');

      typeof resumeData.personal_info.image === 'object' && formdata.append('image', resumeData.personal_info.image);

      const {data} = await api.put('/api/resumes/update', formdata, {
        headers:{
          Authorization: token
        }
      })

      setResumeData(data.resume)


    }
    catch(error){
      throw new Error(error?.response?.data?.message || error.message || 'Failed to save resume');
    }

  }, [removeBackground, resumeData, resumeId, token])

  const saveResumeAndGoDashboard = async()=>{
    try{
      setIsFinalSaving(true);
      await saveResume();
      toast.success("Resume saved successfully");
      navigate('/app');
    }
    catch(error){
      toast.error(error?.message || "Failed to save resume");
    }
    finally{
      setIsFinalSaving(false);
    }
  }

  useEffect(() => {
    const handleBuilderNavigationRequest = async (event) => {
      const target = event?.detail?.target;

      if (!target) {
        return;
      }

      const shouldSave = window.confirm("Do you want to save current changes before exiting?");
      if (!shouldSave) {
        return;
      }

      try {
        setIsFinalSaving(true);
        await saveResume();
        toast.success("Changes saved successfully");
        navigate(target);
      } catch (error) {
        toast.error(error?.message || "Failed to save resume");
      } finally {
        setIsFinalSaving(false);
      }
    };

    window.addEventListener("resume-builder-navigation-request", handleBuilderNavigationRequest);

    return () => {
      window.removeEventListener("resume-builder-navigation-request", handleBuilderNavigationRequest);
    };
  }, [navigate, saveResume])



  return(
    <div id="resume-builder-top" className="relative overflow-hidden">
      <div className="absolute -top-20 left-1/4 -z-10 size-96 rounded-full bg-green-200/35 blur-[100px]"></div>
      <div className="absolute top-40 right-0 -z-10 size-80 rounded-full bg-emerald-100/65 blur-[110px]"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link to={'/app'} className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all">
            <ArrowLeftIcon className="size-4"/> Back to Dashboard
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-800">
            <BadgeCheck className="size-4" />
            Completion {completionScore}%
          </div>
        </div>

        <div className="mt-5 grid lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900 mt-1 truncate max-w-xs sm:max-w-sm">{resumeData.title || "Untitled Resume"}</h1>
                </div>

                <div className="flex items-center gap-2">
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=>setResumeData(prev=>({...prev, template}))}/>
                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData(prev=>({...prev, accent_color:color}))}/>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={()=>setActiveSectionIndex((prevIndex)=>Math.max(prevIndex-1, 0))}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={activeSectionIndex===0}
                  >
                    <ChevronLeft className="size-4"/>
                    Previous
                  </button>

                  <button
                    onClick={()=>setActiveSectionIndex((prevIndex)=>Math.min(prevIndex+1, sections.length))}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={activeSectionIndex===sections.length-1}
                  >
                    Next
                    <ChevronRight className="size-4"/>
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={()=>{
                      toast.promise(saveResume(),{
                        loading: 'Saving changes...',
                        success: 'Changes saved successfully',
                        error: (err) => err?.message || 'Failed to save resume',
                      })
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all rounded-lg px-4 py-2 text-sm"
                  >
                    <Save className="size-4" />
                    Save Changes
                  </button>

                  {completionScore === 100 && (
                    <button
                      onClick={saveResumeAndGoDashboard}
                      disabled={isFinalSaving}
                      className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm border border-emerald-300 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors disabled:opacity-60"
                    >
                      {isFinalSaving ? "Saving..." : "Save Resume"}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                    style={{ width: `${((activeSectionIndex + 1) * 100) / sections.length}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Section {activeSectionIndex + 1} of {sections.length}: {activeSection.name}</p>
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isActive = section.id === activeSection.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSectionIndex(index)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${isActive ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
                    >
                      <Icon className="size-4" />
                      <span className="truncate">{section.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/40 p-4 sm:p-5">
                { activeSection.id === "personal" && (
                  <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=>setResumeData(prev=>({...prev,personal_info:data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground}/>
                )}

                { activeSection.id === "summary" && (
                  <ProfessionalSummary data={resumeData.professional_summary} onChange={(summary)=>setResumeData(prev=>({...prev, professional_summary: summary}))} setResumeData={setResumeData}/>
                )}

                { activeSection.id === "experience" && (
                  <ExperienceForm data={resumeData.experience} onChange={(experience)=>setResumeData(prev=>({...prev, experience}))} setResumeData={setResumeData}/>
                )}

                { activeSection.id === "education" && (
                  <EducationForm data={resumeData.education} onChange={(education)=>setResumeData(prev=>({...prev, education}))} setResumeData={setResumeData}/>
                )}

                { activeSection.id === "projects" && (
                  <ProjectForm data={resumeData.project || []} onChange={(project)=>setResumeData(prev=>({...prev, project}))} setResumeData={setResumeData}/>
                )}

                { activeSection.id === "skills" && (
                  <SkillsForm data={resumeData.skills || []} onChange={(skills)=>setResumeData(prev=>({...prev, skills}))} setResumeData={setResumeData}/>
                )}
              </div>
            </div>
          </section>

          <section className="lg:col-span-7">
            <div className="lg:sticky lg:top-24 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Preview Panel</p>
                    <p className="text-xs text-slate-500">Live preview based on selected template and content.</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    { resumeData.public && (
                      <button onClick={handlShare} className="inline-flex items-center px-3 py-2 gap-2 text-xs bg-blue-100 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-200 transition-colors">
                        <Share2Icon className="size-4"/>
                        Share
                      </button>
                    )}

                    <button onClick={changeResumeVisibility} className="inline-flex items-center px-3 py-2 gap-2 text-xs bg-violet-100 text-violet-700 rounded-lg border border-violet-200 hover:bg-violet-200 transition-colors">
                      {resumeData.public ? <EyeIcon className="size-4"/> : <EyeOffIcon className="size-4"/>}
                      {resumeData.public ? 'Public' : 'Private'}
                    </button>

                    <button onClick={downloadResume} className="inline-flex items-center gap-2 px-4 py-2 text-xs bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 hover:bg-emerald-200 transition-colors">
                      <DownloadIcon className="size-4"/>
                      Download
                    </button>
                  </div>
                </div>
              </div>

              <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes="mx-auto"/>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
