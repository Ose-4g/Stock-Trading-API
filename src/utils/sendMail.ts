import env from '../env.config';
import nodemailer from 'nodemailer';
import logger from './logger';

const { NODEMAILER_USER, NODEMAILER_PASSWORD, EMAIL_FROM } = env;

const sendMail = async ({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> => {
  try {
    //CREATE TRANSPORTER USING CORRECT CREDENTIALS
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASSWORD,
      },
    });

    //VERIFY THE TRANSPORTER
    await transporter.verify();

    //SEND THE EMAIL

    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (err) {
    logger.error('An error occured while ending email');
  }
};

export default sendMail;
