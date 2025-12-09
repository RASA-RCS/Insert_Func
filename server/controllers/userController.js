import userService from "../services/userService.js";

export const registerUser = async (req, res) => {
  try {
    const fields = req.body;

    // Extract file paths
    const files = {
      marksheet10: req.files["marksheet10"]?.[0]?.path || "",
      marksheet12: req.files["marksheet12"]?.[0]?.path || "",
      marksheetGrad: req.files["marksheetGrad"]?.[0]?.path || "",
      marksheetSem: req.files["marksheetSem"]?.map((f) => f.path) || [],
      resume: req.files["resume"]?.[0]?.path || "",
    };

    const finalData = {
      ...fields,
      files,
    };

    const savedUser = await userService.saveUser(finalData);

    res.json({
      success: true,
      message: "User registered successfully",
      data: savedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
