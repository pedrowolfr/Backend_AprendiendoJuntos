import express from "express";
import userRoutes from "./routes/users.routes";
import enrollmentRoutes from "./routes/enrollments.routes";
import subjectRoutes from "./routes/subjects.routes";
import activityRoutes from "./routes/activities.routes";

// --------------------------------------------------------------------

const router = express.Router();

router.use("/api", userRoutes);
router.use("/api/enrollments/", enrollmentRoutes);
router.use("/api/subjects/", subjectRoutes);
router.use("/api/activities/", activityRoutes);

export default router;
