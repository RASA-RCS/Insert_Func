import Registration from "../models/Registration.js";

export const registerUser = async (req, res) => {
    try {
        const formData = req.body;
        const files = req.files;

        const newUser = new Registration({
            personalDetails: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                fatherName: formData.fatherName,
                motherName: formData.motherName,
                email: formData.email,
                phone: formData.phoneNumber,
                dateOfBirth: formData.dateOfBirth,
                category: formData.category,
            },
            uploadedFiles: {
                marksheet10: files?.marksheet10?.[0]?.filename || "",
                marksheet12: files?.marksheet12?.[0]?.filename || "",
                graduationMarksheet: files?.graduationMarksheet?.[0]?.filename || "",
                resume: files?.resume?.[0]?.filename || "",
                semesterMarksheets: files?.semesterMarksheets?.map(f => f.filename) || [],
            }
        });

        await newUser.save();

        res.status(200).json({ success: true, message: "Registration saved successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error saving registration", error: error.message });
    }
};
