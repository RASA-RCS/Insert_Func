import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    fatherName: String,
    motherName: String,
    phoneNumber: String,
    email: String,
    dateOfBirth: String,
    category: String,

    // File paths
    files: {
      marksheet10: String,
      marksheet12: String,
      marksheetGrad: String,
      resume: String,
      marksheetSem: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
