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
      symbols: true,
      lowercase: true,
      uppercase: true,
    });
    return plainPassword;
  }
}
