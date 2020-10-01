import bot from '../middleware/send-telegram';
import { Strategy } from '../interfaces/strategy-interface';

class TelegramStrategy implements Strategy {
    // eslint-disable-next-line class-methods-use-this
    async sendNotification(chatId: number, html: string, markup: any): Promise<void> {
        bot.telegram.sendMessage(chatId, html, markup);
    }
}
export default TelegramStrategy;
