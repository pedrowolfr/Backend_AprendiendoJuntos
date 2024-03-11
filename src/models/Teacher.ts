import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity("teachers")
export class Teacher {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  photo?: string;

  @Column()
  subject?: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToOne(() => User, (user) => user.teacher)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
