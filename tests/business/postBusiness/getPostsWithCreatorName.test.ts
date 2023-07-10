import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDataBaseMock } from "../../mocks/PostDatabaseMock";
import { PostBusiness } from "../../../src/business/PostBusiness";
import {
  GetPostSchema,
  GetPostsOutputDTO,
} from "../../../src/dtos/posts/getPost.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
describe("teste getPostsWithCreatorName ", () => {
  const postBusiness = new PostBusiness(
    new PostDataBaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );
  test("deve gerar todos os post ", async () => {
    expect.assertions(2);
    const input = GetPostSchema.parse({
      token: "token-mock-normal",
    });
    const output: GetPostsOutputDTO =
      await postBusiness.getPostsWithCreatorName(input);
    expect(output).toHaveLength(2);
    expect(output).toContainEqual({
      id: "id-mock-post1",
      content: "teste mock post",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      likes: 0,
      dislikes: 0,
      creator: {
        id: "id-mock-normal",
        name: "Normal-User",
      },
      total:0
    });
  });

  test("deve diparar erro payload não autorizado", async () => {
    expect.assertions(2);
    try {
      const input = GetPostSchema.parse({
        token: "token-mock",
      });
      const output: GetPostsOutputDTO =
        await postBusiness.getPostsWithCreatorName(input);

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });
});
