import { Request, Response } from "express";
import {
  CreateTeacherRequestBody,
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
import { Enrollment } from "../models/Enrollment";

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
    req: Request<{}, {}, CreateTeacherRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
    const userRepository = AppDataSource.getRepository(User);
    const { nick_name, name, email, password, photo } = req.body;
    try {
      
      const userData = userRepository.create({
        nick_name,
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role: UserRoles.Teacher,

      });
      await userRepository.save(userData);

      const teacherRepository = AppDataSource.getRepository(Teacher);
      await teacherRepository.save({
        user: userData,
        photo,
      });
      res.status(201).json("Profesor creado exitosamente");
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
          id: true,
          password: true,
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

  // async getProfile(req: Request, res: Response): Promise<void | Response<any>> {
  //   try {
  //     const id = +req.params.id;
  
  //     const userRepository = AppDataSource.getRepository(User);
  //     const user = await userRepository.findOne({
  //       where: { id: id }, 
  //       relations: ["enrollment", "progresses"],
  //       select: ["id", "nick_name", "name"], 
  //     });
  
  //     if (!user) {
  //       return res.status(404).json({
  //         message: "User not found",
  //       });
  //     }
  
  //     res.status(200).json(user);
  //   } catch (error) {
  //     console.error("Error while getting user:", error);
  //     res.status(500).json({
  //       message: "Error while getting user",
  //     });
  //   }
  // }

//   async getProfile(req: Request, res: Response): Promise<void | Response<any>> {
//     try {
//       const id = +req.params.id;
  
//       const enrollmentRepository = AppDataSource.getRepository(Enrollment);
//       const enrollmentData = await enrollmentRepository.find({
//         where: { user_id: id }, 
//         relations: ["user", "subjects"],
//         select: ["id", "user_id", "enrollment_date"], 
//       });

//   const profileData = enrollmentData.map((enrollment) => ({
    
// id: enrollment.id, 
// enrollment_date: enrollment.enrollment_date, 
// user:{
//   id: enrollment.user.id,
//   name: enrollment.user.name,
//   nick_name: enrollment.user.nick_name,
// },
// subjects: {
// subject_id: enrollment.subjects,
// }
//   })

//   )

//       // if (!user) {
//       //   return res.status(404).json({
//       //     message: "User not found",
//       //   });
//       // }
  
//       res.status(200).json(profileData);
//     } catch (error) {
//       console.error("Error while getting user:", error);
//       res.status(500).json({
//         message: "Error while getting user",
//       });
//     }
//   }

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
