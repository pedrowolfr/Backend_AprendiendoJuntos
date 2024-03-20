import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @OneToOne(() => User, (user) => user.enrollment)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => Subject, subject => subject.enrollment)
  subjects!: Subject[];
}
