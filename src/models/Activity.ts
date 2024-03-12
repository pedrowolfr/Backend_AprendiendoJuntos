import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Subject } from "./Subject";
import { Progress } from "./Progress";

@Entity("activities")
export class Activity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  subject_id!: number;

  @Column()
  activity_name!: string;

  @Column()
  content!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToMany(() => Progress, (progress) => progress.activity)
  progresses!: Progress[];

  @ManyToOne(() => Subject, (subject) => subject.activities)
  subject!: Subject;
}
