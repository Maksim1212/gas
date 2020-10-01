import { Telegraf, Markup } from 'telegraf';

import { createTelegramUser, unsubscribeTelegram } from '../controllers/user-controller';

const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY);

bot.start((ctx) => {
    return ctx.reply(
        'Please enter the threshold value of the gas price',
        Markup.inlineKeyboard([Markup.callbackButton('Unsubscribe', 'Unsubscribe')]).extra(),
    );
});

bot.on('text', (ctx) => {
    if (!Number(ctx.update.message.text)) {
        return ctx.reply('Wrorng threshold type');
    }
    createTelegramUser(ctx.chat.id, Number(ctx.update.message.text));
    return ctx.reply('Threshold updated');
});

bot.action('Unsubscribe', (ctx, next) => {
    unsubscribeTelegram(ctx.chat.id);
    return ctx
        .reply('press to start using bot', Markup.inlineKeyboard([Markup.callbackButton('Start', 'Start')]).extra())
        .then(() => next());
});

bot.action('Start', (ctx, next) => {
    return ctx
        .reply(
            'Please enter the threshold value of the gas price',
            Markup.inlineKeyboard([Markup.callbackButton('Unsubscribe', 'Unsubscribe')]).extra(),
        )
        .then(() => next());
});

bot.use((ctx) => ctx.reply('Please, send me only text message'));

bot.launch();

export default bot;
