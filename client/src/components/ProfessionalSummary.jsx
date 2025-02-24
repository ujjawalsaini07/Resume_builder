import { Loader2, Sparkles } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import api from "../configs/api";
import toast from "react-hot-toast";

const ProfessionalSummary = ({data, onChange, setResumeData})=>{

    const {token} = useSelector((state)=>state.auth);

    const [isGenerating, setIsGenerating] = useState(false);

    const generateSummary= async()=>{
        try{
            if(!data?.trim()){
                toast.error("Please enter a summary before enhancing");
                return;
            }

            setIsGenerating(true);
            const response= await api.post("/api/ai/enhance-pro-sum", {userContent : data}, {headers: {Authorization:`Bearer ${token}`}} )

            setResumeData(prev=>({...prev, professional_summary: response.data.enhancedContent}));


        }
        catch(error){
            toast.error(error?.response?.data?.message || error.message)
        }
        finally{
            setIsGenerating(false);
        }
    }

    return(

        <div className="space-y-4">

            <div className="flex items-start justify-between gap-3 flex-wrap">

                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">Professional Summary</h3>
                    <p className="text-sm text-slate-600">Write a concise summary aligned with your target role.</p>
                </div>
                <button
                    disabled={isGenerating}
                    onClick={generateSummary}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-sm bg-violet-100 text-violet-700 rounded-xl hover:bg-violet-200 transition-colors disabled:opacity-50"
                >
                    {isGenerating ? (<Loader2 className="size-4 animate-spin" />) : (<Sparkles className="size-4"/>)}
                    {isGenerating ? "Enhancing..." : "AI Enhance"}
                </button>

            </div>

            <div>
                <textarea
                    rows={8}
                    value={data || ""}
                    onChange={(e)=>onChange(e.target.value)}
                    className="w-full p-3.5 px-4 mt-2 border text-sm border-slate-300 rounded-xl focus:ring focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-colors resize-none bg-white"
                    placeholder="Write a compelling summary highlighting experience, strengths, and career impact..."
                />

                <p className="text-xs text-slate-500 mt-2">Tip: keep it to 3-4 lines and include measurable impact where possible.</p>
            </div>

        </div>

    )
}

export default ProfessionalSummary;
