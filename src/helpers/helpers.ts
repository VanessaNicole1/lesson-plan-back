import { HttpException, HttpStatus } from '@nestjs/common';
import { generate } from 'generate-password';
import { extname } from 'path';
export class Helpers {
  static editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    callback(null, `${name}${fileExtName}`);
  };

  static editFileNameTeacher = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    callback(null, `${name}${fileExtName}`);
  };

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

  static duplicatedEmails(results) {
    const emails = [];
    const duplicateEmails = [];
    for (let i = 0; i < results.length; i++) {
      const { name, lastName, email, numberParallel, parallel } = results[i];

      if (
        name === '' ||
        lastName === '' ||
        email === '' ||
        parallel === '' ||
        numberParallel === ''
      ) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'No pueden existir valores vacios en las columnas',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (emails.includes(email)) {
        duplicateEmails.push(email);
      } else {
        emails.push(email);
      }
    }

    if (duplicateEmails.length > 0) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Los siguientes correos están repetidos ${duplicateEmails.join(
            ',',
          )}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  static duplicatedNames(results) {
    const names = [];
    const duplicateNames = [];

    for (let i = 0; i < results.length; i++) {
      const { name } = results[i];

      if (name === '') {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'No pueden existir valores vacios en las columnas',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (names.includes(name)) {
        duplicateNames.push(name);
      } else {
        names.push(name);
      }
    }
    if (duplicateNames.length > 0) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Las siguientes materias están repetidos ${duplicateNames.join(
            ',',
          )}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
