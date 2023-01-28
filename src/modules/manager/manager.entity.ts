import { User } from 'src/modules/user/user-entity';
import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Degree } from '../degree/degree.entity';

@Entity()
export class Manager {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Degree, (degree) => degree.manager)
  degree: Degree[];

  @ManyToOne(() => User, (user) => user.manager)
  user: User;
}
