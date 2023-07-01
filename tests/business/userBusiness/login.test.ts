import { HashManagerMock } from './../../mocks/HashManagerMock';
import { LoginSchema } from '../../../src/dtos/user/login.dto';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import { NotFoundError } from '../../../src/errors/NotFounError';
import { IdGeneratorMock } from '../../mocks/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/TokenManagerMock';
import { UserDatabaseMock } from '../../mocks/UserDatabaseMock';
import { UserBusiness } from './../../../src/business/UserBusiness';
import { ZodError } from "zod";


describe("Testando login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("deve gerar um token ao logar", async () => {
    const input = LoginSchema.parse({
      email: "normal@email.com",
      password: "normal1234",
    });

    const output = await userBusiness.login(input);

    expect(output).toEqual({
      message: "Login realizado com sucesso",
      token: "token-mock-normal",
    });
  });

  // fixação
  test("deve gerar erro email não é string", async () => {
    expect.assertions(2);
    try {
      const input = LoginSchema.parse({
        email: 123,
        password: "normal1234",
      });
    } catch (error) {
      if (error instanceof ZodError) {        
        expect(error.issues[0].message).toBe(
          "Expected string, received number"
        );
        expect(error.issues).toEqual([
          {
            code: "invalid_type",
            expected: "string",
            received: "number",
            path: ["email"],
            message: "Expected string, received number",
          },
        ]);
      }
    }
  });

  test("deve retornar erro email não encontrado", async () => {
    expect.assertions(1);
    try {
      const input = LoginSchema.parse({
        email: "fulanoDeQuem@email.com",
        password: "normal1234",
      });

      await userBusiness.login(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("'email' não encontrado");
      }
    }
  });

  test("deve disparar erro senha incorreta", async () => {
    expect.assertions(1);
    try {
      const input = LoginSchema.parse({
        email: "normal@email.com",
        password: "normal12345",
      });

      await userBusiness.login(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("email' ou 'password' incorretos");
      }
    }
  });
});
