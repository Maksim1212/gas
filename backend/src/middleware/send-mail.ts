import * as sgMail from '@sendgrid/mail';

export default async function sendMail(email: string, html: string): Promise<void> {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: 'Sending with SendGrid is Fun',
        text: 'Hello!',
        html,
    };
    sgMail.send(msg);
}
