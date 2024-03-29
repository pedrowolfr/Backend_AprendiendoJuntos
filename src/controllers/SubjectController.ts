import { Request, Response } from "express";
import { Subject } from "../models/Subject";
import { AppDataSource } from "../database/data-source";
import { Teacher } from "../models/Teacher";
import { CreateSubjectsRequestBody } from "../types/types";

export class SubjectController {
  async getAllSubjects(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
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
    req: Request<{}, {}, CreateSubjectsRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const { teacher_id, subject_name } = req.body;
      const subjectRepository = AppDataSource.getRepository(Subject);

      const teacherRepository = AppDataSource.getRepository(Teacher);
      const teacher = await teacherRepository.findOne({
        where: { id: teacher_id },
      });

      if (!teacher) {
        return res
          .status(400)
          .json({ message: "El profesor especificado no existe." });
      }

      const newSubject = subjectRepository.create({
        teacher_id,
        subject_name,
      });
      await subjectRepository.save(newSubject);
      res.status(201).json({
        message: "Asignatura creada exitosamente",
        Subject: newSubject,
      });
    } catch (error: any) {
      console.error("Error al crear la asignatura:", error);
      res.status(500).json({
        message: "Error al crear la asignatura",
        error: error.message,
      });
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
