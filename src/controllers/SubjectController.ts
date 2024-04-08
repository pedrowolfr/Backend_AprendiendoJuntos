import { Request, Response } from "express";
import { Subject } from "../models/Subject";
import { AppDataSource } from "../database/data-source";

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
