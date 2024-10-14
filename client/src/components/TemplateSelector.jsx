import { Check, Layout } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const TemplateSelector = ({selectedTemplate, onChange})=>{

    const [isOpen, setIsOpen] =useState(false);
    const containerRef = useRef(null);

    const templates = [
        {id:"classic", name:"Classic", preview: "A clean and traditional layout focused on readability and balanced sections."},
        {id:"modern", name:"Modern", preview: "A bold layout with stronger visual hierarchy and high-impact structure."},
        {id:"minimal", name:"Minimal", preview: "A clean and lightweight structure with generous spacing and subtle styling."},
        {id:"minimal-image", name:"Minimal + Image", preview: "A concise profile-forward layout with space for a professional image."},
    ]

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedTemplateData = templates.find((template) => template.id === selectedTemplate) || templates[0];

    return(
        <div className="relative" ref={containerRef}>

            <button
                onClick={()=> setIsOpen((prev) => !prev)}
                className="flex items-center gap-2 text-sm text-emerald-700 bg-gradient-to-br from-emerald-100 to-white border border-emerald-200 hover:border-emerald-300 hover:shadow-sm transition-all px-3 py-2 rounded-xl"
                aria-haspopup="menu"
                aria-expanded={isOpen}
            >
                <Layout className="size-4"/>
                <span className="max-sm:hidden">Template</span>
                <span className="text-xs font-medium text-emerald-800">{selectedTemplateData.name}</span>

            </button>

            { isOpen && (
                <div className="absolute top-full left-0 w-80 max-w-[85vw] p-3 mt-2 space-y-2 z-20 bg-white/95 backdrop-blur rounded-2xl border border-slate-200 shadow-xl" role="menu">

                    {templates.map((template)=>(
                        <button
                            type="button"
                            key={template.id}
                            onClick={()=>{onChange(template.id);setIsOpen(false)}}
                            className={`w-full text-left cursor-pointer relative p-3 border rounded-xl transition-all ${selectedTemplate===template.id ? "border-emerald-300 bg-emerald-50": "border-slate-200 hover:bg-slate-50 hover:border-slate-300"}`}
                            role="menuitem"
                        >

                            {selectedTemplate === template.id && <div className="absolute top-2 right-2 text-green-500">
                                <div className="size-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white"/>
                                </div>

                            </div>
                            }

                            <div className="space-y-1">
                                <h4 className="font-medium text-slate-800">{template.name}</h4>
                                <div className="mt-2 p-2 bg-slate-50 rounded-lg text-xs text-slate-600 italic">
                                    {template.preview}
                                </div>
                            </div>

                        </button>
                    ))}

                </div>
            )

            }



        </div>
    )

}

export default TemplateSelector;
