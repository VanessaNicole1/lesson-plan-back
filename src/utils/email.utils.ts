import * as nodemailer from 'nodemailer';

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

export const getTransporter = ({ host, port, account, password }) => {
  let transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: {
      user: account,
      pass: password
    }
  });

  return transporter;
};
