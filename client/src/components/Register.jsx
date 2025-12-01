import React, { useState } from "react";

/* -----------------------------------------
   Validation Rules
------------------------------------------ */
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

/* -----------------------------------------
   Reusable Components
------------------------------------------ */

const ErrorMessage = ({ message }) =>
    message ? <p className="text-red-600 text-xs mt-1">{message}</p> : null;

const InputField = ({ label, name, value, type = "text", onChange, onBlur, error, placeholder }) => (
    <tr className={error ? "bg-red-100" : ""}>
        <td className="p-2 border font-medium">{label}</td>
        <td className="p-2 border">
            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
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
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full p-2 border rounded border-gray-300"
            >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
            </select>
        </td>
    </tr>
);

const FileField = ({ label, name, multiple = false }) => (
    <tr>
        <td className="p-2 border font-medium">{label}</td>
        <td className="p-2 border">
            <input type="file" name={name} multiple={multiple} className="w-full p-1" />
        </td>
    </tr>
);

/* -----------------------------------------
   Main Form Component
------------------------------------------ */

export default function Registration() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        fatherName: "",
        motherName: "",
        phoneNumber: "",
        email: "",
        dateOfBirth: "",
        category: "General",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        // Live validation
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const err = validateField(key, formData[key]);
            if (err) newErrors[key] = err;
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return; // Stop submit if errors exist

        const files = new FormData(e.target);

        console.log("Form Data:", formData);
        console.log("Files:", {
            tenth: files.get("marksheet10"),
            twelfth: files.get("marksheet12"),
            grad: files.get("marksheetGrad"),
            sem: files.getAll("marksheetSem"),
        });

        alert("Registration Successful!");
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10">
            <table className="w-full bg-blue-100 border shadow rounded-lg">
                <tr>
                    <td colSpan="2" className="p-4 text-center text-2xl font-bold bg-blue-300">
                        Candidate Registration
                    </td>
                </tr>

                {/* Inputs */}
                <InputField label="First Name" name="firstName" value={formData.firstName} error={errors.firstName} onChange={handleChange} onBlur={handleBlur} />
                <InputField label="Last Name" name="lastName" value={formData.lastName} error={errors.lastName} onChange={handleChange} onBlur={handleBlur} />
                <InputField label="Father Name" name="fatherName" value={formData.fatherName} error={errors.fatherName} onChange={handleChange} onBlur={handleBlur} />
                <InputField label="Mother Name" name="motherName" value={formData.motherName} error={errors.motherName} onChange={handleChange} onBlur={handleBlur} />
                <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} error={errors.phoneNumber} onChange={handleChange} onBlur={handleBlur} placeholder="9876543210" />
                <InputField label="Email" name="email" type="email" value={formData.email} error={errors.email} onChange={handleChange} onBlur={handleBlur} placeholder="example@mail.com" />
                <InputField label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} onBlur={handleBlur} />

                {/* Select */}
                <SelectField label="Category" name="category" value={formData.category} onChange={handleChange} />

                {/* File Inputs */}
                <FileField label="10th Marksheet" name="marksheet10" />

                <FileField label="12th Marksheet" name="marksheet12" />
                <FileField label="Graduation Marksheet" name="marksheetGrad" />
                <FileField label="Semester Marksheet" name="marksheetSem" multiple />
                    <FileField label="Resume" name="resume"/>

                {/* Submit Button */}
                <tr>
                    <td colSpan="2" className="p-4 text-center bg-blue-200">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow"
                        >
                            Submit Application
                        </button>
                    </td>
                </tr>
            </table>
        </form>
    );
}
