import { Request, Response } from 'express';
import { getRepository, MoreThan } from 'typeorm';
import fetch from 'node-fetch';
import { CronJob } from 'cron';
import Decimal from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';

import User from '../models/user';
import sendMail from '../middleware/send-mail';

export async function findAll(req: Request, res: Response): Promise<Response> {
    const users = await getRepository(User).find();
    console.log(uuidv4());
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
        console.log('gassCost', gassCost);
        const users = await getRepository(User).find({ threshold: MoreThan(gassCost) });
        const activedUsers = users.filter((user) => {
            return user.active === true;
        });
        console.log('activedUsers :', activedUsers);
        activedUsers.forEach((user) => {
            const html = `<strong>The gas price has fallen below the threshold you set</strong><table width="100%" cellspacing="0" cellpadding="0"><tr><td><table cellspacing="0" cellpadding="0"><tr><td style="border-radius: 2px;" bgcolor="#ED2939"><a href="${process.env.PROTOCOL}${process.env.HOST}:${process.env.PORT}/mail/unsubscribe?uuid=${user.uuid}" target="_blank" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">Unsubscribe</a></td></tr></table></td></tr></table>`;
            sendMail(user.email, html);
        });
    }
    getData();
});

job.start();
