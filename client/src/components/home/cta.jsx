import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTA =()=>{
    return(

        <div id='cta' className='flex flex-col items-center my-10 scroll-mt-28'>

            <div className="border-y border-dashed border-slate-200 w-full max-w-5xl mx-auto px-16">
            <div className="flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 px-3 md:px-10 border-x border-dashed border-slate-200 py-20 -mt-10 -mb-10 w-full">
                <p className="text-xl font-medium max-w-sm">Ready to build your next resume with AI and start applying confidently?</p>
                <Link to='/app?state=register' className="flex items-center gap-2 rounded-md py-3 px-5 bg-green-600 hover:bg-green-700 transition text-white">

                    <span>Create your resume</span>
                    <ArrowRight className="size-4" />
                </Link>
            </div>
        </div>

        </div>

    )

}

export default CTA
