import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Subject } from "./Subject";

@Entity("enrollments")
export class Enrollment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column()
  subject_id!: number;

  @Column()
  enrollment_date!: Date;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.enrollment)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Subject, (subject) => subject.enrollments)
  @JoinColumn({ name: "subject_id" })
  subject!: Subject;
}
