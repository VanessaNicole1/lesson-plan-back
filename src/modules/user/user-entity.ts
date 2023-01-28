import { Role } from 'src/modules/role/role.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Manager } from '../manager/manager.entity';
import { Student } from '../students/student.entity';
import { Teacher } from '../teachers/teacher.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  displayName: string;

  @OneToMany(() => Manager, (manager) => manager.user)
  manager?: Manager[];

  @OneToMany(() => Student, (student) => student.user)
  student?: Student[];

  @OneToMany(() => Teacher, (teacher) => teacher.user)
  teacher?: Teacher[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compareSync(password, this.password);
  }
}
