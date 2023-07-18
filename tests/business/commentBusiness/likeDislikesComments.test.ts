import { ZodError } from "zod";

import { LikeDislikePSchema } from "../../../src/dtos/likeDislikes/like-dislikes.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDataBaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFounError";
import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { CommentsDataBaseMock } from "../../mocks/CommentDatabaseMock";
import { LikeDislikeCommentPSchema } from "../../../src/dtos/likeDislikes/likeDislikesComment.dto";
describe("Teste  likeDislikeComment", () => {
  const commentsBusiness = new CommentBusiness(
    new CommentsDataBaseMock(),
    new PostDataBaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );
  const postDataBaseMock = new PostDataBaseMock();

  test("deve gerar like no Comment", async () => {
    const input = LikeDislikeCommentPSchema.parse({
      token: "token-mock-normal",
      like: true,
      commentId: "id-mock-comment1",
    });

    const output = await commentsBusiness.likeDislikeComment(input);
    expect(output).toBeUndefined();
  });

  test("deve gerar erro like, deve ser boolean ", async () => {
    try {
      const input = LikeDislikeCommentPSchema.parse({
        token: "token-mock-normal",
        like: 0,
        commentId: "id-mock-comment1",
      });
      await commentsBusiness.likeDislikeComment(input)
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
      const input = LikeDislikeCommentPSchema.parse({
        token: "token-mock",
        like: false,
        commentId: "id-mock-comment2",
      });
      const output = await commentsBusiness.likeDislikeComment(input);
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
      const input = LikeDislikeCommentPSchema.parse({
        token: "token-mock-normal",
        like: false,
        commentId: "id-mock",
      });
      await commentsBusiness.likeDislikeComment(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("'id' não encontrado.");
      }
    }
  });

  test("deve gerar like no comentário", async () => {
    const input = LikeDislikeCommentPSchema.parse({
      commentId:"id-mock-comment1",
      token: "token-mock-normal",
      like: false,
    });

    await commentsBusiness.likeDislikeComment(input);

    const output = await commentsBusiness.getAllCommentByPostId({
      token: "token-mock-normal",
      id_post: "id-mock-post2",
    });
  });
});
