import { PostBusiness } from "../../../src/business/PostBusiness";
import { CreatePostSchema } from "../../../src/dtos/posts/createPost.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDataBaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";

import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
describe("Teste createPost", () => {
  const postBusiness = new PostBusiness(
    new PostDataBaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve criar post autenticado pelo token", async () => {
    expect.assertions(1);
    const input = CreatePostSchema.parse({
      token: "token-mock-normal",
      content: "teste mock post 3",
    });
    const output = await postBusiness.createPost(input);

    expect(output).toEqual({
      message: "Post criado com sucesso!",
      post: {
        id: "id-mock",
        content: "teste mock post 3",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        likes: 0,
        dislikes: 0,
        creator: {
          id: "id-mock-normal",
          name: "Normal-User",
        },
        total:0
      },
    });
  });

  test("deve disparar erro token nao autorizado", async () => {
    expect.assertions(2);
    try {
      const input = CreatePostSchema.parse({
        token: "token-mock",
        content: "teste mock post 3",
      });

      await postBusiness.createPost(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });
});
