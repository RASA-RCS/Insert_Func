import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const NAME_REGEX = /^[A-Za-z\s]+$/;
const PHONE_REGEX = /^\d+$/;
const EMAIL_REGEX = /^[^.,@\s][^@\s]*@[^@\s]+\.[^@\s]+$/;

const validateField = (name, value) => {
    switch (name) {
        case "firstName":
        case "lastName":
        case "fatherName":
        case "motherName":
            if (!value) return "This field is required.";
            if (!NAME_REGEX.test(value)) return "Only letters and spaces allowed.";
            return "";
        case "phoneNumber":
            if (!value) return "Phone number is required.";
            if (!PHONE_REGEX.test(value)) return "Only digits allowed.";
            return "";
        case "email":
            if (!value) return "Email is required.";
            if (!EMAIL_REGEX.test(value)) return "Invalid email format.";
            return "";
        default:
            return "";
    }
};

const ErrorMessage = ({ message }) => message ? <p className="text-red-600 text-xs mt-1">{message}</p> : null;

const InputField = ({ label, name, value, type="text", onChange, onBlur, error, placeholder }) => (
    <tr className={error ? "bg-red-100" : ""}>
        <td className="p-2 border font-medium">{label}</td>
        <td className="p-2 border">
            <input
                type={type} name={name} value={value} placeholder={placeholder}
                onChange={onChange} onBlur={onBlur}
                className={`w-full p-1 border rounded ${error ? "border-red-500" : "border-gray-300"}`}
            />
            <ErrorMessage message={error} />
        </td>
    </tr>
);

const SelectField = ({ label, name, value, onChange }) => (
    <tr>
        <td className="p-2 border font-medium">{label}</td>
        <td className="p-2 border">
            <select name={name} value={value} onChange={onChange} className="w-full p-2 border rounded border-gray-300">
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
            </select>
        </td>
    </tr>
);

const SemesterRow = ({ index, fileObj, onFileChange, onRemove, error }) => (
    <tr>
        <td className="p-2 border font-medium">Semester {index + 1} Marksheet</td>
        <td className="p-2 border">
            <input type="file" accept=".pdf,image/*" onChange={(e)=>onFileChange(index,e)} className="w-full p-1" />
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
            {fileObj?.name && <p className="text-sm mt-2"><strong>Selected:</strong> {fileObj.name} ({Math.round(fileObj.size/1024)} KB)</p>}
            <div className="mt-2">
                <button type="button" onClick={()=>onRemove(index)} className="text-sm bg-red-500 text-white px-2 py-1 rounded">Remove Semester</button>
            </div>
        </td>
    </tr>
);

export default function Registration() {
    const navigate = useNavigate();
    const [step,setStep] = useState(1);
    const [formData,setFormData] = useState({
        firstName:"", lastName:"", fatherName:"", motherName:"", phoneNumber:"", email:"", dateOfBirth:"", category:"General"
    });
    const [errors,setErrors] = useState({});
    const [semesterFiles,setSemesterFiles] = useState([null]);
    const [semesterErrors,setSemesterErrors] = useState([""]);

    const handleClick=()=>navigate("/");

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData(prev=>({...prev,[name]:value}));
        setErrors(prev=>({...prev,[name]:validateField(name,value)}));
    };
    const handleBlur=(e)=>{const {name,value}=e.target; setErrors(prev=>({...prev,[name]:validateField(name,value)}));};

    const handleSemesterFileChange=(index,e)=>{
        const file = e.target.files[0] ?? null;
        const newFiles = [...semesterFiles];
        const newErrors = [...semesterErrors];

        if(file){
            if(file.size>5*1024*1024){ newErrors[index]="File size must be under 5MB."; newFiles[index]=null; setSemesterFiles(newFiles); setSemesterErrors(newErrors); return; }
            newErrors[index]="";
        } else { newErrors[index]="Please select a file for this semester."; }

        newFiles[index]=file; setSemesterFiles(newFiles); setSemesterErrors(newErrors);
    };

    const addNextSemester=()=>{ setSemesterFiles(prev=>[...prev,null]); setSemesterErrors(prev=>[...prev,"Please upload a file for this semester."]); };
    const removeSemester=(index)=>{ setSemesterFiles(prev=>prev.filter((_,i)=>i!==index)||[null]); setSemesterErrors(prev=>prev.filter((_,i)=>i!==index)||["Please upload a file for this semester."]); };

    const handleSubmit=(e)=>{
        e.preventDefault();
        const newErrors={};
        Object.keys(formData).forEach(k=>{ const err=validateField(k,formData[k]); if(err)newErrors[k]=err; });
        setErrors(newErrors); if(Object.keys(newErrors).length>0) return;
        localStorage.setItem("candidateData",JSON.stringify(formData));
        alert("Data saved! Click FINAL SUBMIT to submit."); setStep(2);
    };

    const canFinalSubmit = useMemo(()=>{
        if(Object.values(errors).some(v=>v&&v.length>0)) return false;
        const requiredTextFields=["firstName","lastName","fatherName","motherName","phoneNumber","email"];
        if(requiredTextFields.some(k=>!formData[k]||formData[k].toString().trim()==="")) return false;
        for(let i=0;i<semesterFiles.length;i++){ if(!semesterFiles[i]) return false; if(semesterErrors[i] && semesterErrors[i].length>0) return false; }
        return true;
    },[errors,formData,semesterFiles,semesterErrors]);

    const handleFinalSubmit=async()=>{
        const cachedData=JSON.parse(localStorage.getItem("candidateData"));
        if(!cachedData){ alert("No cached data found!"); return; }
        if(!canFinalSubmit){ alert("Fix errors and ensure all semester files are uploaded."); return; }

        const form=new FormData();
        Object.keys(cachedData).forEach(k=>form.append(k,cachedData[k]));

        const fixedNames=["marksheet10","marksheet12","graduationMarksheet","resume"];
        fixedNames.forEach(n=>{ const input=document.querySelector(`input[name='${n}']`); if(input?.files?.[0]) form.append(n,input.files[0]); });

        semesterFiles.forEach(file=>{ if(file) form.append("semesterMarksheets",file); });

        try{
            const res=await fetch("http://localhost:5000/api/users/register",{ method:"POST", body:form });
            const result=await res.json();
            if(result.success){ alert("Final Submission Successful!"); localStorage.removeItem("candidateData"); setFormData({firstName:"",lastName:"",fatherName:"",motherName:"",phoneNumber:"",email:"",dateOfBirth:"",category:"General"}); setSemesterFiles([null]); setSemesterErrors([""]); setStep(1); } 
            else{ alert("Something went wrong!"); }
        }catch(err){ console.error(err); alert("Server Error!"); }
    };

    return (
        <>
        <button className="bg-red-400 py-2 rounded mb-5 w-20 mt-4" onClick={handleClick}>back</button>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10">
            <div className="w-full bg-gray-300 h-3 rounded mb-5">
                <div className="bg-blue-600 h-3 rounded transition-all duration-500" style={{width: step===1?"50%":"100%"}}></div>
            </div>
            <table className="w-full bg-blue-100 border shadow rounded-lg"><tbody>
            <tr><td colSpan="2" className="p-4 text-center text-2xl font-bold bg-blue-300">Candidate Registration</td></tr>

            <InputField label="First Name" name="firstName" value={formData.firstName} error={errors.firstName} onChange={handleChange} onBlur={handleBlur}/>
             <InputField label="First Name" name="firstName" value={formData.firstName} error={errors.firstName} onChange={handleChange} onBlur={handleBlur}/>
            <InputField label="Last Name" name="lastName" value={formData.lastName} error={errors.lastName} onChange={handleChange} onBlur={handleBlur}/>
            <InputField label="Father Name" name="fatherName" value={formData.fatherName} error={errors.fatherName} onChange={handleChange} onBlur={handleBlur}/>
            <InputField label="Mother Name" name="motherName" value={formData.motherName} error={errors.motherName} onChange={handleChange} onBlur={handleBlur}/>
            <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} error={errors.phoneNumber} onChange={handleChange} onBlur={handleBlur} placeholder="9876543210"/>
            <InputField label="Email" name="email" type="email" value={formData.email} error={errors.email} onChange={handleChange} onBlur={handleBlur} placeholder="example@mail.com"/>
            <InputField label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} onBlur={handleBlur}/>
            <SelectField label="Category" name="category" value={formData.category} onChange={handleChange}/>

            <tr><td colSpan="2" className="bg-blue-200 text-center font-bold py-2">Documents</td></tr>
            <tr><td className="p-2 border font-medium">10th Marksheet</td><td className="p-2 border"><input type="file" name="marksheet10" accept=".pdf,image/*"/></td></tr>
            <tr><td className="p-2 border font-medium">12th Marksheet</td><td className="p-2 border"><input type="file" name="marksheet12" accept=".pdf,image/*"/></td></tr>
            <tr><td className="p-2 border font-medium">Graduation Marksheet</td><td className="p-2 border"><input type="file" name="graduationMarksheet" accept=".pdf,image/*"/></td></tr>

            <tr><td colSpan="2" className="bg-blue-200 text-center font-bold py-2">Semester Marksheets</td></tr>
            {semesterFiles.map((file,idx)=>(
                <SemesterRow key={idx} index={idx} fileObj={file} onFileChange={handleSemesterFileChange} onRemove={removeSemester} error={semesterErrors[idx]}/>
            ))}
            {semesterFiles[0] && <tr><td colSpan="2" className="text-center py-3"><button type="button" onClick={addNextSemester} className="bg-green-600 text-white px-4 py-2 rounded">+ Add Next Semester</button></td></tr>}

            <tr><td className="p-2 border font-medium">Resume</td><td className="p-2 border"><input type="file" name="resume" accept=".pdf,image/*"/></td></tr>

            <tr><td colSpan="2" className="p-4 text-center bg-blue-200">
                {step===1 && <>
                    <button type="button" onClick={()=>setFormData({firstName:"",lastName:"",fatherName:"",motherName:"",phoneNumber:"",email:"",dateOfBirth:"",category:"General"})} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow mr-4">New</button>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow">Save & Next</button>
                </>}
                {step===2 && <>
                    <button type="button" onClick={()=>setStep(1)} className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 shadow mr-4">Edit</button>
                    <button type="button" onClick={handleFinalSubmit} disabled={!canFinalSubmit} className={`bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 shadow ${!canFinalSubmit?"opacity-50 cursor-not-allowed":""}`}>Final Submit</button>
                </>}
            </td></tr>
            </tbody></table>
        </form>
        </>
    );
}
