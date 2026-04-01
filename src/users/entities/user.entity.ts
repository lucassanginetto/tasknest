import { Task } from 'src/tasks/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public username: string;

  @Column()
  public password: string;

  @CreateDateColumn()
  public createdAt: Date;

  @OneToMany(() => Task, (task) => task.user, { cascade: true })
  public tasks: Task[];
}
