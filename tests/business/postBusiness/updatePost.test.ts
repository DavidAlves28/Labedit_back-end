import { PostBusiness } from "../../../src/business/PostBusiness";
import { UpdaterPostSchema } from "../../../src/dtos/posts/update.dto";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { NotFoundError } from "../../../src/errors/NotFounError";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDataBaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";

describe("Teste endpoint updatePost", () => {
  const postBusiness = new PostBusiness(
    new PostDataBaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );
  test("deve atualizar post com autenticacao de token", async () => {
    expect.assertions(1);
    const input = UpdaterPostSchema.parse({
      token: "token-mock-normal",
      idPostToEdit: "id-mock-post1",
      content: "Atualizando post testes",
    });
    const output = await postBusiness.updatePost(input);

    expect(output).toEqual({
      message: "Post Atualizado com sucesso!",
      post: {
        id: "id-mock-post1",
        content: "Atualizando post testes",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        likes: 0,
        dislikes: 0,
        creator: { id: "id-mock-normal", name: "Normal-User" },
      },
    });
  });

  test('deve disparar erro de token não autorizado',async()=>{
    expect.assertions(2);
    try {
        const input = UpdaterPostSchema.parse({
            token: "token-mock",
            idPostToEdit: "id-mock-post1",
            content: "Atualizando post testes",
          });;

      await postBusiness.updatePost(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  })

  test('deve disparar erro de id do post não encontrado',async()=>{
    expect.assertions(2);
    try {
        const input = UpdaterPostSchema.parse({
            token: "token-mock-normal",
            idPostToEdit: "id-mock-teste",
            content: "Atualizando post testes",
          });;

      await postBusiness.updatePost(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("'id' não encontrado.");
      }
    }
  })

  test('deve disparar erro que semente quem criou id pode edita-lo ',async()=>{
    expect.assertions(2);
    try {
        const input = UpdaterPostSchema.parse({
            token: "token-mock-admin",
            idPostToEdit: "id-mock-post1",
            content: "Atualizando post testes",
          });;

      await postBusiness.updatePost(input);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("somente quem criou o Post pode editá-lo");
      }
    }
  })
});
