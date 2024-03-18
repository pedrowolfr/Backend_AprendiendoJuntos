import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Subject } from "./Subject";

@Entity("teachers")
export class Teacher {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  photo?: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToOne(() => User, (user) => user.teacher)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => Subject, (subject) => subject.teacher)
  studentSubjects!: Subject[];
}
