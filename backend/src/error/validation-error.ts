/**
 * @exports
 * @extends Error
 */
class ValidationError extends Error {
    /**
     * @constructor
     * @param {object} message
     */
    value: string;

    param: string;

    status: number;

    constructor(message: string, value?: string, param?: string, status?: number) {
        super();
        this.status = status;
        this.value = value;
        this.param = param;
        this.message = message;
        this.name = 'E_MISSING_OR_INVALID_PARAMS';
    }
}

export default ValidationError;
