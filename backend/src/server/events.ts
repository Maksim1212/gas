import * as http from 'http';

/**
 * @function
 * @param  {NodeJS.ErrnoException} error
 * @param  {number|string|boolean} port
 * @returns throw error
 */
export function onError(error: NodeJS.ErrnoException, port: number | string): void {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bindPort = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
    switch (error.code) {
        case 'EACCES':
            // eslint-disable-next-line no-console
            console.error(`${bindPort} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            // eslint-disable-next-line no-console
            console.error(`${bindPort} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * @function
 * @inner
 * @description log port to console
 */
export function onListening(): void {
    const bindPort = `port ${process.env.PORT || 3000}`;

    // eslint-disable-next-line no-console
    console.log(`Listening on ${bindPort}`);
}

/**
 * @function
 * @inner
 * @param {http.Server} Server
 * @param {number} port
 */
export function bind(Server: http.Server, port: number): void {
    Server.on('error', (error) => this.onError(error, port));
    Server.on('listening', this.onListening.bind(Server));
}
