import { GraduationCap } from "lucide-react";
import React from "react";
import { Plus, Trash } from "lucide-react";

const EducationForm = ({data, onChange})=>{

    const addEducation = ()=>{
        const newEducation = {
            institution: "",
            degree: "",
            field:"",
            graduation_date: "",
            gpa: "",
        };
        onChange([...data, newEducation]);
    }

    const removeEducation= (index)=>{
        const updatedEducation = data.filter((_,i)=>i!==index);
        onChange(updatedEducation);
    }

    const updateEducation = (index, field, value)=>{
        const updated= [...data];
        updated[index] = {...updated[index], [field]: value};
        onChange(updated);
    }



    return(

        <div>

            <div className="space-y-6">

            <div className="flex items-start justify-between gap-3 flex-wrap">

                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">Education</h3>
                    <p className="text-sm text-slate-600">Highlight degrees, institutions, and core academic achievements.</p>
                </div>
                <button onClick={addEducation} className="flex items-center gap-2 px-3.5 py-2 text-sm bg-violet-100 text-violet-700 rounded-xl hover:bg-violet-200 transition-colors">
                    <Plus className="size-5"/>
                    Add Education
                </button>

            </div>


            {data.length===0 ? (
                <div className="text-center py-8 text-slate-500 border border-slate-200 rounded-xl bg-slate-50/60">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 text-slate-300"/>
                    <p>No educational background added yet.</p>
                    <p>Click "Add Education" to start building your resume.</p>
                </div>
            ):(
                <div className="space-y-4">

                    { data.map((education, index)=>(
                        <div key={index} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">

                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-slate-800">Education #{index+1}</h4>
                                <button onClick={()=>removeEducation(index)}className="text-red-500 hover:text-red-700 transition-colors" aria-label="Remove education" >
                                    <Trash className="size-4" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">

                                <input className="px-3 py-2.5 text-sm rounded-lg border border-slate-300" type="text" placeholder="Institution" value={education.institution || education.institute || ""} onChange={(e)=>updateEducation(index, "institution", e.target.value)} />

                                <input className="px-3 py-2.5 text-sm rounded-lg border border-slate-300" type="text" placeholder="Degree (e.g., B.Sc., M.A.)" value={education.degree || ""} onChange={(e)=>updateEducation(index, "degree", e.target.value)} />

                                <input className="px-3 py-2.5 text-sm rounded-lg border border-slate-300" type="text" placeholder="Field of Study" value={education.field || ""} onChange={(e)=>updateEducation(index, "field", e.target.value)} />

                                <input className="px-3 py-2.5 text-sm rounded-lg border border-slate-300" type="month" placeholder="Graduation Date" value={education.graduation_date || ""} onChange={(e)=>updateEducation(index, "graduation_date", e.target.value)} />

                            </div>

                            <input className="px-3 py-2.5 text-sm rounded-lg border border-slate-300" type="text" placeholder="GPA / Grade" value={education.gpa || ""} onChange={(e)=>updateEducation(index, "gpa", e.target.value)} />

                        </div>
                    ))

                    }


                </div>
            )
            }

        </div>

        </div>

    )



}

export default EducationForm;
