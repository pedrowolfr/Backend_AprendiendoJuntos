import express from "express";
import { SubjectController } from "../controllers/SubjectController";
import { auth } from "../middleware/auth";
import { isTeacher } from "../middleware/isTeacher";
import { isSuperAdmin } from "../middleware/isSuperAdmin";

// --------------------------------------------------

const router = express.Router();
const subjectController = new SubjectController();

router.get("/get", auth, isSuperAdmin, subjectController.getAll);
router.post("/newSubject", auth, subjectController.create);
router.get("/mysubjects/:id", auth, isTeacher, subjectController.getByTeacher);
router.patch("/:id", auth, subjectController.updateSubject);
router.delete("/:id", auth, subjectController.deleteSubject);

export default router;
