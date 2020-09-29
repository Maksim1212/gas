import { Request, Response } from 'express';
import { getRepository, MoreThan } from 'typeorm';
import fetch from 'node-fetch';
import { CronJob } from 'cron';
import Decimal from 'decimal.js';

import User from '../models/user';
import sendMail from '../middleware/send-mail';

export async function findAll(req: Request, res: Response): Promise<Response> {
    const users = await getRepository(User).find();
    return res.status(200).json(users);
}

export async function createUser(req: Request, res: Response): Promise<Response> {
    const isUser = await getRepository(User).findOne({
        email: req.body.email,
    });
    if (!isUser) {
        const user = await getRepository(User).create(req.body);
        const results = await getRepository(User).save(user);
        return res.status(200).json(results);
    }
    await getRepository(User).update(isUser.id, { threshold: req.body.threshold });
    return res.status(200).json({
        message: 'user data updated',
    });
}

export async function unsubscribe(req: Request, res: Response): Promise<Response> {
    const userEmail = String(req.query.email);
    await getRepository(User).delete({
        email: userEmail,
    });
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

        users.forEach((user) => {
            sendMail(user.email);
            console.log('user', user);
        });
    }
    getData();
});

job.start();
