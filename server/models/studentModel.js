import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  fatherName: String,
  motherName: String,
  phoneNumber: String,
  email: String,
  dateOfBirth: String,
  category: String,
  documents: {
    marksheet10: String,
    marksheet12: String,
    marksheetGrad: String,
    marksheetSem: [String],
    resume: String
  }
});

export default mongoose.model("Student", studentSchema);
