import nodemailer from 'nodemailer';

export const sendMail = (eamil : string ,subject : string ,html : string) =>{
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'buicongbang010205@gmail.com',
    to: eamil,
    subject: subject,
    html: html,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

  transport.close(); // close the connection pool
}