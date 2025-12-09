import express from "express";
import cors from "cors";
import "./config/db.js";

// Your existing routes
import userRoutes from "./routes/userRoutes.js";
import formRoutes from "./routes/formRoutes.js";

// ⭐ ADD THIS (registration route)
import registrationRoutes from "./routes/registrationRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);          
app.use("/api/forms", formRoutes);

// ⭐ ADD THIS LINE
app.use("/api/registration", registrationRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


