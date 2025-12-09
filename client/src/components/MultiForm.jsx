import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Keep the import

const emptyForm = { name: "", email: "", phone: "" };

// ❌ The old logic for navigate and handleClick was here. It has been removed.

export default function MultiDynamicForms() {
    // ✅ FIX: Call useNavigate() inside the component body
    const navigate = useNavigate(); 

    const [mode, setMode] = useState("");
    const [forms, setForms] = useState([{ ...emptyForm }]);
    const [errors, setErrors] = useState([]);

    // Define handleClick inside the component, after the navigate hook is called.
    const handleClick = () => {
        // navigate('/') will take the user to the homepage
        navigate('/');
    };

    // Validation Rules
    const validateForm = (form) => {
        const error = {};
        if (!form.name.trim()) error.name = "Name is required";
        if (!/^[A-Za-z ]+$/.test(form.name)) error.name = "Only letters allowed";
        if (!form.email.trim()) error.email = "Email is required";
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) error.email = "Invalid email";
        if (!form.phone.trim()) error.phone = "Phone is required";
        if (!/^\d{10}$/.test(form.phone)) error.phone = "Phone must be 10 digits";
        return error;
    };

    const handleChange = (i, field, value) => {
        const newForms = [...forms];
        newForms[i][field] = value;
        setForms(newForms);
    };

    const addForm = () => {
        setForms([...forms, { ...emptyForm }]);
        setErrors([...errors, {}]);
    };

    const deleteForm = (index) => {
        const updated = forms.filter((_, i) => i !== index);
        const updatedErrors = errors.filter((_, i) => i !== index);
        setForms(updated);
        setErrors(updatedErrors);
    };

    const handleSubmit = async () => {
        const allErrors = forms.map((f) => validateForm(f));

        const hasError = allErrors.some((e) => Object.keys(e).length > 0);

        if (hasError) {
            setErrors(allErrors);
            return alert("Please fix errors before submitting");
        }

        const res = await fetch("http://localhost:5000/api/forms/save-multiple", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(forms),
        });

        const data = await res.json();
        alert(data.message);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">

            <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
                Dynamic Multi Form System
            </h1>

            {/* Select Mode */}
            <select
                value={mode}
                onChange={(e) => {
                    setMode(e.target.value);
                    setForms([{ ...emptyForm }]);
                    setErrors([]);
                }}
                className="w-full p-3 border rounded-lg bg-white shadow mb-6"
            >
                <option value="">Select Mode</option>
                <option value="one">One Form</option>
                <option value="multiple">Multiple Forms</option>
            </select>

            {mode && (
                <>
                    {forms.map((form, index) => (
                        <div
                            key={index}
                            className="bg-white p-5 rounded-2xl shadow-md border mb-6 relative"
                        >
                            <h2 className="text-lg font-bold mb-3">
                                Form {index + 1}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                {/* NAME */}
                                <div>
                                    <label className="font-medium">Name</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={form.name}
                                        onChange={(e) => handleChange(index, "name", e.target.value)}
                                        placeholder="Enter Name"
                                    />
                                    {errors[index]?.name && (
                                        <p className="text-red-600 text-sm">{errors[index].name}</p>
                                    )}
                                </div>

                                {/* EMAIL */}
                                <div>
                                    <label className="font-medium">Email</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={form.email}
                                        onChange={(e) =>
                                            handleChange(index, "email", e.target.value)
                                        }
                                        placeholder="Enter Email"
                                    />
                                    {errors[index]?.email && (
                                        <p className="text-red-600 text-sm">{errors[index].email}</p>
                                    )}
                                </div>

                                {/* PHONE */}
                                <div>
                                    <label className="font-medium">Phone</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={form.phone}
                                        onChange={(e) =>
                                            handleChange(index, "phone", e.target.value)
                                        }
                                        placeholder="10-digit phone"
                                    />
                                    {errors[index]?.phone && (
                                        <p className="text-red-600 text-sm">{errors[index].phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* DELETE BUTTON */}
                            {mode === "multiple" && forms.length > 1 && (
                                <button
                                    onClick={() => deleteForm(index)}
                                    className="bg-red-500 text-white px-3 py-1 rounded absolute top-3 right-3 hover:bg-red-600"
                                >
                                    ✖
                                </button>
                            )}
                        </div>
                    ))}

                    {/* ADD BUTTON */}
                    {mode === "multiple" && (
                        <button
                            onClick={addForm}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 mb-4"
                        >
                            + Add Form
                        </button>
                    )}

                    {/* SUBMIT BUTTON */}
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 w-full text-white py-3 text-lg rounded-lg hover:bg-green-700 shadow-lg"
                    >
                        Submit All Forms
                    </button>
                    <button
                        className="bg-red-400 py-2 rounded mb-5 w-20 mt-4" 
                        onClick={handleClick}
                    >
                        back
                    </button>
                </>
            )}
        </div>
    );
}