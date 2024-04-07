import { Request, Response } from "express";
import { Subject } from "../models/Subject";
import { AppDataSource } from "../database/data-source";
import { CreateEnrollmentsRequestBody } from "../types/types";
import { Enrollment } from "../models/Enrollment";

export class EnrollmentController {
  async create(
    req: Request<{}, {}, CreateEnrollmentsRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const data = req.body;
      const enrollmentRepository = AppDataSource.getRepository(Enrollment);

      const subjectRepository = AppDataSource.getRepository(Subject);
      const subject = await subjectRepository.findOne({
        where: { id: data.subject_id },
      });
      if (!subject) {
        return res
          .status(400)
          .json({ message: "La asignatura especificada no existe." });
      }

      const newEnrollment = await enrollmentRepository.save(data);
      res.status(201).json({
        message: "Matricula exitosa",
        enrollment: newEnrollment,
      });
    } catch (error: any) {
      console.error("Error al crear matricula:", error);
      res.status(500).json({
        message: "Error al crear matricula",
        error: error.message,
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const userId = +req.params.id;
      const enrollmentRepository = AppDataSource.getRepository(Enrollment);

      const enrollments = await enrollmentRepository.find({
        where: { user_id: userId },
        relations: ["subject", "subject.teacher", "subject.teacher.user"], // Carga las relaciones necesarias
        select: ["id", "subject_id", "enrollment_date"],
      });

      res.status(200).json(enrollments);
    } catch (error) {
      console.error("Error al conseguir matriculas:", error);
      return res.status(500).json({
        message: "Error al conseguir matriculas",
        error: error as string,
      });
    }
  }
}
