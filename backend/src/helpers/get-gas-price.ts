import fetch from 'node-fetch';
import Decimal from 'decimal.js';

export default async function getGasPrice(): Promise<number> {
    const response = await fetch(process.env.COINGECKO);
    const [json] = await response.json();
    const currentPrice = new Decimal(json.current_price);

    const gwei = currentPrice.div(new Decimal(1000000000));

    const ethgasstationResponse = await fetch(`${process.env.ETHGASSTATION}${process.env.ETHGASAPIKEY}`);
    const gasJson = await ethgasstationResponse.json();
    const average = new Decimal(gasJson.average).div(10);

    const gassCost = Number(gwei.mul(average));
    return gassCost;
}
