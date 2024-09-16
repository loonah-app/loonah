interface IResponseError {
    readonly name: string,
    message: string,
    status: number
}

class BadRequestError implements IResponseError {
    public status: number
    constructor(
        public message: string = "Bad Request",
        public data: object = {},
        readonly name: string = "BadRequestError"
    ) {
        this.status = 400;
    }
}

class UnauthorizedError implements IResponseError {
    public status: number
    constructor(
        public message: string = "Unauthorized",
        public data: object = {},
        readonly name: string = "UnauthorizedError"
    ) {
        this.status = 401;
    }
}

class ValidationError implements IResponseError {
    public status: number
    constructor(
        public message: string = "Input validation failed",
        public data: object = [],
        readonly name: string = "ValidationError"
    ) {
        this.status = 422;
    }
}

class InternalServerError implements IResponseError {
    public status: number
    constructor(
        public message: string = "Internal Server Error",
        public data: object = {},
        readonly name: string = "InternalServerError"
    ) {
        this.status = 500;
    }
}

export function handleResponseError(err: unknown, callback:any) {
    if (
        (err instanceof (BadRequestError)) ||
        (err instanceof (UnauthorizedError)) ||
        (err instanceof (ValidationError)) ||
        (err instanceof (InternalServerError))
    ) {
        return callback({
            title: 'Error',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    } else {
        return callback({
            title: 'Error',
            description: "Unknown error",
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    }
}

export {
    BadRequestError,
    UnauthorizedError,
    ValidationError,
    InternalServerError
}