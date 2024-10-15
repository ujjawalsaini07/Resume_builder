import { Plus, Sparkle, X } from "lucide-react";
import React from "react";

const SkillsForm = ({data, onChange})=>{

    const [newSkill, setNewSkill] = React.useState("");

    const addSkill=()=>{
        if(newSkill.trim() && !data.includes(newSkill.trim())) {

            onChange([...data, newSkill.trim()]);
            setNewSkill("");

        }

    }

    const removeSkill = (indexToRemove)=>{
        onChange(data.filter((_,index)=>index!==indexToRemove));
    }

    const handleKeyPress=(e)=>{
        if(e.key=="Enter"){
            e.preventDefault();
            addSkill();
        }
    }

    return(
        <div className="space-y-4">

            <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">Skills</h3>
                <p className="text-sm text-slate-600">Add role-relevant skills recruiters search for.</p>
            </div>

            <div className="flex gap-2 flex-wrap sm:flex-nowrap">

                <input type="text" placeholder="Enter a skill (e.g. JavaScript, Project Management)" className="flex-1 px-3 py-2.5 text-sm border border-slate-300 rounded-lg" onChange={(e)=>setNewSkill(e.target.value)} value={newSkill} onKeyDown={handleKeyPress}/>

                <button onClick={addSkill} disabled={!newSkill.trim()} className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-24">
                    <Plus  className="size-4 transition-colors"/>
                    Add
                </button>

            </div>

            {data.length>0 ? (
                <div className="flex flex-wrap gap-2">

                    {data.map((skill, index)=>(
                        <span key={index} className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm border border-emerald-200">
                            {skill}
                            <button onClick={()=>removeSkill(index)} className="ml-1 hover:bg-emerald-200 rounded-full p-0.5 transition-colors" aria-label="Remove skill">
                                <X className="w-3 h-3"/>
                            </button>
                        </span>
                    ))}

                </div>
            ) : (
                <div className="text-center py-6 text-slate-500 border border-slate-200 rounded-xl bg-slate-50/60">
                    <Sparkle className="w-10 h-10 text-slate-300 mx-auto mb-3"/>
                    <p className="text-center">No skills added yet.</p>
                    <p className="text-sm">Start by adding your first skill.</p>
                </div>
            )}

            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                <p className="text-sm text-emerald-800"><strong>Tip:</strong> Add 8-12 relevant skills. Mix technical and soft skills for stronger ATS relevance.</p>
            </div>

        </div>
    )

}

export default SkillsForm;
