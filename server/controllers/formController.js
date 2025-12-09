import User from "../models/FormModel.js";

export const saveMultipleUsers = async (req, res) => {
  try {
    const users = req.body; 

    // Validation backend
    for (let u of users) {
      if (!u.name || !u.email || !u.phone) {
        return res.status(400).json({ message: "All fields required" });
      }
    }

    await User.insertMany(users);

    res.json({ message: "Users saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving data", error });
  }
};
