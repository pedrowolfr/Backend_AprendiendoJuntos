import express from "express";
import { SubjectController } from "../controllers/SubjectController";
import { auth } from "../middleware/auth";
import { isTeacher } from "../middleware/isTeacher";
import { isSuperAdmin } from "../middleware/isSuperAdmin";

// --------------------------------------------------

const router = express.Router();
const subjectController = new SubjectController();

router.get("/get", subjectController.getAllSubjects);
router.post("/newSubject", subjectController.create);
router.get("/mysubjects/:id", auth, isTeacher, subjectController.getByTeacher);
router.patch("/:id", auth, isSuperAdmin, subjectController.updateSubject);
router.delete("/:id", auth, isSuperAdmin, subjectController.deleteSubject);
router.get("/allactivities", subjectController.getAllActivities)

export default router;
