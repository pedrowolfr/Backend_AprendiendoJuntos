import express from "express";
import { SubjectController } from "../controllers/SubjectController";
import { auth } from "../middleware/auth";

const router = express.Router();
const subjectController = new SubjectController();

router.get("/list", subjectController.getAll);
router.patch("/:id", subjectController.updateSubject);
router.delete("/:id", auth, subjectController.deleteSubject);

export default router;
