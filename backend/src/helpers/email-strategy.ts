import sendMail from '../middleware/send-mail';
import { Strategy } from '../interfaces/strategy-interface';

class EmailStrategy implements Strategy {
    // eslint-disable-next-line class-methods-use-this
    async sendNotification(email: string, html: string): Promise<void> {
        sendMail(email, html);
    }
}
export default EmailStrategy;
