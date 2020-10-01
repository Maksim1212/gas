import { CronJob } from 'cron';
import fetch from 'node-fetch';
import Decimal from 'decimal.js';
import { getRepository, MoreThan } from 'typeorm';
import { Markup } from 'telegraf';

import User from '../models/user';
import sendMail from './send-mail';
import Telegram from '../models/telegram-user';
import bot from './send-telegram';

const job = new CronJob('0 */1 * * * *', () => {
    async function getData(): Promise<void> {
        const response = await fetch(process.env.COINGECKO);
        const [json] = await response.json();
        const currentPrice = new Decimal(json.current_price);

        const gwei = currentPrice.div(new Decimal(1000000000));

        const ethgasstationResponse = await fetch(`${process.env.ETHGASSTATION}${process.env.ETHGASAPIKEY}`);
        const gasJson = await ethgasstationResponse.json();
        const average = new Decimal(gasJson.average).div(10);

        const gassCost = Number(gwei.mul(average));
        const users = await getRepository(User).find({ threshold: MoreThan(gassCost) });
        const telegrams = await getRepository(Telegram).find({ threshold: MoreThan(gassCost) });

        const activedUsers = users.filter((user) => {
            return user.active === true;
        });

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
