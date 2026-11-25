import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { env } from './env.js';

export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface Mailer {
  sendMail(input: SendMailInput): Promise<void>;
}

class AppMailer implements Mailer {
  private readonly transporter: Transporter | null;

  constructor() {
    const hasSmtp = Boolean(env.SMTP_HOST && env.SMTP_HOST !== 'smtp.exemplo.com');
    this.transporter = hasSmtp
      ? nodemailer.createTransport({
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: env.SMTP_PORT === 465,
          auth: env.SMTP_USER
            ? {
                user: env.SMTP_USER,
                pass: env.SMTP_PASS,
              }
            : undefined,
        })
      : null;
  }

  async sendMail(input: SendMailInput): Promise<void> {
    if (!this.transporter) {
      console.info('[Mailer DEV]', {
        from: env.MAIL_FROM,
        to: input.to,
        subject: input.subject,
        text: input.text,
      });
      return;
    }

    await this.transporter.sendMail({
      from: env.MAIL_FROM,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
  }
}

export const mailer: Mailer = new AppMailer();
