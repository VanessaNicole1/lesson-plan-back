import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.schedule.findMany();
  }

  findAllByPeriodIds(periodIds: string[]) {
    return this.prisma.schedule.findMany({
      where: {
        periodId: {
          in: periodIds
        }
      },
      include: {
        subject: true,
        grade: true
      },
    })
  };

  findOne(id: string) {
    return this.prisma.schedule.findUnique({
      where: {
        id,
      },
    });
  }

  findSchedulesByTeacherInActivePeriod(periodId: string, teacherId: string) {
    return this.prisma.schedule.findMany({
      where: {
        teacherId,
        periodId
      },
      include: {
        subject: true,
        grade: true
      }
    });
  }

  update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const { metadata } = updateScheduleDto;
    return this.prisma.schedule.update({
      where: {
        id
      },
      data: {
        metadata
      }
    })
  };
  
  findByTeacher(teacherId: string) {
    return this.prisma.schedule.findMany({
      where: {
        teacherId,
      },
    });
  }
}
