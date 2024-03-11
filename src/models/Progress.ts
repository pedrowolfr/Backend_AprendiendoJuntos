import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Activity } from "./Activity";

@Entity("progress")
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
  user!: User;

  @ManyToOne(() => Activity, (activity) => activity.progresses)
  activity!: Activity;
}
