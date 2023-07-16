import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDataBaseMock } from "../../mocks/PostDatabaseMock";
import { PostBusiness } from "../../../src/business/PostBusiness";
import {
  GetPostSchema,
  GetPostsOutputDTO,
} from "../../../src/dtos/posts/getPost.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { GetPostByIdOutputDTO, GetPostByIdSchema } from "../../../src/dtos/posts/getPostById.dto";
describe("teste getPostsWithCreatorName ", () => {
  const postBusiness = new PostBusiness(
    new PostDataBaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );
  test("deve gerar um post ", async () => {
    expect.assertions(2);
    const input = GetPostByIdSchema.parse({
      token: "token-mock-normal",
      idPost:"id-mock-post1"
    });
    const output: GetPostsOutputDTO =
      await postBusiness.getPostsById(input);
    expect(output).toHaveLength(1);
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
      counter:0
    });
  });

  test("deve diparar erro payload não autorizado", async () => {
    expect.assertions(2);
    try {
      const input = GetPostByIdSchema.parse({
        token: "token-mock",
      idPost:"id-mock-post1"
        
    });
      const output: GetPostByIdOutputDTO =
        await postBusiness.getPostsById(input);

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });
});
