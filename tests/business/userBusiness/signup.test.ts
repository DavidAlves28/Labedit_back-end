import { SignupOutputDTO } from "../../../src/dtos/user/signup.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { ZodError } from "zod";
import { UserBusiness } from "../../../src/business/UserBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { SignupSchema } from "../../../src/dtos/user/signup.dto";
import { BadRequestError } from "../../../src/errors/BadRequestError";
import { USER_ROLES } from "../../../src/models/User";
import { TokenPayload } from "../../../src/services/TokenManager";

describe("Testando signup", () => {
  // Mock das dependencias
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );
  const tokenManager = new TokenManagerMock();

  //OK
  test("deve gerar um token ao cadastrar", async () => {
    const input = SignupSchema.parse({
      name: "normal",
      email: "normal-teste2@email.com",
      password: "normal1234",
    });

    const output = await userBusiness.signup(input);

    expect(output).toEqual({
      message: "Cadastro realizado com sucesso",
      token: "token-mock",
    });
  });
  //OK
  test("deve disparar erro se o name não possuir pelo menos 3 char", async () => {
    expect.assertions(1);
    try {
      const input = SignupSchema.parse({
        name: "",
        email: "normal@email.com",
        password: "normal1234",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "String must contain at least 3 character(s)"
        );
      }
    }
  });

  test("deve disparar erro caso e-mail já exista", async () => {
    expect.assertions(2);
    try {
      const input = SignupSchema.parse({
        name: "normal",
        email: "normal@email.com",
        password: "normal1234",
      });

      await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("'email' já está sendo usado");
      }
    }
  });
});
