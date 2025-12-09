// server/controllers/studentController.js
import Student from "../models/studentModel.js";

/**
 * Register a new student with file uploads
 */
export const registerStudent = async (req, res) => {
  try {
    const { firstName, lastName, fatherName, motherName, phoneNumber, email, dateOfBirth, category } = req.body;
    const files = req.files;

    // Detailed file validation
    const requiredFiles = ["marksheet10", "marksheet12", "marksheetGrad", "marksheetSem", "resume"];
    const missingFiles = requiredFiles.filter(f => !files || !files[f] || files[f].length === 0);

    if (missingFiles.length > 0) {
      return res.status(400).json({ message: `Missing required files: ${missingFiles.join(", ")}` });
    }

    const student = new Student({
      firstName,
      lastName,
      fatherName,
      motherName,
      phoneNumber,
      email,
      dateOfBirth,
      category,
      documents: {
        marksheet10: files.marksheet10[0].filename,
        marksheet12: files.marksheet12[0].filename,
        marksheetGrad: files.marksheetGrad[0].filename,
        marksheetSem: files.marksheetSem.map(f => f.filename),
        resume: files.resume[0].filename,
      },
    });

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Get all students
 */
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Get a single student by ID
 */
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
