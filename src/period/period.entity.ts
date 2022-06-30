import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
