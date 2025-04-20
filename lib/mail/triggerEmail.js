import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendTriggerEmail = async ({
    to,
    subject,
    text,
    html,
}) => {
    const mailOptions = {
        from: `"Legacy Locker" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
};
