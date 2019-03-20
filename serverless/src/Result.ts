export class Result {
    public body: any;
    public status: Status;
    public headers: any;
    private logger = console;

    constructor(status: Status, body: any, headers?: any) {
        this.body = body;
        this.status = status;
        this.headers = headers || {};

        this.headers['Access-Control-Allow-Origin'] = '*';
        this.headers['Access-Control-Allow-Credentials'] = true;
        this.headers['Access-Control-Allow-Headers'] = "Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent"
        this.headers['Cache-control'] = "no-cache";
    }

    asLambdaResult() {
        let result = {
            statusCode: this.status.code,
            headers: this.headers,
            body: JSON.stringify(this.body),
            isBase64Encoded: false
        };

        this.logger.info({ msg: "asLambdaResult", data: result });

        return result;
    }
}

export class Status {
    static OK: Status = new Status(200, "OK");
    static Created = new Status(201, "Created");
    static Found = new Status(302, "Found");
    static BadRequest = new Status(400, "Bad Request");
    static Forbidden = new Status(403, "Forbidden");
    static NotFound = new Status(404, "NotFound");
    static Conflict = new Status(409, "Conflict");
    static InternalServerError = new Status(500, "InternalServerError");
    static NotImplemented = new Status(501, "NotImplemented");

    public code: number;
    public value: String;

    constructor(code: number, value: String) {
        this.code = code;
        this.value = value;
    }

}