import {
  createLessonPlan,
  findAll,
  findOne,
  remove,
  update,
} from '../../function/lesson-plan-context';
import { Context, MockContext, createMockContext } from '../../context';
import { LessonPlanType } from '../common/enums/lesson-plan-type.enum';

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test('should create new lesson plan', async () => {
  const lessonPlan = {
    id: '1',
    periodId: '2',
    scheduleId: '3',
    date: new Date('2020-05-01'),
    topic: 'New topic',
    description: 'New desc',
    content: 'New content',
    students: ['1', '2'],
    purposeOfClass: 'New purpose',
    results: 'Results',
    bibliography: 'bibliography',
    materials: 'materials',
    evaluation: 'evaluation',
    comments: 'comments',
    resources: ['1', '2', '3'],
    notification: 'yes',
    notificationDate: new Date('2020-05-4'),
    deadlineDate: new Date('2020-05-13'),
    lessonPlanNumber: 2,
    maximumValidationDate: new Date('2020-05-01'),
    validationExpired: false,
    validationsTracking: [],
    trackingSteps: {},
    isValidatedByManager: false,
    remedialReports: [],
    hasQualified: false,
    createdAt: new Date('2020-05-01'),
    type: LessonPlanType.NORMAL,
  };

  mockCtx.prisma.lessonPlan.create.mockResolvedValue(lessonPlan);

  await expect(createLessonPlan(lessonPlan, ctx)).resolves.toEqual({
    id: '1',
    periodId: '2',
    scheduleId: '3',
    date: new Date('2020-05-01'),
    topic: 'New topic',
    description: 'New desc',
    content: 'New content',
    students: ['1', '2'],
    purposeOfClass: 'New purpose',
    results: 'Results',
    bibliography: 'bibliography',
    materials: 'materials',
    evaluation: 'evaluation',
    comments: 'comments',
    resources: ['1', '2', '3'],
    notification: 'yes',
    notificationDate: new Date('2020-05-4'),
    deadlineDate: new Date('2020-05-13'),
    lessonPlanNumber: 2,
    maximumValidationDate: new Date('2020-05-01'),
    validationExpired: false,
    validationsTracking: [],
    trackingSteps: {},
    isValidatedByManager: false,
    remedialReports: [],
    hasQualified: false,
    createdAt: new Date('2020-05-01'),
    type: LessonPlanType.NORMAL,
  });
});

test('should return a lessonPlan', async () => {
  const lessonPlan = {
    id: '1',
    periodId: '2',
    scheduleId: '3',
    date: new Date('2020-05-01'),
    topic: 'New topic',
    description: 'New desc',
    content: 'New content',
    students: ['1', '2'],
    purposeOfClass: 'New purpose',
    results: 'Results',
    bibliography: 'bibliography',
    materials: 'materials',
    evaluation: 'evaluation',
    comments: 'comments',
    resources: ['1', '2', '3'],
    notification: 'yes',
    notificationDate: new Date('2020-05-4'),
    deadlineDate: new Date('2020-05-13'),
    lessonPlanNumber: 2,
    maximumValidationDate: new Date('2020-05-01'),
    validationExpired: false,
    validationsTracking: [],
    trackingSteps: {},
    isValidatedByManager: false,
    remedialReports: [],
    hasQualified: false,
    createdAt: new Date('2020-05-01'),
    type: LessonPlanType.NORMAL,
  };

  mockCtx.prisma.lessonPlan.findUnique.mockResolvedValue(lessonPlan);

  await expect(findOne(lessonPlan.id, ctx)).resolves.toEqual({
    id: '1',
    periodId: '2',
    scheduleId: '3',
    date: new Date('2020-05-01'),
    topic: 'New topic',
    description: 'New desc',
    content: 'New content',
    students: ['1', '2'],
    purposeOfClass: 'New purpose',
    results: 'Results',
    bibliography: 'bibliography',
    materials: 'materials',
    evaluation: 'evaluation',
    comments: 'comments',
    resources: ['1', '2', '3'],
    notification: 'yes',
    notificationDate: new Date('2020-05-4'),
    deadlineDate: new Date('2020-05-13'),
    lessonPlanNumber: 2,
    maximumValidationDate: new Date('2020-05-01'),
    validationExpired: false,
    validationsTracking: [],
    trackingSteps: {},
    isValidatedByManager: false,
    remedialReports: [],
    hasQualified: false,
    createdAt: new Date('2020-05-01'),
    type: LessonPlanType.NORMAL,
  });
});

test('should return all lessonPlan', async () => {
  const lessonPlans = [
    {
      id: '1',
      periodId: '2',
      scheduleId: '3',
      date: new Date('2020-05-01'),
      topic: 'New topic',
      description: 'New desc',
      content: 'New content',
      students: ['1', '2'],
      purposeOfClass: 'New purpose',
      results: 'Results',
      bibliography: 'bibliography',
      materials: 'materials',
      evaluation: 'evaluation',
      comments: 'comments',
      resources: ['1', '2', '3'],
      notification: 'yes',
      notificationDate: new Date('2020-05-4'),
      deadlineDate: new Date('2020-05-13'),
      lessonPlanNumber: 2,
      maximumValidationDate: new Date('2020-05-01'),
      validationExpired: false,
      validationsTracking: [],
      trackingSteps: {},
      isValidatedByManager: false,
      remedialReports: [],
      hasQualified: false,
      createdAt: new Date('2020-05-01'),
      type: LessonPlanType.NORMAL,
    },
    {
      id: '2',
      periodId: '2',
      scheduleId: '3',
      date: new Date('2020-05-01'),
      topic: 'New topic',
      description: 'New desc',
      content: 'New content',
      students: ['1', '2'],
      purposeOfClass: 'New purpose',
      results: 'Results',
      bibliography: 'bibliography',
      materials: 'materials',
      evaluation: 'evaluation',
      comments: 'comments',
      resources: ['1', '2', '3'],
      notification: 'yes',
      notificationDate: new Date('2020-05-4'),
      deadlineDate: new Date('2020-05-13'),
      lessonPlanNumber: 2,
      maximumValidationDate: new Date('2020-05-01'),
      validationExpired: false,
      validationsTracking: [],
      trackingSteps: {},
      isValidatedByManager: false,
      remedialReports: [],
      hasQualified: false,
      createdAt: new Date('2020-05-01'),
      type: LessonPlanType.NORMAL,
    },
  ];

  mockCtx.prisma.lessonPlan.findMany.mockResolvedValue(lessonPlans);

  await expect(findAll(ctx)).resolves.toHaveLength(2);
});

test('should update a lesson plan', async () => {
  const lessonPlan = {
    id: '1',
    periodId: '2',
    scheduleId: '3',
    date: new Date('2020-05-01'),
    topic: 'New topic',
    description: 'New desc',
    content: 'New content',
    students: ['1', '2'],
    purposeOfClass: 'New purpose',
    results: 'Results',
    bibliography: 'bibliography',
    materials: 'materials',
    evaluation: 'evaluation',
    comments: 'comments',
    resources: ['1', '2', '3'],
    notification: 'yes',
    notificationDate: new Date('2020-05-4'),
    deadlineDate: new Date('2020-05-13'),
    lessonPlanNumber: 2,
    maximumValidationDate: new Date('2020-05-01'),
    validationExpired: false,
    validationsTracking: [],
    trackingSteps: {},
    isValidatedByManager: false,
    remedialReports: [],
    hasQualified: false,
    createdAt: new Date('2020-05-01'),
    type: LessonPlanType.NORMAL,
  };

  mockCtx.prisma.lessonPlan.update.mockResolvedValue(lessonPlan);

  await expect(update(lessonPlan.id, lessonPlan, ctx)).resolves.toEqual({
    id: '1',
    periodId: '2',
    scheduleId: '3',
    date: new Date('2020-05-01'),
    topic: 'New topic',
    description: 'New desc',
    content: 'New content',
    students: ['1', '2'],
    purposeOfClass: 'New purpose',
    results: 'Results',
    bibliography: 'bibliography',
    materials: 'materials',
    evaluation: 'evaluation',
    comments: 'comments',
    resources: ['1', '2', '3'],
    notification: 'yes',
    notificationDate: new Date('2020-05-4'),
    deadlineDate: new Date('2020-05-13'),
    lessonPlanNumber: 2,
    maximumValidationDate: new Date('2020-05-01'),
    validationExpired: false,
    validationsTracking: [],
    trackingSteps: {},
    isValidatedByManager: false,
    remedialReports: [],
    hasQualified: false,
    createdAt: new Date('2020-05-01'),
    type: LessonPlanType.NORMAL,
  });
});

test('should return empty lesson plan', async () => {
  mockCtx.prisma.lessonPlan.findUnique.mockResolvedValue(null);

  await expect(findOne('1', ctx)).resolves.toEqual(null);
});

it('should return an empty array if no lesson plans found', async () => {
  mockCtx.prisma.lessonPlan.findMany.mockResolvedValue([]);

  await expect(findAll(ctx)).resolves.toEqual([]);
});

test('should remove a lesson plan', async () => {
  const lessonPlan = {
    id: '1',
    periodId: '2',
    scheduleId: '3',
    date: new Date('2020-05-01'),
    topic: 'New topic',
    description: 'New desc',
    content: 'New content',
    students: ['1', '2'],
    purposeOfClass: 'New purpose',
    results: 'Results',
    bibliography: 'bibliography',
    materials: 'materials',
    evaluation: 'evaluation',
    comments: 'comments',
    resources: ['1', '2', '3'],
    notification: 'yes',
    notificationDate: new Date('2020-05-4'),
    deadlineDate: new Date('2020-05-13'),
    lessonPlanNumber: 2,
    maximumValidationDate: new Date('2020-05-01'),
    validationExpired: false,
    validationsTracking: [],
    trackingSteps: {},
    isValidatedByManager: false,
    remedialReports: [],
    hasQualified: false,
    createdAt: new Date('2020-05-01'),
    type: LessonPlanType.NORMAL,
  };

  mockCtx.prisma.lessonPlan.delete.mockResolvedValue(lessonPlan);

  await expect(remove(lessonPlan.id, ctx)).resolves.toEqual({
    id: '1',
    periodId: '2',
    scheduleId: '3',
    date: new Date('2020-05-01'),
    topic: 'New topic',
    description: 'New desc',
    content: 'New content',
    students: ['1', '2'],
    purposeOfClass: 'New purpose',
    results: 'Results',
    bibliography: 'bibliography',
    materials: 'materials',
    evaluation: 'evaluation',
    comments: 'comments',
    resources: ['1', '2', '3'],
    notification: 'yes',
    notificationDate: new Date('2020-05-4'),
    deadlineDate: new Date('2020-05-13'),
    lessonPlanNumber: 2,
    maximumValidationDate: new Date('2020-05-01'),
    validationExpired: false,
    validationsTracking: [],
    trackingSteps: {},
    isValidatedByManager: false,
    remedialReports: [],
    hasQualified: false,
    createdAt: new Date('2020-05-01'),
    type: LessonPlanType.NORMAL,
  });
});
