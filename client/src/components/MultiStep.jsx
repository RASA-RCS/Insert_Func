import React, { useState } from "react";

/* -----------------------------------------
    Validation Rules
------------------------------------------ */
const NAME_REGEX = /^[A-Za-z\s]+$/;
const PHONE_REGEX = /^\d+$/;
const EMAIL_REGEX = /^[^.,@\s][^@\s]*@[^@\s]+\.[^@\s]+$/;

/**
 * Validates a single form field based on its name and value.
 */
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

        case "dateOfBirth":
            if (!value) return "Date of Birth is required.";
            // Simple check: value is present
            return "";

        default:
            return "";
    }
};

/**
 * Runs validation checks specific to the current step.
 */
const validateStep = (step, formData) => {
    let stepFields = [];
    switch (step) {
        case 1: // Personal Details
            stepFields = ["firstName", "lastName", "dateOfBirth", "category"];
            break;
        case 2: // Parent Details
            stepFields = ["fatherName", "motherName"];
            break;
        case 3: // Contact Details
            stepFields = ["phoneNumber", "email"];
            break;
        // Step 4 (Documents) does not require validation on field values, only presence check on final submit.
        default:
            return {};
    }

    const newErrors = {};
    stepFields.forEach((key) => {
        const err = validateField(key, formData[key]);
        if (err && key !== "category") { // Category is a select field, always has a value
            newErrors[key] = err;
        }
    });
    return newErrors;
};


/* -----------------------------------------
    Reusable Components
------------------------------------------ */

const ErrorMessage = ({ message }) =>
    message ? <p className="text-red-600 text-xs mt-1">{message}</p> : null;

const InputField = ({ label, name, value, type = "text", onChange, onBlur, error, placeholder }) => (
    <tr className={error ? "bg-red-100" : ""}>
        <td className="p-2 border font-medium w-1/3">{label}</td>
        <td className="p-2 border w-2/3">
            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                className={`w-full p-1 border rounded focus:outline-none ${error ? "border-red-500" : "border-gray-300"}`}
            />
            <ErrorMessage message={error} />
        </td>
    </tr>
);

const SelectField = ({ label, name, value, onChange }) => (
    <tr>
        <td className="p-2 border font-medium w-1/3">{label}</td>
        <td className="p-2 border w-2/3">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full p-2 border rounded border-gray-300 focus:outline-none focus:border-blue-500"
            >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
            </select>
        </td>
    </tr>
);

const FileField = ({ label, name, multiple = false, onChange }) => (
    <tr>
        <td className="p-2 border font-medium w-1/3">{label}</td>
        <td className="p-2 border w-2/3">
            <input
                type="file"
                name={name}
                multiple={multiple}
                className="w-full p-1"
                onChange={onChange} // <-- Important!
            />
        </td>
    </tr>
);

/* -----------------------------------------
    PREVIEW COMPONENT (Step 5)
------------------------------------------ */
const PreviewPage = ({ formData, files }) => (
    <div className="p-4 space-y-4">
        <h3 className="text-xl font-bold text-blue-800 border-b pb-2">Review All Details</h3>

        {/* Personal & Contact Details */}
        <div className="border p-4 rounded-lg bg-white shadow">
            <h4 className="font-semibold text-lg mb-2 text-gray-700">Personal & Contact Information</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <p><strong>First Name:</strong> {formData.firstName}</p>
                <p><strong>Last Name:</strong> {formData.lastName}</p>
                <p><strong>Father Name:</strong> {formData.fatherName}</p>
                <p><strong>Mother Name:</strong> {formData.motherName}</p>
                <p><strong>Phone:</strong> {formData.phoneNumber}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                <p><strong>Category:</strong> {formData.category}</p>
            </div>
        </div>

        {/* Document Details */}
        <div className="border p-4 rounded-lg bg-white shadow">
            <h4 className="font-semibold text-lg mb-2 text-gray-700">Document Status</h4>
            <ul className="list-disc list-inside text-sm">
                {Object.entries(files).map(([key, fileList]) => (
                    <li key={key}>
                        <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong>
                        {fileList.length > 0 ? (
                            <span className="text-green-600 ml-2">{fileList.length} file(s) attached</span>
                        ) : (
                            <span className="text-red-500 ml-2">Missing</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>

        <p className="text-center pt-2 text-red-500 font-medium">Please ensure all details are correct before Final Submit.</p>
    </div>
);


/* -----------------------------------------
    Main Form Component
------------------------------------------ */

export default function Registration() {
    // State to control the current step (1-6)
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // FORM DATA
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

    // ERROR STATE
    const [errors, setErrors] = useState({});

    // INPUT CHANGE Handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Live validation check
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };

    // BLUR Handler
    const handleBlur = (e) => {
        const { name, value } = e.target;
        // Validation check on blur
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };

    // BACK button handler
    const handleBack = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
            setErrors({}); // Clear errors when navigating back
        }
    };


    /**
     * Handles progression to the next step, validating the current step's fields first.
     */
    const handleNext = (e) => {
        e.preventDefault();

        // Check for Step 1-3 validation only
        if (step <= 3) {
            const newErrors = validateStep(step, formData);
            setErrors(newErrors);

            // Stop if validation fails
            if (Object.keys(newErrors).length > 0) {
                console.error("Validation failed for step", step, newErrors);
                return;
            }
        }

        // Move to the next step (1->2, 2->3, 3->4, 4->5)
        if (step < 5) {
            setStep(prev => prev + 1);
        } else if (step === 5) {
            // Step 5 is the preview, clicking 'Next' here moves to 'Final Submit' stage (Step 6)
            setStep(6);
        }
    };

    /**
     * Collects data and simulates final submission process (Step 6).
     */
    const handleFinalSubmit = async () => {
        setIsSubmitting(true);

        const requiredFiles = ["marksheet10", "marksheet12", "marksheetGrad", "marksheetSem", "resume"];
        const missingFiles = requiredFiles.filter((key) => {
            const f = fileData[key];
            return !f || (Array.isArray(f) && f.length === 0);
        });

        if (missingFiles.length > 0) {
            setIsSubmitting(false);
            alert(`Missing required files: ${missingFiles.join(", ")}`);
            setStep(4);
            return;
        }

        const formPayload = new FormData();
        Object.entries(formData).forEach(([key, value]) => formPayload.append(key, value));

        requiredFiles.forEach((key) => {
            const f = fileData[key];
            if (Array.isArray(f)) f.forEach(file => formPayload.append(key, file));
            else formPayload.append(key, f);
        });

        try {
            const response = await fetch("http://localhost:5000/api/students/register", {
                method: "POST",
                body: formPayload,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Server error during submission.");
            }

            const data = await response.json();
            console.log("Submission Success:", data);
            setIsSubmitting(false);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Submission Error:", error);
            setIsSubmitting(false);
            alert(`Submission failed: ${error.message}`);
        }
    };



    // Add to your formData state or create a separate state for files
    const [fileData, setFileData] = useState({
        marksheet10: null,
        marksheet12: null,
        marksheetGrad: null,
        marksheetSem: [], // multiple files
        resume: null,
    });

    // Update fileData when user selects files
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFileData((prev) => ({
            ...prev,
            [name]: files.length > 1 ? Array.from(files) : files[0],
        }));
    };


    // Mapping steps to titles for display
    const stepTitles = [
        "1. Personal Details",
        "2. Parent Details",
        "3. Contact Details",
        "4. Document Upload",
        "5. Preview Page",
        "6. Final Submission"
    ];

    // Calculate progress bar width based on current step (out of 6)
    const progressWidth = `${(step / 6) * 100}%`;
    const title = stepTitles[step - 1];

    const getCurrentFilesStatus = () => {
        const files = {};
        Object.entries(fileData).forEach(([key, f]) => {
            if (!f) files[key] = [];
            else if (Array.isArray(f)) files[key] = f;
            else files[key] = [f];
        });
        return files;
    };

    // Render the final success screen
    if (isSubmitted) {
        return (
            <div className="max-w-3xl mx-auto mt-10 p-8 bg-green-100 border border-green-500 rounded-lg shadow-xl text-center">
                <h2 className="text-3xl font-bold text-green-700 mb-4">✅ Submission Successful!</h2>
                <p className="text-gray-700 mb-6">Your registration data has been successfully processed and recorded.</p>
                <div className="bg-white p-4 rounded-lg inline-block text-left">
                    <p className="font-semibold text-lg text-green-800">Registration ID:</p>
                    <p className="font-mono text-gray-900">{crypto.randomUUID()}</p>
                </div>
            </div>
        );
    }


    return (
        <form onSubmit={handleNext} className="max-w-3xl mx-auto mt-10">

            {/* PROGRESS BAR */}
            <div className="mb-4 text-sm font-semibold text-gray-600 flex justify-between">
                <span>{title}</span>
                <span>Step {step} of 6</span>
            </div>
            <div className="w-full bg-gray-300 h-2 rounded-full mb-5">
                <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: progressWidth }}
                ></div>
            </div>

            <table className="w-full bg-white border shadow rounded-lg">
                <thead>
                    <tr>
                        <th colSpan="2" className="p-4 text-center text-2xl font-bold bg-blue-500 text-white rounded-t-lg">
                            Candidate Registration
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {/* -----------------------------------------
                    STEP 1: PERSONAL DETAILS
                ------------------------------------------ */}
                    {step === 1 && (
                        <>
                            <InputField label="First Name" name="firstName" value={formData.firstName} error={errors.firstName} onChange={handleChange} onBlur={handleBlur} placeholder="First Name" />
                            <InputField label="Last Name" name="lastName" value={formData.lastName} error={errors.lastName} onChange={handleChange} onBlur={handleBlur} placeholder="Last Name
                            " />
                            <InputField label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} error={errors.dateOfBirth} onChange={handleChange} onBlur={handleBlur} />
                            <SelectField label="Category" name="category" value={formData.category} onChange={handleChange} />
                        </>
                    )}

                    {/* -----------------------------------------
                    STEP 2: PARENT DETAILS
                ------------------------------------------ */}
                    {step === 2 && (
                        <>
                            <InputField label="Father's Name" name="fatherName" value={formData.fatherName} error={errors.fatherName} onChange={handleChange} onBlur={handleBlur} placeholder="Father's Name" />
                            <InputField label="Mother's Name" name="motherName" value={formData.motherName} error={errors.motherName} onChange={handleChange} onBlur={handleBlur} placeholder="Mother's Name" />
                        </>
                    )}

                    {/* -----------------------------------------
                    STEP 3: CONTACT DETAILS
                ------------------------------------------ */}
                    {step === 3 && (
                        <>
                            <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} error={errors.phoneNumber} onChange={handleChange} onBlur={handleBlur} placeholder="Phone Number" />
                            <InputField label="Email" name="email" type="email" value={formData.email} error={errors.email} onChange={handleChange} onBlur={handleBlur} placeholder="Email Address" />
                        </>
                    )}


                    {/* -----------------------------------------
                    STEP 4: DOCUMENT UPLOADS
                ------------------------------------------ */}
                    {step === 4 && (
                        <>
                            <FileField label="10th Marksheet" name="marksheet10" onChange={handleFileChange} />
                            <FileField label="12th Marksheet" name="marksheet12" onChange={handleFileChange} />
                            <FileField label="Graduation Marksheet" name="marksheetGrad" onChange={handleFileChange} />
                            <FileField label="Semester Marksheet" name="marksheetSem" multiple onChange={handleFileChange} />
                            <FileField label="Resume" name="resume" onChange={handleFileChange} />
                        </>
                    )}

                    {/* -----------------------------------------
                    STEP 5: PREVIEW PAGE
                ------------------------------------------ */}
                    {step === 5 && (
                        <tr>
                            <td colSpan="2" className="p-0">
                                <PreviewPage formData={formData} files={getCurrentFilesStatus()} />
                            </td>
                        </tr>
                    )}

                    {/* -----------------------------------------
                    STEP 6: FINAL SUBMIT WITH SPINNER
                ------------------------------------------ */}
                    {step === 6 && (
                        <tr>
                            <td colSpan="2" className="p-8 text-center bg-blue-50">
                                {isSubmitting ? (
                                    <div className="flex flex-col items-center">
                                        <svg className="animate-spin h-8 w-8 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="text-lg font-semibold text-blue-700">Submitting Registration...</p>
                                        <p className="text-sm text-gray-500">Please wait, this may take a moment.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-xl font-semibold text-gray-700">Ready for Final Submission.</p>
                                        <p className="text-sm text-gray-500">Click the button below to complete your registration.</p>
                                        <button
                                            type="button"
                                            onClick={handleFinalSubmit}
                                            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 shadow-xl transition duration-200 text-lg font-bold"
                                            disabled={isSubmitting}
                                        >
                                            Final Submit
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    )}

                </tbody>

                {/* -----------------------------------------
                    NAVIGATION BUTTONS
                ------------------------------------------ */}
                <tr>
                    <td colSpan="2" className="p-4 text-center bg-gray-100 rounded-b-lg">
                        <div className="flex justify-between max-w-sm mx-auto">
                            {/* BACK BUTTON */}
                            {step > 1 && step < 6 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 shadow transition duration-200"
                                >
                                    ← Back
                                </button>
                            )}

                            {/* Placeholder for alignment on Step 1 */}
                            {step === 1 && <div className="w-24"></div>}

                            {/* NEXT BUTTON */}
                            {step < 5 && (
                                <button
                                    type="submit" // Triggers handleNext
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow transition duration-200 font-semibold"
                                >
                                    Save & Next
                                </button>
                            )}

                            {/* REVIEW/SUBMIT Button for Step 5 */}
                            {step === 5 && (
                                <button
                                    type="submit" // Triggers handleNext
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow transition duration-200 font-semibold"
                                >
                                    Proceed to Submit
                                </button>
                            )}

                            {/* Placeholder for alignment on Step 6 */}
                            {step === 6 && <div className="w-24"></div>}

                        </div>
                    </td>
                </tr>
            </table>
        </form>
    );
}