import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class LessonPlansTrackingRepository {
  constructor(private prisma: PrismaService) {}
}
