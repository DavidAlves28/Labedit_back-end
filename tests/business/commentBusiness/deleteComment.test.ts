import { CommentBusiness } from "./../../../src/business/CommentBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDataBaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { CommentsDataBaseMock } from "../../mocks/CommentDatabaseMock";
import { NotFoundError } from "../../../src/errors/NotFounError";
import { UpdateCommentScheme } from "../../../src/dtos/comments/updateComment.dto";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { DeleteCommentScheme } from "../../../src/dtos/comments/deleteComment.dto";
describe("Testes updateComment", () => {
  const commentsBusiness = new CommentBusiness(
    new CommentsDataBaseMock(),
    new PostDataBaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve autualizar  comentario autenticado pelo token", async () => {
    const input = DeleteCommentScheme.parse({
      id: "id-mock-comment1",
      token: "token-mock-normal",
     
    });
    const output = await commentsBusiness.deleteComment(input);

    expect(output).toEqual({
      message: "Comentário deletado!"     
    });
  });

  test("deve disparar erro token nao autorizado", async () => {
    expect.assertions(2);
    try {
      const input = DeleteCommentScheme.parse({
        id: "id-mock-comment1",
        token: "token-mock",       
      });

      await commentsBusiness.deleteComment(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });
  test("deve retornar erro de id incorreto", async () => {
    expect.assertions(2);

    try {
      const input = DeleteCommentScheme.parse({
        id: "difere",
        token: "token-mock-normal",
        content: "teste mock post 3",
      });

      const output = await commentsBusiness.deleteComment(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("'id' não encontrado.");
      }
    }
  });
  
  test('deve disparar erro que semente quem criou id pode edita-lo ',async()=>{
    expect.assertions(2);
    try {
        const input = DeleteCommentScheme.parse({
            id: "id-mock-comment2",
            token: "token-mock-normal2",
            content: "Atualizando post testes",
          });;

      await commentsBusiness.deleteComment(input)
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("somente quem criou o Comentário ou administrador pode deleta-lo");
      }
    }
  })
});
