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
    const { nick_name, name, email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);

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

  async createTeacher(
    req: Request<{}, {}, CreateUserRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
    const userRepository = AppDataSource.getRepository(User);
    const { nick_name, name, email, password } = req.body;
    try {
      
      const dataUser: User = {
        nick_name,
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role: UserRoles.Teacher,
      };
      const newUser = await userRepository.save(dataUser);

      const teacherRepository = AppDataSource.getRepository(Teacher);
      const newTeacher = await teacherRepository.save({
        user: newUser,
        photo,
        subject,
      });
      res.status(201).json(newTeacher);
    } catch (error: any) {
      console.error("Error al crear Profesor:", error);
      res.status(500).json({
        message: "Error al crear Profesor",
        error: error.message,
      });
    }
  }

  async login(
    req: Request<{}, {}, LoginUserRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = req.body;
    
    try {
      if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Se requiere correo electrónico o contraseña",
        });
      }

      const user = await userRepository.findOne({
        where: {
          email: email,
        },
        relations: {
          role: true,
        },
        select: {
          role: {
            role_name: true,
          },
        },
      });

      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Correo electrónico o contraseña incorrectos",
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Correo electrónico o contraseña incorrectos",
        });
      }

      const userRole = user.role.role_name;

      const tokenPayload: TokenData = {
        userId: user.id?.toString() as string,
        userRoles: userRole as string,
      };

      const token = jwt.sign(tokenPayload, "123", {
        expiresIn: "3h",
      });

      res.status(StatusCodes.OK).json({
        message: "Iniciar sesión exitosamente",
        token,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error al iniciar sesión",
        error,
      });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({
        id: id,
      });

      if (!user) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener usuario",
      });
    }
  }

  async update(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;
      const data = req.body;

      const userRepository = AppDataSource.getRepository(User);
      await userRepository.update({ id: id }, data);

      res.status(202).json({
        message: "Usuario actualizado con éxito",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al actualizar usuario",
      });
    }
  }

  async allTeachers(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const teacherRepository = AppDataSource.getRepository(Teacher);

      const allTeachers = await teacherRepository.find({
        relations: ["user"],
      });

      const teachersWithDetails = allTeachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.user.name,
        photo: teacher.photo,
      }));

      res.status(200).json(teachersWithDetails);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener teacheras",
      });
    }
  }

  async getAllUsers(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const UserRepository = AppDataSource.getRepository(User);

      let { page, skip } = req.query;

      let currentPage = page ? +page : 1;
      let itemsPerPage = skip ? +skip : 10;

      const [allUsers, count] = await UserRepository.findAndCount({
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
        select: {
          id: true,
          nick_name: true,
          name: true,
          email: true,
        },
      });
      res.status(200).json({
        count,
        skip: itemsPerPage,
        page: currentPage,
        results: allUsers,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al conseguir asignaturas",
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;

      const userRepository = AppDataSource.getRepository(User);
      await userRepository.delete({ id: id });

      res.status(200).json({
        message: "Usuario eliminado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al eliminar usuario",
      });
    }
  }
}
