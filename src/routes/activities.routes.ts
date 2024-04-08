import express from "express";
import { ActivityController } from "../controllers/ActivityController";
import { isSuperAdmin } from "../middleware/isSuperAdmin";
import { auth } from "../middleware/auth";

const router = express.Router();
const activityController = new ActivityController();

router.get("/myActivities/:id", auth, activityController.getMyActivities);
router.post("/activities/create",isSuperAdmin,activityController.createActivity
);

export default router;
