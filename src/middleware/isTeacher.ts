import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const isTeacher = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.tokenData);

  const roles = req.tokenData.userRoles;

  if (!roles.includes("teacher")) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "No tienes permiso para acceder.",
    });
  }

  next();
};
