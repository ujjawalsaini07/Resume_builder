import { Trash2 } from "lucide-react";
import React from "react";
import { Plus } from "lucide-react";

const ProjectForm = ({data, onChange})=>{


    const addProject = ()=>{
        const newProject = {
            name: "",
            description: "",
            type: "",
        };
        onChange([...data, newProject]);
    }

    const removeProject= (index)=>{
        const updatedProject = data.filter((_,i)=>i!==index);
        onChange(updatedProject);
    }

    const updateProject = (index, field, value)=>{
        const updated= [...data];
        updated[index] = {...updated[index], [field]: value};
        onChange(updated);
    }





    return (

        <div>

        <div>

            <div className="flex items-start justify-between gap-3 flex-wrap">

                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">Projects</h3>
                    <p className="text-sm text-slate-600">Highlight meaningful projects with stack and outcomes.</p>
                </div>
                <button onClick={addProject} className="flex items-center gap-2 px-3.5 py-2 text-sm bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors">
                    <Plus className="size-5"/>
                    Add Project
                </button>

            </div>



            <div className="space-y-4 mt-4">

                    {data.length===0 && (
                        <div className="text-center py-8 text-slate-500 border border-slate-200 rounded-xl bg-slate-50/60">
                            <p>No projects added yet.</p>
                            <p>Add projects to strengthen your resume profile.</p>
                        </div>
                    )}

                    { data.map((project, index)=>(
                        <div key={index} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">

                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-slate-800">Project #{index+1}</h4>
                                <button onClick={()=>removeProject(index)}className="text-red-500 hover:text-red-700 transition-colors" aria-label="Remove project" >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>

                            <div className=" grid gap-3">

                                <input className="px-3 py-2.5 text-sm rounded-lg border border-slate-300" type="text" placeholder="Project Name" value={project.name || ""} onChange={(e)=>updateProject(index, "name", e.target.value)} />


                                <input className="px-3 py-2.5 text-sm rounded-lg border border-slate-300" type="text" placeholder="Project Type / Stack" value={project.type || ""} onChange={(e)=>updateProject(index, "type", e.target.value)} />

                                <textarea value={project.description || ""} onChange={(e)=>updateProject(index, "description",e.target.value)} className="w-full resize-none px-3 py-2.5 text-sm rounded-lg border border-slate-300" placeholder="Describe what you built, your role, and the result." rows={4} />



                            </div>



                        </div>
                    ))

                    }


            </div>

        </div>

        </div>

    )
}

export default ProjectForm;
