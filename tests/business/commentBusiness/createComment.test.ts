import { CommentBusiness } from "./../../../src/business/CommentBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDataBaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { CommentsDataBaseMock } from "../../mocks/CommentDatabaseMock";
import { CreateCommentScheme } from "../../../src/dtos/comments/createComment.dto";
import { NotFoundError } from "../../../src/errors/NotFounError";
describe("Testes createComment", () => {
  const commentsBusiness = new CommentBusiness(
    new CommentsDataBaseMock(),
    new PostDataBaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve criar comentario autenticado pelo token", async () => {
    const input = CreateCommentScheme.parse({
      token: "token-mock-normal",
      content: "teste mock comments 3",
      idPost: "id-mock-post2",
    });
    const output = await commentsBusiness.createComment(input);

    expect(output).toEqual({
      message: "Comentário criado com sucesso!",
      comment: {
        id: "id-mock",
        counter: 0,
        content: "teste mock comments 3",
        created_at: expect.any(String),
        likes: 0,
        dislikes: 0,
        creator_name: "Normal-User",
        id_user: "id-mock-normal",
        id_post: "id-mock-post2",
      },
    });
  });

  test("deve disparar erro token nao autorizado", async () => {
    expect.assertions(2);
    try {
      const input = CreateCommentScheme.parse({
        token: "token-mock",
        content: "teste mock post 3",
        idPost: "id-mock-post2",
      });

      await commentsBusiness.createComment(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });
  test('deve retornar erro de id incorreto', async()=>{
    expect.assertions(2);

    try {
        const input = CreateCommentScheme.parse({
            token: "token-mock",
            content: "teste mock post 3",
            idPost: "id-mock-post",
        });       
       
        await commentsBusiness.createComment(input);
      } catch (error) {
        if (error instanceof NotFoundError) {
          expect(error.statusCode).toBe(404);
          expect(error.message).toBe("'id_post' não foi encontrado!");
        }
      }

})
});
