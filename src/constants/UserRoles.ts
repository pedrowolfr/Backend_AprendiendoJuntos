import { Role } from "../models/Role";

export const UserRoles = {
   Student: { id: 1, role_name: "student" } as Role,
   Teacher: { id: 2, role_name: "teacher" } as Role,
   Super_Admin: { id: 3, role_name: "super_admin" } as Role,
};