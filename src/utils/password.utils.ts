import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

export const encryptPassword = (password, key) => {
  const encrypted = CryptoJS.DES.encrypt(password, key);
  return encrypted.toString();
};

export const decryptPassword = (encryptedPassword, key) => {
  const decryptedBytes = CryptoJS.DES.decrypt(encryptedPassword, key);
  const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedPassword;
};
