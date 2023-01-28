import { generate } from 'generate-password';
import { CreateTeacherSubjectGradeDto } from 'src/modules/teachers/dto/create-teacher-subject-grade-dto';
export class Helpers {
  static generatePassword() {
    const plainPassword = generate({
      length: 10,
      numbers: true,
      lowercase: true,
      uppercase: true,
    });
    return plainPassword;
  }

  static validateCsv(data: any, columns: any) {
    const rows = data.split(/\r?\n/).filter((row) => /\S/.test(row));
    const header = rows[0].replace(/\s+/g, '');
    const currentData = rows.slice(1);
    if (header != columns.join(',')) {
      throw new Error(
        `El archivo CSV es inválido, debe ser de esta manera ${columns.join(
          ',',
        )}`,
      );
    }
    return currentData.map((row) => {
      const newRow = {};
      let items = row.replace(/\s+/g, '');
      items = items.split(',');

      if (items.length < columns.length - 1) {
        throw new Error(
          `Por favor cambiar el formato, cada columna debe contener ${
            columns.length - 1
          } elementos`,
        );
      }

      columns.forEach((name, index) => (newRow[name] = items[index]));
      return newRow;
    });
  }

  static getDuplicateEmails(currentEmails: string[]) {
    const emails = [];
    const duplicateEmails = [];
    for (let i = 0; i < currentEmails.length; i++) {
      const email = currentEmails[i];
      if (emails.includes(email)) {
        duplicateEmails.push(email);
      } else {
        emails.push(email);
      }
    }
    return duplicateEmails.length > 0 ? duplicateEmails.join(', ') : [];
  }

  static getDuplicateNames(currentNames: string[]) {
    const names = [];
    const duplicateNames = [];
    for (let i = 0; i < currentNames.length; i++) {
      const name = currentNames[i];

      if (names.includes(name)) {
        duplicateNames.push(name);
      } else {
        names.push(name);
      }
    }
    return duplicateNames.length > 0 ? duplicateNames : [];
  }

  static getDuplicatedSchedule(teachers: CreateTeacherSubjectGradeDto[]) {
    const schedules = [];
    const duplicatedSchedules = [];
    for (let i = 0; i < teachers.length; i++) {
      const { numberParallel, parallel, subject } = teachers[i];
      const schedule = {
        numberParallel,
        parallel,
        subject,
      };
      if (schedules.includes(JSON.stringify(schedule))) {
        duplicatedSchedules.push(
          `${numberParallel} - ${parallel} - ${subject}`,
        );
      } else {
        schedules.push(JSON.stringify(schedule));
      }
    }
    return duplicatedSchedules.length > 0 ? duplicatedSchedules : [];
  }
}
