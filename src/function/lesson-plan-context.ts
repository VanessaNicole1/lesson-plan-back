import { Context } from '../context';

interface CreateLessonPlan {
  periodId: string;
  scheduleId: string;
  date: Date;
  topic: string;
  description: string;
  content: string;
  students: any;
  purposeOfClass: string;
  results: string;
  bibliography: string;
  comments: string;
  resources: any;
  notification: string;
  notificationDate: Date;
  deadlineDate: Date;
}

export async function createLessonPlan(
  lessonPlan: CreateLessonPlan,
  ctx: Context,
) {
  return await ctx.prisma.lessonPlan.create({
    data: lessonPlan,
  });
}

export async function findOne(id: string, ctx: Context) {
  return await ctx.prisma.lessonPlan.findUnique({
    where: {
      id,
    },
  });
}

export async function findAll(ctx: Context) {
  return await ctx.prisma.lessonPlan.findMany({});
}

export async function update(
  id: string,
  lessonPlan: CreateLessonPlan,
  ctx: Context,
) {
  return await ctx.prisma.lessonPlan.update({
    where: {
      id,
    },
    data: lessonPlan,
  });
}

export async function remove(id: string, ctx: Context) {
  const deleteLessonPlan = await ctx.prisma.lessonPlan.delete({
    where: {
      id,
    },
  });
  return deleteLessonPlan;
}
