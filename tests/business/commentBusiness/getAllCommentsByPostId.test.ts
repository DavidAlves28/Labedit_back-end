import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDataBaseMock } from "../../mocks/PostDatabaseMock";
import { PostBusiness } from "../../../src/business/PostBusiness";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { CommentsDataBaseMock } from "../../mocks/CommentDatabaseMock";
import {
  GetCommentInputDTO,
  GetCommentOutputDTO,
  GetCommentSchema,
} from "../../../src/dtos/comments/getAllComments.dto";
import { NotFoundError } from "../../../src/errors/NotFounError";
describe("testes getAllcommentsByPostId ", () => {
  const commentsBusiness = new CommentBusiness(
    new CommentsDataBaseMock(),
    new PostDataBaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );
  test("deve gerar todos os post ", async () => {
    // expect.assertions(2);
    const input = GetCommentSchema.parse({
      token: "token-mock-normal",
      id_post: "id-mock-post2",
    });
    const output: GetCommentOutputDTO =
      await commentsBusiness.getAllCommentByPostId(input);
   

    expect(output).toHaveLength(1);
    expect(output).toContainEqual(
      {
        id: "id-mock-comment1",
        counter: 0,
        content: "teste mock comment to post ",
        created_at: expect.any(String),
        likes: 123,
        dislikes: 3,
        creator_name: "Normal-User",
        id_user: "id-mock-normal",
        id_post: "id-mock-post2",
      },
    );
  });

    test("deve diparar erro payload não autorizado", async () => {
      expect.assertions(2);
      try {
        const input = GetCommentSchema.parse({
          token: "token-mock",
          id_post: "id-mock-post2",
        });
        const output: GetCommentOutputDTO =
          await commentsBusiness.getAllCommentByPostId(input)

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
            const input = GetCommentSchema.parse({
              token: "token-mock",
              id_post: "id-mock-post",
            });
            const output: GetCommentOutputDTO = 
            await commentsBusiness.getAllCommentByPostId(input)
           
            
          } catch (error) {
            if (error instanceof NotFoundError) {
              expect(error.statusCode).toBe(404);
              expect(error.message).toBe("'id_post' não foi encontrado!");
            }
          }
    
    })
});
