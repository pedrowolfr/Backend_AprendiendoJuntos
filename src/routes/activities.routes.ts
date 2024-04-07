import express from "express";
import { ActivityController } from "../controllers/ActivityController";
import { isSuperAdmin } from "../middleware/isSuperAdmin";
import { isTeacher } from "../middleware/isTeacher";

const router = express.Router();
const activityController = new ActivityController();

router.get("/myActivities/:id", activityController.getMyActivities);
router.get("/bySubject/:id", isTeacher, activityController.getBySubject); 
router.post("/activities/create", isSuperAdmin, activityController.createActivity);


export default router;
