import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role";
import { Teacher } from "./Teacher";
import { Enrollments } from "./Enrollment";
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

  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher?: Teacher;

  @OneToOne(() => Enrollments, (enrollments) => enrollments.user)
  enrollment?: Enrollments;

  @OneToMany(() => Progress, (progress) => progress.user) 
  progresses!: Progress[];
}
