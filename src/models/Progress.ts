import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Activity } from "./Activity";

@Entity("progresses")
export class Progress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column()
  activity_id!: number;

  @Column()
  score!: number;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.progresses)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Activity, (activity) => activity.progresses)
  @JoinColumn({ name: "activity_id" })
  activity!: Activity;
}
