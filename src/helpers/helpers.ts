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
}
