import express from "express";
import userRoutes from "./routes/users.routes";
import subjectRoutes from "./routes/subjects.routes";

// --------------------------------------------------------------------

const router = express.Router();

router.use("/api", userRoutes);
router.use("/api/subjects/", subjectRoutes);

export default router;
