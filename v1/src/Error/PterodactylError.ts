interface ptE {
    code: string;
    status: number;
    detail: string;
    meta: any;
}

export default class PterodactylError extends Error {
    private code: string = "PterodactylError";
    private source: string;
    private status: number;
    private detail: string;
    private meta: any;

    constructor(q: ptE) {
        super(q.code || "PterodactylError");
        this.code = q.code;
        this.status = q.status;
        this.detail = q.detail;
        this.meta = q.meta;
    }
}