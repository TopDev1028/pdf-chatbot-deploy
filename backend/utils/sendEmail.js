const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
	try {
		// const transporter = nodemailer.createTransport({
		// 	host: process.env.HOST,
		// 	service: process.env.SERVICE,
		// 	port: Number(process.env.EMAIL_PORT),
		// 	secure: Boolean(process.env.SECURE),
		// 	auth: {
		// 		user: process.env.USER,
		// 		pass: process.env.PASS,
		// 	},
			
		// });
		const transporter = nodemailer.createTransport({
			port: 25, // Postfix uses port 25
			host: 'localhost',
			tls: {
			  rejectUnauthorized: false
			},
		});		  
		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: subject,
			text: text,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};