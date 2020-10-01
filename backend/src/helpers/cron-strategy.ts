import { Strategy } from '../interfaces/strategy-interface';

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
