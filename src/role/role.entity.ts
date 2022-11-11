import { User } from 'src/user/user-entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @ManyToMany((type) => User, (user) => user.roles, {
    cascade: true,
  })
  @JoinTable()
  users: User[];
}
