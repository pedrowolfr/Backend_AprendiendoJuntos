import express from "express";
import { ActivityController } from "../controllers/ActivityController";
import { isSuperAdmin } from "../middleware/isSuperAdmin";
import { isTeacher } from "../middleware/isTeacher";

const router = express.Router();
const activityController = new ActivityController();

router.get("/allactivities", activityController.getAllActivities);
router.get("/bySubject/:id", isTeacher, activityController.getBySubject); 
router.post("/activities/create", isSuperAdmin, activityController.createActivity);
router.patch("/:id", isSuperAdmin, activityController.updateActivity); 
router.delete("/:id", isSuperAdmin, activityController.deleteActivity);

export default router;
