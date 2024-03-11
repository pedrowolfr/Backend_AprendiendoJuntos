import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Teacher } from "./Teacher";
import { Activity } from "./Activity";

@Entity("subjects")
export class Subject {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column()
  teacher_id!: number;

  @Column()
  activity_id!: number;

  @Column()
  subject_name!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.role)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user!: User;

  @ManyToOne(() => Teacher, (teacher) => teacher.user)
  @JoinColumn({ name: "teacher_id", referencedColumnName: "id" })
  teacher!: Teacher;

  @OneToMany(() => Activity, (activity) => activity.subject)
  activities!: Activity[];
}
