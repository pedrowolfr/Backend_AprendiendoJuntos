import { Request, Response } from "express";
import {
  CreateUserRequestBody,
  LoginUserRequestBody,
  TokenData,
} from "../types/types";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { Teacher } from "../models/Teacher";
import { UserRoles } from "../constants/UserRoles";
import { AppDataSource } from "../database/data-source";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export class UserController {
    async register(
        req: Request<{}, {}, CreateUserRequestBody>,
    res: Response
    ): Promise<void | Response<any>> {
        const userRepository = AppDataSource.getRepository(User);
        const { nick_name, name, email, password} = req.body;

        try {
      const newUser = userRepository.create({
        nick_name,
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role: UserRoles.Student,
      });
      
      await userRepository.save(newUser);
      res.status(StatusCodes.CREATED).json({
        message: "Usuario creado con éxito",
      });
    } catch (error: any) {
      console.error("Error al registrarse:", error);
      res.status(500).json({
        message: "Error al registrarse",
        error: error.message,
      });
    }
  }