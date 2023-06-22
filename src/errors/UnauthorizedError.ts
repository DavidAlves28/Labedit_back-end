import { BaseError } from "./BaseErrror";

export class UnauthorizedError extends BaseError {
  constructor(message: string = "Token inválido") {
    super(401, message);
  }
}
