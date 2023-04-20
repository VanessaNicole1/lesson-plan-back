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

export const getTransporter = () => {
  const host : any = process.env.EMAIL_HOST; 
  const port : any = process.env.EMAIL_PORT; 
  const authType : any = process.env.AUTH_TYPE;
  const account : any = process.env.EMAIL_ACCOUNT;
  const clientId : any= process.env.EMAIL_CLIENT_ID;
  const clientSecret : any = process.env.EMAIL_CLIENT_SECRET;
  const refreshToken : any = process.env.EMAIL_REFRESH_TOKEN;
  const accessToken : any = process.env.EMAIL_ACCESS_TOKEN;

  let transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: {
      type:  authType,
      user: account,
      clientId,
      clientSecret,
      refreshToken,
      accessToken,
      expires: 1484314697598
    }
  });

  return transporter;
};
