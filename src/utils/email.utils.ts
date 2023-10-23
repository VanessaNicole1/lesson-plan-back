import * as nodemailer from 'nodemailer';
import { decryptPassword } from './password.utils';

export const isEmailDomainValid = (
  email: string,
  domain = '@unl.edu.ec',
): boolean => email.includes(domain);

export const getDuplicatedEmails = (emails: string[]) => {
  const uniqueEmails = [];
  const duplicatedEmails = [];

  for (const email of emails) {
    if (uniqueEmails.includes(email)) {
      duplicatedEmails.push(email);
    } else {
      uniqueEmails.push(email);
    }
  }

  return duplicatedEmails;
};

export const getTransporter = ({ host, port, account, password, sender }) => {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  const decryptedPassword = decryptPassword(
    password,
    encryptionKey,
  );

  let transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: {
      user: sender,
      pass: decryptedPassword
    }
  });

  return transporter;
};
