import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";

const isSuperAdmin = (req: any, res: Response, next: NextFunction) => {
  console.log(req.tokenData);
  const roles = req.tokenData.userRoles;

  if (!roles.includes("super_admin")) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "No tienes permiso para acceder.",
    });
  }

  next();
};

export { isSuperAdmin };
