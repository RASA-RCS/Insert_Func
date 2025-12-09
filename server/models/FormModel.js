import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

// ✅ Use a different model name
export default mongoose.models.Form || mongoose.model("Form", formSchema);
