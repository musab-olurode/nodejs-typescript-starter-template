import { createTransport } from 'nodemailer';
import { obj } from '../interfaces/obj';

const sendEmail = async (options: obj) => {
	const transporter = createTransport({
		host: process.env.SMTP_HOST as string,
		port: process.env.SMTP_PORT as unknown as number,
		secure: false,
		auth: {
			user: process.env.SMTP_EMAIL as string,
			pass: process.env.SMTP_PASSWORD as string,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	const message: any = {
		from: `${
			options.fromName ? options.fromName : process.env.MAIL_FROM_NAME
		} <${options.fromEmail ? options.fromEmail : process.env.MAIL_FROM_EMAIL}>`,
		to: options.email,
		subject: options.subject,
		text: options.message,
		html: options.html ? options.html : null,
	};

	const info = await transporter.sendMail(message);

	console.log('Message sent: %s', info.messageId.blue);
};

export default sendEmail;
