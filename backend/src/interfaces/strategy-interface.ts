export interface Strategy {
    sendNotification(receiver: string | number, html: string, markup?: any): void;
}
