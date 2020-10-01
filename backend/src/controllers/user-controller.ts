import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/user';
import sendMail from '../middleware/send-mail';
import Telegram from '../models/telegram-user';

export async function createTelegramUser(chatId: number, threshold: number): Promise<void> {
    const isUser = await getRepository(Telegram).findOne({
        chatId,
    });

    if (isUser) {
        await getRepository(Telegram).update(isUser.id, { threshold });
    }

    if (!isUser) {
        const user = await getRepository(Telegram).create({ chatId, threshold });
        await getRepository(Telegram).save(user);
        await getRepository(Telegram).findOne({
            chatId,
        });
    }
}

export async function unsubscribeTelegram(chatId: number): Promise<void> {
    await getRepository(Telegram).delete({ chatId });
}

export async function findAll(req: Request, res: Response): Promise<Response> {
    const users = await getRepository(User).find();
    return res.status(200).json(users);
}

export async function createUser(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    const isUser = await getRepository(User).findOne({
        email,
    });
    if (!isUser) {
        const user = await getRepository(User).create(req.body);
        await getRepository(User).save(user);
        const results = await getRepository(User).findOne({
            email,
        });
        const messageHtml = `<h1> Hello! Please confirm the use of the service or press unsubscribe if you do not want to use the service</h1>
        <table width="100%" cellspacing="0" cellpadding="0">
            <tr>
                <td>
                    <table cellspacing="20" cellpadding="6" border-spacing: 7px 11px;>
                        <tr>
                            <td style="border-radius: 2px;" bgcolor="#ED2939">
                                <a href="${process.env.PROTOCOL}${process.env.HOST}:${process.env.PORT}/mail/unsubscribe?uuid=${results.uuid}" target="_blank" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">Unsubscribe</a>
                            </td>
                            <td style="border-radius: 2px;" bgcolor="#3feb3f">
                                <a href="${process.env.PROTOCOL}${process.env.HOST}:${process.env.PORT}/mail/confirm?uuid=${results.uuid}" target="_blank" style="padding: 8px 12px; border: 1px solid #3feb3f;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">Confirm</a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        `;
        sendMail(email, messageHtml);
        return res.status(200).json(results);
    }
    await getRepository(User).update(isUser.id, { threshold: req.body.threshold });
    return res.status(200).json({
        message: 'user data updated',
    });
}

export async function confirmUser(req: Request, res: Response): Promise<Response> {
    const uuid = String(req.query.uuid);
    const isUser = await getRepository(User).findOne({ uuid });

    await getRepository(User).update(isUser.id, { active: true });
    return res.status(200).json({
        message: 'user confirmed successfully',
    });
}

export async function unsubscribe(req: Request, res: Response): Promise<Response> {
    const uuid = String(req.query.uuid);

    await getRepository(User).delete({ uuid });
    return res.status(200).json({
        message: 'user unsubscribe successfully',
    });
}
