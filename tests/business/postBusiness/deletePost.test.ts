import { PostBusiness } from "../../../src/business/PostBusiness";
import { DeletePostSchema } from "../../../src/dtos/posts/deletePost.dto";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { NotFoundError } from "../../../src/errors/NotFounError";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDataBaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";

describe("Teste deletePost", () => {
  const postBusiness = new PostBusiness(
    new PostDataBaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve deletar post com autenticação do token", async () => {
    const input = DeletePostSchema.parse({
      idToDelete: "id-mock-post2",
      token: "token-mock-normal",
    });
    const output = await postBusiness.deletePost(input);
    expect(output).toEqual({ message: "Post deletado!" });
  });

  test("deve disparar erro token não autorizado", async () => {
    expect.assertions(2);
    try {
      const input = DeletePostSchema.parse({
        idToDelete: "id-mock-post2",
        token: "token-mock",
      });

      const output = await postBusiness.deletePost(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });

  test("deve disparar erro se id do post não existir", async () => {
    expect.assertions(2);
    try {
      const input = DeletePostSchema.parse({
        idToDelete: "id-mock-",
        token: "token-mock-normal",
      });

      const output = await postBusiness.deletePost(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("'id' não encontrado.");
      }
    }
  });

  test("deve disparar erro que semente quem criou ou ADMIN  pode editar post ", async () => {
    expect.assertions(2);
    try {
      const input = DeletePostSchema.parse({
        idToDelete: "id-mock-post2",
        token: "token-mock-normal2",
      });

      await postBusiness.deletePost(input);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe(
          "somente quem criou o Post ou administrador pode deleta-lo"
        );
      }
    }
  });
});
