import {
  UpdatePostInputDTO,
  UpdaterPostSchema,
} from "./../../../src/dtos/posts/update.dto";
import { ZodError } from "zod";
import { PostBusiness } from "../../../src/business/PostBusiness";
import {
  LikeDislikePSchema,
  LikesDislikesOutputDTO,
} from "../../../src/dtos/likeDislikes/like-dislikes.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDataBaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFounError";
import { PostDataBase } from "../../../src/database/PostDataBase";
import { LikesDislikesDB, POST_LIKE } from "../../../src/models/LikeOrDislikes";
import { GetPostSchema } from "../../../src/dtos/posts/getPost.dto";
import { PostDB, Posts } from "../../../src/models/Post";

describe("Teste  likeDislikePost", () => {
  const postBusiness = new PostBusiness(
    new PostDataBaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );
  const postDataBaseMock = new PostDataBaseMock();

  test("deve gerar like no post", async () => {
    const input = LikeDislikePSchema.parse({
      token: "token-mock-normal",
      like: true,
      postId: "id-mock-post2",
    });

    const output = await postBusiness.likeDislikePost(input);
    expect(output).toBeUndefined();
  });

  test("deve gerar erro like, deve ser boolean ", async () => {
    try {
      const input = LikeDislikePSchema.parse({
        token: "token-mock-normal",
        like: 0,
        postId: "id-mock-post2",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "Expected boolean, received number"
        );
        expect(error.issues).toEqual([
          {
            code: "invalid_type",
            expected: "boolean",
            received: "number",
            path: ["like"],
            message: "Expected boolean, received number",
          },
        ]);
      }
    }
  });

  test("deve diparar erro payload não autorizado", async () => {
    expect.assertions(2);
    try {
      const input = LikeDislikePSchema.parse({
        token: "token-mock",
        like: false,
        postId: "id-mock-post2",
      });
      const output = await postBusiness.likeDislikePost(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });
  test("deve disparar erro de id não encontrado", async () => {
    expect.assertions(2);
    try {
      const input = LikeDislikePSchema.parse({
        token: "token-mock-normal",
        like: false,
        postId: "id-mock",
      });
      await postBusiness.likeDislikePost(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("'id' não encontrado.");
      }
    }
  });

  test("deve gerar like no post", async () => {
    const input = LikeDislikePSchema.parse({
      token: "token-mock-normal",
      like: true,
      postId: "id-mock-post2",
    });

    await postBusiness.likeDislikePost(input);
    
    const output = await postBusiness.getPostsWithCreatorName(input);
    console.log(output);
  });
});
