import { BaseError } from "./BaseErrror";

export class NotFoundError extends BaseError{
    constructor(message: string,){
        
        super(404, message)
    }
}