import { BriefcaseBusiness, Globe, Mail, MapPin, Phone, UploadCloud, User } from "lucide-react";
import React from "react";

const PersonalInfoForm = ({data,onChange, removeBackground, setRemoveBackground})=>{

    const handleFieldChange = (field,value) => {
        onChange({...data,[field]:value})
    }

    const fields=[
        {key:"full_name", label:"Full Name", icon:User,type:'text',required:true},
        {key:"email", label:"Email Address", icon:Mail,type:'email',required:true},
        {key:"phone", label:"Phone Number", icon:Phone,type:'tel'},
        {key:"location", label:"Location", icon:MapPin,type:'text'},
        {key:"profession", label:"Profession", icon:BriefcaseBusiness,type:'text'},
        {key:"linkedin", label:"Linkedin", icon:Globe,type:'url'},
        {key:"website", label:"Personal Website", icon:Globe,type:'url'},
    ]


    return(

        <div className="space-y-5">
            <div>
                <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
                <p className="text-sm text-slate-600">Add your identity and contact details clearly.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 flex flex-wrap items-center gap-4">
                <label htmlFor="user-image-upload" className="group cursor-pointer">
                    {data.image ? (
                        <img
                            src={typeof data.image==='string' ? data.image : URL.createObjectURL(data.image)}
                            alt="User"
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-200 group-hover:opacity-90 transition"
                        />
                    ): (
                        <div className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
                            <span className="inline-flex items-center justify-center size-11 rounded-full bg-white border border-slate-300">
                                <UploadCloud className="size-5" />
                            </span>
                            <span className="text-sm font-medium">Upload profile image</span>
                        </div>
                    )}

                    <input
                        id="user-image-upload"
                        type="file"
                        accept="image/jpeg,image/png"
                        className="hidden"
                        onChange={(e)=>handleFieldChange('image', e.target.files[0])}
                    />
                </label>

                {typeof data.image === 'object' && (
                    <div className="flex flex-col gap-1 text-sm">
                        <p className="text-slate-700">Remove background</p>
                        <label htmlFor="remove-background-toggle" className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input id="remove-background-toggle" type="checkbox" className="sr-only peer" onChange={()=>setRemoveBackground((prev)=>!prev)} checked={removeBackground}/>
                            <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                        </label>
                    </div>
                )}
            </div>

            {/* display the list of inpute fields */}

            <div className="grid md:grid-cols-2 gap-4">
                {fields.map((field)=>{
                    const Icon = field.icon;
                    return (
                        <div key={field.key} className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <Icon className="size-4 text-slate-500"/>
                                {field.label}
                                {field.required && <span className="text-red-500">*</span>}
                            </label>

                            <input
                                type={field.type}
                                value={data[field.key] || ""}
                                onChange={(e)=>handleFieldChange(field.key,e.target.value)}
                                className="mt-1 w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-colors text-sm bg-white"
                                placeholder={`Enter your ${field.label.toLowerCase()}`}
                                required={field.required}
                            />
                        </div>
                    )
                })}
            </div>

        </div>

    )
}

export default PersonalInfoForm;
