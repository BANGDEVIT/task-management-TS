"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = (eamil, subject, html) => {
    const transport = nodemailer_1.default.createTransport({
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
        }
        else {
            console.log('Email sent:', info.response);
        }
    });
    transport.close();
};
exports.sendMail = sendMail;
