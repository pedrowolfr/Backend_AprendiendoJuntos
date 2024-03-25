import { Request, Response } from "express";
import { Activity } from "../models/Activity";
import { AppDataSource } from "../database/data-source";
import { CreateActivitiesRequestBody } from "../types/types";

export class ActivityController {
  async getAllActivities(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const activityRepository = AppDataSource.getRepository(Activity);

      const allActivities = await activityRepository.find({
        select: ["id", "activity_name"],
      });

      res.status(200).json(allActivities);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener actividades",
      });
    }
  }

  async getBySubject(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const subjectId = +req.params.id;
      const activityRepository = AppDataSource.getRepository(Activity);

      const activities = await activityRepository.find({
        where: { subject_id: subjectId },
      });

      if (!activities || activities.length === 0) {
        return res
          .status(404)
          .json({
            message: "No se encontraron actividades para esta asignatura",
          });
      }

      res.status(200).json(activities);
    } catch (error) {
      console.error("Error al buscar actividades de la asignatura:", error);
      res
        .status(500)
        .json({ message: "Error al obtener actividades de la asignatura" });
    }
  }

  async createActivity(
    req: Request<{}, {}, CreateActivitiesRequestBody>,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const { subject_id, activity_name, content } = req.body;
      const activityRepository = AppDataSource.getRepository(Activity);

      const newActivity = activityRepository.create({
        subject_id,
        activity_name,
        content,
      });
      await activityRepository.save(newActivity);
      res
        .status(201)
        .json({
          message: "Actividad creada correctamente",
          activity: newActivity,
        });
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).json({ message: "Error al crear actividad" });
    }
  }

  async updateActivity(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;
      const data = req.body;

      const activityRepository = AppDataSource.getRepository(Activity);
      await activityRepository.update({ id: id }, data);

      res.status(202).json({
        message: "Actividad actualizada exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        message: "Actividad actualizada exitosamente",
      });
    }
  }

  async deleteActivity(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const id = +req.params.id;
      const activityRepository = AppDataSource.getRepository(Activity);
      await activityRepository.delete(id);

      res.status(200).json({
        message: "Actividad eliminada exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al eliminar la Actividad",
      });
    }
  }
}
