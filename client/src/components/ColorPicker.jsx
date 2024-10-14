import { CheckIcon, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ColorPicker = ({selectedColor, onChange})=>{

    const colors = [
        {name:"Blue", value:"#3B82F6"},
        {name:"Red", value:"#EF4444"},
        {name:"Green", value:"#10B981"},
        {name:"Yellow", value:"#F59E0B"},
        {name:"Purple", value:"#8B5CF6"},
        {name:"Pink", value:"#EC4899"},
        {name:"Indigo", value:"#6366F1"},
        {name:"Teal", value:"#14B8A6"},
        {name:"Gray", value:"#6B7280"},
        {name:"Black", value:"#1F2937"},
    ];

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return(
        <div className="relative" ref={containerRef}>
            <button
                onClick={()=>setIsOpen((prev) => !prev)}
                className="flex items-center gap-2 text-sm text-violet-700 bg-gradient-to-br from-violet-100 to-white border border-violet-200 hover:border-violet-300 hover:shadow-sm transition-all px-3 py-2 rounded-xl"
                aria-haspopup="menu"
                aria-expanded={isOpen}
            >
                <Palette className="size-4"/>
                <span className="max-sm:hidden">Accent</span>
                <span className="inline-flex w-4 h-4 rounded-full border border-black/10" style={{backgroundColor: selectedColor}}></span>
            </button>

            { isOpen && (
                <div className="grid grid-cols-5 w-72 max-w-[85vw] gap-2 absolute top-full left-0 p-3 mt-2 z-20 bg-white/95 backdrop-blur rounded-2xl border border-slate-200 shadow-xl" role="menu">
                    {
                        colors.map((color)=>(
                            <button type="button" key={color.value} onClick={()=>{onChange(color.value); setIsOpen(false)}} className="relative cursor-pointer group flex flex-col items-center" role="menuitem" aria-label={color.name}>

                                <div className='w-10 h-10 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors' style={{backgroundColor: color.value}}>



                                </div>

                                {selectedColor === color.value && (
                                    <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-center">
                                        <CheckIcon className="size-4 text-white"/>
                                    </div>
                                )}

                                <p className="text-[11px] text-center mt-1 text-slate-600">
                                    {color.name}
                                </p>

                            </button>
                        ))
                    }

                </div>
            )
            }
        </div>
    )
}

export default ColorPicker;
