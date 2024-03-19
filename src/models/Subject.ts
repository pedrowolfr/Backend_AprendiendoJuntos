import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Teacher } from "./Teacher";
import { Activity } from "./Activity";
import { Enrollment } from "./Enrollment";

@Entity("subjects")
export class Subject {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  teacher_id!: number;

  // @Column()
  // activity_id!: number;

  @Column()
  subject_name!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => Teacher, (teacher) => teacher.user)
  @JoinColumn({ name: "teacher_id", referencedColumnName: "id" })
  teacher!: Teacher;

  @OneToMany(() => Activity, (activity) => activity.subject)
  activities!: Activity[];

  // @ManyToOne(() => Enrollment, (enrollment) => enrollment.subjects)
  // @JoinColumn({ name: "subject_id" })
  // enrollment!: Enrollment;
}
