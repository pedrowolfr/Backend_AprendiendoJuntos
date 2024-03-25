import express from "express";
import { UserController } from "../controllers/UserController";
import { isSuperAdmin } from "../middleware/isSuperAdmin";
import { auth } from "../middleware/auth";

const router = express.Router();
const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/:id", auth, userController.getProfile);
router.patch("/:id", auth, userController.update);
router.post("/teachers/create", userController.createTeacher);
router.get("/users/getall", auth, isSuperAdmin, userController.getAllUsers);
router.delete("/delete/:id", auth, isSuperAdmin, userController.deleteUser);

export default router;
