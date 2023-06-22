import { BaseError } from "./BaseErrror";


export class BadRequestError extends BaseError {
    constructor(
        message: string = "Requisição inválida" // mensagem de erro padrão caso não seja enviado um argumento
    ) {
        super(400, message)
    }
}