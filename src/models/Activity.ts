import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subject } from "./Subject";
import { Progress } from "./Progress"; 

@Entity("activities")
export class Activity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  activity_name!: string;

  @Column()
  content!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => Subject, (subject) => subject.activities)
  @JoinColumn({ name: "subject_id", referencedColumnName: "id" })
  subject!: Subject;

  @OneToMany(() => Progress, (progress) => progress.activity) 
  progresses!: Progress[];
}
