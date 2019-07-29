const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.migadu.com',
    port: 587,
    auth: {
        user: 'noreply@accounts.apfs.xyz',
        pass: process.env.MIGADU_PASS
    }
});

async function main() {
    let verification = await transporter.verify();
    console.log(verification);

    transporter.sendMail({
        from: 'noreply@accounts.apfs.xyz',
        to: 'kscr25@protonmail.com',
        subject: 'Nodemailer Test',
        text:'This is a test of Nodemailer. It should be sent as a plaintext email.'
    });
}