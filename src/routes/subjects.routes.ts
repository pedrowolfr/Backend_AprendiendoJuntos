import express from "express";
import { SubjectController } from "../controllers/SubjectController";
import { isTeacher } from "../middleware/isTeacher";
import { isSuperAdmin } from "../middleware/isSuperAdmin";
import { auth } from "../middleware/auth";

// --------------------------------------------------

const router = express.Router();
const subjectController = new SubjectController();

router.get("/list", subjectController.getAll);
router.post("/newEnrollment/create", subjectController.create);
// router.get("/mysubjects/:id", isTeacher, subjectController.getByTeacher);
router.patch("/:id", subjectController.updateSubject);
router.delete("/:id", auth, subjectController.deleteSubject);
router.get("/mysubjects/:id", subjectController.getById);


export default router;
