import { CronJob } from 'cron';
import { Markup } from 'telegraf';

import sendMail from './send-mail';
import bot from './send-telegram';
import { getUsersEmails, getUsersTelegrams } from '../controllers/user-controller'

const job = new CronJob('0 */1 * * * *', () => {
    async function getData(): Promise<void> {
        const activedUsers = await getUsersEmails();
        const telegrams = await getUsersTelegrams();

        telegrams.forEach((chats) => {
            bot.telegram.sendMessage(
                chats.chatId,
                `The gas price has fallen below the threshold you set(${chats.threshold})`,
                Markup.inlineKeyboard([Markup.callbackButton('Unsubscribe', 'Unsubscribe')]).extra(),
            );
        });

        activedUsers.forEach((user) => {
            const html = `<strong>The gas price has fallen below the threshold you set</strong><table width="100%" cellspacing="0" cellpadding="0"><tr><td><table cellspacing="0" cellpadding="0"><tr><td style="border-radius: 2px;" bgcolor="#ED2939"><a href="${process.env.PROTOCOL}${process.env.HOST}:${process.env.PORT}/mail/unsubscribe?uuid=${user.uuid}" target="_blank" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">Unsubscribe</a></td></tr></table></td></tr></table>`;
            sendMail(user.email, html);
        });
    }
    getData();
});

export default job;
