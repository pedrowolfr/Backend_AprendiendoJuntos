import { Request, Response } from "express";
import { Subject } from "../models/Subject";
import { AppDataSource } from "../database/data-source";
import { CreateEnrollmentsRequestBody } from "../types/types";
import { Enrollment } from "../models/Enrollment";

export class SubjectController {
  async getAll(req: Request, res: Response): Promise<void | Response<any>> {
    try {
      const subjectRepository = AppDataSource.getRepository(Subject);

      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 6;

      interface filter {
        [key: string]: any;
      }
      const filter: any = {
        select: {
          subject_name: true,
          teacher_id: true,
          id: true,
        },
      };

      if (page && limit) {
        filter.skip = (page - 1) * limit;
      }
      if (limit) {
        filter.take = limit;
      }

      const [allSubjects, count] = await subjectRepository.findAndCount(filter);

      res.status(200).json({
        count,
        limit,
        page,
        results: allSubjects,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener asignaturas",
      });
    }
  }

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
        return res.status(400).json({ message: "La asignatura especificada no existe." });
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
      const enrollmentId = +req.params.id;
      const enrollmentRepository = AppDataSource.getRepository(Enrollment);
      const enrollment = await enrollmentRepository.findOne({
        where: { id: enrollmentId },
        relations: ["user", "subject"],
        select: ["id", "user", "subject", "enrollment_date"],
      });

      if (!enrollment) {
        return res.status(404).json({ message: "Enrollment no encontrado" });
      }

      const enrollmentDetails = {
        enrollment_id: enrollment.id,
        user_id: enrollment.user.id,
        subject_id: enrollment.subject.id,
        enrollment_date: enrollment.enrollment_date,
      };

      res.status(200).json(enrollmentDetails);
    } catch (error) {
      console.error("Error al obtener el enrollment:", error);
      res.status(500).json({ message: "Error al obtener el enrollment" });
    }
  }

  async getByTeacher(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const subjectId = +req.params.id;
      const subjectRepository = AppDataSource.getRepository(Subject);

      const subject = await subjectRepository
        .createQueryBuilder("subject")
        .leftJoinAndSelect("subject.teacher", "teacher")
        .where("subject.id = :subjectId", { subjectId })
        .getOne();

      if (!subject || !subject.teacher) {
        return res
          .status(404)
          .json({ message: "Asignatura o profesor asociado no encontrado" });
      }

      const teacherId = subject.teacher.id;
      const subjects = await subjectRepository.find({
        where: { teacher_id: teacherId },
      });
      res.status(200).json(subjects);
    } catch (error) {
      console.error("Error al buscar asignaturas del profesor:", error);
      res
        .status(500)
        .json({ message: "Error al obtener asignaturas del profesor" });
    }
  }

  async updateSubject(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;
      const data = req.body;

      const subjectRepository = AppDataSource.getRepository(Subject);
      await subjectRepository.update({ id: id }, data);

      res.status(202).json({
        message: "Asignatura actualizada exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        message: "Asignatura actualizada exitosamente",
      });
    }
  }

  async deleteSubject(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;
      const subjectRepository = AppDataSource.getRepository(Subject);
      await subjectRepository.delete(id);

      res.status(200).json({
        message: "Asignatura eliminada exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al eliminar la Asignatura",
      });
    }
  }
}
