class ClientError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ClientError';
        this.status = 400;
    }
}

module.exports = ClientError;
