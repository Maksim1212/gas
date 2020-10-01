// eslint-disable-next-line max-classes-per-file
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

import { Strategy } from '../interfaces/strategy-interface';
// import sendMail from './send-mail';
// import bot from './send-telegram';

// eslint-disable-next-line max-classes-per-file
export default class Context {
    private strategy: Strategy;

    constructor(strategy: Strategy) {
        this.strategy = strategy;
    }

    public setStrategy(strategy: Strategy) {
        this.strategy = strategy;
    }

    public async sendNotification(receiver: string | number, html: string, markup?: any): Promise<void> {
        await this.strategy.sendNotification(receiver, html, markup);
    }
}

// class EmailStrategy implements Strategy {
//     async sendNotification(email, threshold): Promise<void> {
//         sendMail(email, threshold);
//     }
// }

// class TelegramStrategy implements Strategy {
//     async sendNotification(chatId, threshold): Promise<void> {
//         bot.telegram.sendMessage(chatId, threshold);
//     }
// }

// const mockUser = {
//     email: 'mr.frost201611@gmail.com',
//     threshold: 1,
// };

// const telegramUserMock = {
//     threshold: 1,
//     chatId: 460102479,
// };

// const context = new Context(new EmailStrategy());
// context.sendNotification(mockUser.email, mockUser.threshold);

// context.setStrategy(new TelegramStrategy());
// context.sendNotification(telegramUserMock.chatId, telegramUserMock.threshold);
