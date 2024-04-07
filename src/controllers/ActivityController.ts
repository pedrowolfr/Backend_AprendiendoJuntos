import { Request, Response } from "express";
import { Activity } from "../models/Activity";
import { AppDataSource } from "../database/data-source";
import { CreateActivitiesRequestBody } from "../types/types";
import { Enrollment } from "../models/Enrollment";
import { In } from "typeorm";

export class ActivityController {
  async getMyActivities(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    try {
      const userId = +req.params.id;
      const enrollmentRepository = AppDataSource.getRepository(Enrollment);
      const myEnrollments = await enrollmentRepository.find({
        where: { user_id: userId },
        relations: ["subject", "subject.activities"],
        select: ["subject_id"],
      });

      const enrollmentsWithDetails = myEnrollments.map((enrollment) => {
        const subject = enrollment.subject || {};
        const activities = subject.activities || [];

        return {
          subject: {
            id: subject.id || null,
            name: subject.subject_name || null,
          },
          activities: activities.map((activity) => ({
            id: activity.id || null,
            activity_name: activity.activity_name || null,
          })),
        };
      });

      res.status(200).json(enrollmentsWithDetails);
    } catch (error) {
      console.error("Error while getting enrollments:", error);
      res.status(500).json({
        message: "Error while getting enrollments",
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
        return res.status(404).json({
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
      res.status(201).json({
        message: "Actividad creada correctamente",
        activity: newActivity,
      });
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).json({ message: "Error al crear actividad" });
    }
  }
}
