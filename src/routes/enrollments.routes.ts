import express from "express";
import { EnrollmentController } from "../controllers/EnrollmentController";
import { auth } from "../middleware/auth";

const router = express.Router();
const enrollmentController = new EnrollmentController();

router.post("/newEnrollment/create", auth, enrollmentController.create);
router.get("/myEnrollments/:id", auth, enrollmentController.getById);

export default router;