import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './schedule.entity';

export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}
  async updateSchedule(id: string, updateScheduleDto: UpdateScheduleDto) {
    const scheduleExist = await this.scheduleRepository.findOne({
      where: {
        id,
      },
    });
    if (!scheduleExist) throw new NotFoundException('Docente no existe');
    if (updateScheduleDto.day === '') {
      updateScheduleDto.day = scheduleExist.day;
    }
    if (updateScheduleDto.hour === '') {
      updateScheduleDto.hour = scheduleExist.hour;
    }
    const data = await this.scheduleRepository.preload({
      id,
      ...updateScheduleDto,
    });
    return this.scheduleRepository.save(data);
  }
}
