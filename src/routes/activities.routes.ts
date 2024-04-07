import express from "express";
import { ActivityController } from "../controllers/ActivityController";
import { isSuperAdmin } from "../middleware/isSuperAdmin";
import { isTeacher } from "../middleware/isTeacher";
import { auth } from "../middleware/auth";

const router = express.Router();
const activityController = new ActivityController();

router.get("/myActivities/:id", auth, activityController.getMyActivities);
router.get("/bySubject/:id", isTeacher, activityController.getBySubject); 
router.post("/activities/create", isSuperAdmin, activityController.createActivity);


export default router;
