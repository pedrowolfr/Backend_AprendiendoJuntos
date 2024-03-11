import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role";
import { Teacher } from "./Teacher";
import { Subject } from "./Subject";
import { Progress } from "./Progress";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  nick_name!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: "role_id" })
  role!: Role;

  @OneToOne(() => Teacher, (teachers) => teachers.user)
  teacher?: Teacher;

  @OneToMany(() => Subject, (subjects) => subjects.user)
  studentSubjects!: Subject[];

  @OneToMany(() => Progress, (progress) => progress.user)
  progresses!: Progress[];
}
