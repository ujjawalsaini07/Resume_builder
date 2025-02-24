import { Briefcase, Plus, Sparkles, Trash } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import api from "../configs/api";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";



const ExperienceForm = ({data, onChange})=>{

    const {token} = useSelector((state)=>state.auth);
    const [isGeneratingIndex, setIsGeneratingIndex] = useState(-1);

    const addExperience = ()=>{
        const newExperience = {
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            description: "",
            is_current: false,
        };
        onChange([...data, newExperience]);
    }

    const removeExperience = (index)=>{
        const updatedExperience = data.filter((_,i)=>i!==index);
        onChange(updatedExperience);
    }

    const updateExperience = (index, field, value)=>{
        const updated= [...data];
        updated[index] = {...updated[index], [field]: value};
        onChange(updated);
    }


    const generateDescription= async(index)=>{
        setIsGeneratingIndex(index);
        const experience = data[index];
        const prompt = [
            `Position: ${experience.position}`,
            `Company: ${experience.company}`,
            `Current description: ${experience.description}`,
        ].join("\n");


        try{

            const {data}= await api.post('/api/ai/enhance-job-desc', {userContent: prompt}, {headers:{Authorization: `Bearer ${token}`}});
            updateExperience(index, "description", data.enhancedContent);


        }
        catch(error){
            toast.error(error?.response?.data?.message || error.message);

        }
        finally{
            setIsGeneratingIndex(-1);
        }
    }




    return (
        <div className="space-y-6">

            <div className="flex items-start justify-between gap-3 flex-wrap">

                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">Professional Experience</h3>
                    <p className="text-sm text-slate-600">Add role details with outcomes and measurable impact.</p>
                </div>
                <button onClick={addExperience} className="flex items-center gap-2 px-3.5 py-2 text-sm bg-violet-100 text-violet-700 rounded-xl hover:bg-violet-200 transition-colors">
                    <Plus className="size-5"/>
                    Add Experience
                </button>

            </div>


            {data.length===0 ? (
                <div className="text-center py-8 text-slate-500 border border-slate-200 rounded-xl bg-slate-50/60">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-300"/>
                    <p>No professional experience added yet.</p>
                    <p>Click "Add Experience" to start building your resume.</p>
                </div>
            ):(
                <div className="space-y-4">

                    { data.map((experience, index)=>(
                        <div key={index} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">

                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-slate-800">Experience #{index+1}</h4>
                                <button onClick={()=>removeExperience(index)}className="text-red-500 hover:text-red-700 transition-colors" aria-label="Remove experience" >
                                    <Trash className="size-4" />
                                </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">

                                <input className="px-3 py-2.5 text-sm rounded-lg border border-slate-300" type="text" placeholder="Company" value={experience.company || ""} onChange={(e)=>updateExperience(index, "company", e.target.value)} />

                                <input className="px-3 py-2.5 text-sm rounded-lg border border-slate-300" type="text" placeholder="Job Title" value={experience.position || ""} onChange={(e)=>updateExperience(index, "position", e.target.value)} />

                                <input className="px-3 py-2.5 text-sm rounded-lg border border-slate-300" type="month" placeholder="Start Date" value={experience.start_date || ""} onChange={(e)=>updateExperience(index, "start_date", e.target.value)} />

                                <input  disabled={experience.is_current} className="px-3 py-2.5 text-sm rounded-lg border border-slate-300 disabled:bg-gray-100" type="month" placeholder="End Date" value={experience.end_date || ""} onChange={(e)=>updateExperience(index, "end_date", e.target.value)} />

                            </div>

                            <label className="flex items-center gap-2 text-sm text-slate-700">
                                <input type="checkbox" checked={experience.is_current || false} onChange={(e)=>updateExperience(index, "is_current", e.target.checked ? true: false)} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-300"/>
                                I currently work here
                            </label>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">

                                    <label className="text-sm font-medium text-slate-700">
                                        Job Description
                                    </label>
                                    <button onClick={() => generateDescription(index)} disabled={isGeneratingIndex === index || !experience.position || !experience.company} className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors disabled:opacity-50">

                                        {isGeneratingIndex === index ? (<Loader2 className="w-3 h-3 animate-spin text-purple-800"/>) : (<Sparkles className="w-3 h-3 text-purple-800"/>)}

                                        {isGeneratingIndex === index ? "Enhancing..." : 'AI Enhance'}

                                    </button>

                                </div>

                                <textarea  placeholder="Describe your responsibilities and outcomes with measurable impact..." rows={4} className="w-full text-sm px-3 py-2.5 rounded-lg resize-none border border-slate-300" value={experience.description || ""}  onChange={(e)=> updateExperience(index, "description", e.target.value)} />
                            </div>

                        </div>
                    ))

                    }


                </div>
            )
            }

        </div>

    )
}

export default ExperienceForm;
