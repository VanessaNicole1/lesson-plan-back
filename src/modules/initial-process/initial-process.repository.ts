import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateInitialProcessDto } from './dto/create-initial-process.dto';
import { getFullYearTest, getMonth } from './../../utils/date.utils';

@Injectable()
export class InitialProcessRepository {
  constructor(private prisma: PrismaService) {}

  async create(createInitialProcessDto: CreateInitialProcessDto, roleIds) {
    const userStudents = [];
    const userTeachers = [];
    const grades = [];
    const { period, degree, manager, students, teachers } = createInitialProcessDto;
    const { studentRoleId, teacherRoleId } = roleIds;
    const uniqueGrades = [
      ...new Set(
        students.map(
          ({ numberParallel, parallel }) => `${numberParallel}-${parallel}`,
        ),
      ),
    ];

    try {
      for (const uniqueGrade of uniqueGrades) {
        const [numberParallel, parallel] = uniqueGrade.split('-');
        const studentsFromUniqueGrade = students.filter(
          (student) =>
            student.numberParallel === numberParallel &&
            student.parallel === parallel
        );
        const schedules = teachers
          .filter(
            (teacher) =>
              teacher.numberParallel === numberParallel &&
              teacher.parallel === parallel
          )
          .map((teacher) => {
            return {
              teacher: {
                name: teacher.name,
                lastName: teacher.lastName,
                email: teacher.email,
              },
              subject: {
                name: teacher.subject,
              },
            };
          });
  
        grades.push({
          numberParallel,
          parallel,
          students: studentsFromUniqueGrade,
          schedules,
        });
      }
  
      const { startDate, endDate } = period;
      const startDateFormat = `${getMonth(startDate)} ${getFullYearTest(startDate)}`;
      const endDateFormat = `${getMonth(endDate)} ${getFullYearTest(endDate)}`;
  
      const { name: nameDegree } = degree;
  
      let createdPeriod;
  
      await this.prisma.$transaction(async (tx) => {
        createdPeriod = await tx.period.create({
          data: {
            startDate: new Date(period.startDate),
            endDate: new Date(period.endDate),
            displayName: `${startDateFormat}  -  ${endDateFormat}  ${nameDegree}`,
            isActive: true,
          },
        });
  
        const createdManager = await tx.manager.create({
          data: manager,
        });
  
        const createdDegree = await tx.degree.create({
          data: {
            ...degree,
            periodId: createdPeriod.id,
            managerId: createdManager.id,
          },
        });
  
        for await (const grade of grades) {
          const createdGrade = await tx.grade.create({
            data: {
              number: grade.numberParallel,
              parallel: grade.parallel,
              degreeId: createdDegree.id,
            },
          });
  
          for (const student of grade.students) {
            const userAttachedToStudent = await tx.user.findUnique({
              where: {
                email: student.email,
              },
            });
  
            if (userAttachedToStudent) {
              await tx.user.update({
                where: {
                  email: userAttachedToStudent.email
                },
                data: {
                  roles: {
                    connect: {
                      id: studentRoleId
                    }
                  }
                }
              });

              userStudents.push(userAttachedToStudent);
              await tx.student.create({
                data: {
                  gradeId: createdGrade.id,
                  userId: userAttachedToStudent.id,
                },
              });
            } else {
              const createdUser = await tx.user.create({
                data: {
                  name: student.name,
                  lastName: student.lastName,
                  email: student.email,
                  displayName: `${student.name} ${student.lastName}`,
                  roles: {
                    connect: { id: studentRoleId },
                  },
                  registerConfig: {
                    create: {}
                  }
                },
                include: {
                  registerConfig: {}
                }
              });

              userStudents.push({...createdUser });
              await tx.student.create({
                data: {
                  gradeId: createdGrade.id,
                  userId: createdUser.id,
                },
              });
            }
          }
  
          for (const schedule of grade.schedules) {
            const { teacher, subject } = schedule;
  
            const userAttachedToTeacher = await tx.user.findUnique({
              where: {
                email: teacher.email,
              },
            });
  
            let createdTeacher;
  
            if (userAttachedToTeacher) {
              await tx.user.update({
                where: {
                  email: userAttachedToTeacher.email
                },
                data: {
                  roles: {
                    connect: {
                      id: teacherRoleId
                    }
                  }
                }
              });

              userTeachers.push(userAttachedToTeacher);
              createdTeacher = await tx.teacher.create({
                data: {
                  userId: userAttachedToTeacher.id,
                },
              });
            } else {
              const createdUser = await tx.user.create({
                data: {
                  name: teacher.name,
                  lastName: teacher.lastName,
                  email: teacher.email,
                  displayName: `${teacher.name} ${teacher.lastName}`,
                  roles: {
                    connect: { id: teacherRoleId },
                  },
                  registerConfig: {
                    create: {}
                  }
                },
                include: {
                  registerConfig: {},
                }
              });

              userTeachers.push({...createdUser });
  
              createdTeacher = await tx.teacher.create({
                data: {
                  userId: createdUser.id,
                },
              });
            }
  
            let subjectInDatabase = await tx.subject.findFirst({
              where: {
                name: {
                  equals: subject.name,
                },
                schedules: {
                  some: {
                    grade: {
                      degree: {
                        period: {
                          id: createdPeriod.id,
                        },
                      },
                    },
                  },
                },
              },
            });
  
            if (!subjectInDatabase) {
              subjectInDatabase = await tx.subject.create({
                data: {
                  name: subject.name,
                },
              });
            }
  
            await tx.schedule.create({
              data: {
                gradeId: createdGrade.id,
                teacherId: createdTeacher.id,
                subjectId: subjectInDatabase.id,
                day: 'UNDEFINED',
                startHour: 'UNDEFINED',
                endHour: 'UNDEFINED',
              },
            });
          }
        }
      });
  
      return [userStudents, userTeachers];
    } catch (error) {
      throw new InternalServerErrorException('Something was wrong at the moment to Start the Process.')
    }
  }

  findAll() {
    return [
      {
        name: 'Fake initial Process',
      },
    ];
  }
}
