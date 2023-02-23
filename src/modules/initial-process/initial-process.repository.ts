import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { CreateInitialProcessDto } from "./dto/create-initial-process.dto";

@Injectable()
export class InitialProcessRepository {
  constructor (private prisma: PrismaService) {}

  async create(createInitialProcessDto: CreateInitialProcessDto) {
    const grades = [];
    const { period, degree, manager, students, teachers } = createInitialProcessDto;
    const uniqueGrades = [...new Set(students.map(({ numberParallel, parallel}) => `${numberParallel}-${parallel}`))];

    for (const uniqueGrade of uniqueGrades) {
      const [numberParallel, parallel] = uniqueGrade.split('-');
      const studentsFromUniqueGrade = students.filter(student => student.numberParallel === numberParallel && student.parallel === parallel);
      const schedules = teachers.filter(teacher => teacher.numberParallel === numberParallel && teacher.parallel === parallel).map(teacher => {
        return {
          teacher: {
            name: teacher.name,
            lastName: teacher.lastName,
            email: teacher.email,
          },
          subject: {
            name: teacher.subject
          }
        }
      });

      grades.push({
        numberParallel,
        parallel,
        students: studentsFromUniqueGrade,
        schedules
      })
    }

    await this.prisma.$transaction(async (tx) => {
      const createdPeriod = await tx.period.create({
        data: {
          startDate: new Date(period.startDate),
          endDate: new Date(period.endDate)
        }
      });

      const createdManager = await tx.manager.create({
        data: manager
      });

      const createdDegree = await tx.degree.create({
        data: {
          ...degree,
          periodId: createdPeriod.id,
          managerId: createdManager.id
        }
      });

      for await (const grade of grades) {
        const createdGrade = await tx.grade.create({
          data: {
            number: grade.numberParallel,
            parallel: grade.parallel,
            degreeId: createdDegree.id
          }
        });

        for (const student of grade.students) {
          const userAttachedToStudent = await tx.user.findUnique({
            where: {
              email: student.email
            }
          });

          if (userAttachedToStudent) {
            await tx.student.create({
              data: {
                gradeId: createdGrade.id,
                userId: userAttachedToStudent.id
              }
            });
          } else {
            const createdUser = await tx.user.create({
              data: {
                name: student.name,
                lastName: student.lastName,
                email: student.email,
                displayName: `${student.name} ${student.lastName}`,
                password: 'fakePassword'
              }
            });

            await tx.student.create({
              data: {
                gradeId: createdGrade.id,
                userId: createdUser.id
              }
            });
          }      
        }

        for (const schedule of grade.schedules) {
          const { teacher, subject } = schedule;

          const userAttachedToTeacher = await tx.user.findUnique({
            where: {
              email: teacher.email
            }
          });

          let createdTeacher;


          if (userAttachedToTeacher) {
            createdTeacher = await tx.teacher.create({
              data: {
                userId: userAttachedToTeacher.id
              }
            });
          } else {
            const createdUser = await tx.user.create({
              data: {
                name: teacher.name,
                lastName: teacher.lastName,
                email: teacher.email,
                displayName: `${teacher.name} ${teacher.lastName}`,
                password: 'fakePassword'
              }
            });

            createdTeacher = await tx.teacher.create({
              data: {
                userId: createdUser.id
              }
            });
          }

          let subjectInDatabase = await tx.subject.findFirst({
            where: {
              name: {
                equals: subject.name
              },
              schedules: {
                some: {
                  grade: {
                    degree: {
                      period: {
                        id: createdPeriod.id
                      }
                    }
                  }
                }
              }
            }
          });

          if (!subjectInDatabase) {
            subjectInDatabase = await tx.subject.create({
              data: {
                name: subject.name
              }
            })
          }

          await tx.schedule.create({
            data: {
              gradeId: createdGrade.id,
              teacherId: createdTeacher.id,
              subjectId:  subjectInDatabase.id,
              day: 'UNDEFINED',
              startHour: 'UNDEFINED',
              endHour: 'UNDEFINED'
            }
          });
        }
      }
    });
  }

  findAll() {
    return [
      {
        name: 'Fake initial Process'
      }
    ];
  };
}
