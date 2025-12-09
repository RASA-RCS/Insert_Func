import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema({
    personalDetails: {
        firstName: String,
        lastName: String,
        fatherName: String,
        motherName: String,
        email: String,
        phone: String,
        dateOfBirth: String,
        category: String,
    },
    uploadedFiles: {
        marksheet10: String,
        marksheet12: String,
        graduationMarksheet: String,
        resume: String,
        semesterMarksheets: [String],
    },
}, { timestamps: true });

export default mongoose.model("Registration", RegistrationSchema);
