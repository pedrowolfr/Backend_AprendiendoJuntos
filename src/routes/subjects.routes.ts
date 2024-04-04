import express from "express";
import { SubjectController } from "../controllers/SubjectController";
import { isTeacher } from "../middleware/isTeacher";
import { isSuperAdmin } from "../middleware/isSuperAdmin";

// --------------------------------------------------

const router = express.Router();
const subjectController = new SubjectController();

router.post("/newSubject", isSuperAdmin, subjectController.create);
router.get("/mysubjects/:id", isTeacher, subjectController.getByTeacher);
router.patch("/:id", isSuperAdmin, subjectController.updateSubject);
router.delete("/:id", isSuperAdmin, subjectController.deleteSubject);
router.get("/list", subjectController.AllSubjects);


export default router;
