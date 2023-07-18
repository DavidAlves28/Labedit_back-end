import { COMMENT_LIKE, LikeOrDislikeCommentDB } from './../../src/models/LikeOrDislikesComments';
import { BaseDataBase } from "../../src/database/BaseDataBase";
import { CommentDB, CommentDBWithCreatorName, CommentModel, CommentPosts } from "./../../src/models/CommentPosts";

const CommentsMock: CommentDBWithCreatorName[] = [
  {
    id: "id-mock-comment1",
    counter: 0,
    creator_id: "id-mock-normal",
    content: "teste mock comment to post ",
    created_at: new Date().toISOString(),
    likes: 123,
    dislikes: 3,
    creator_name: "Normal-User",
    id_user: "id-mock-normal",
    id_post: "id-mock-post2",
  },
  {
    id: "id-mock-comment2",
    counter: 0,
    creator_id: "id-mock-normal",
    content: "teste mock comment to post  2",
    created_at: new Date().toISOString(),
    likes: 123,
    dislikes: 1,
    creator_name: "Normal-User",
    id_user: "id-mock-normal",
    id_post: "id-mock-post1",
  },
];
export class CommentsDataBaseMock extends BaseDataBase {
  // tabela posts

  public static TABLE_COMMENTS = "comment_post";
  public static TABLE_LIKE_DISLIKE = "likes_dislikes_comments";
  // retornar todos os comentários relacionados com post.
  public getAllCommentByPostID = async (
    id_post: string
  ): Promise<CommentDBWithCreatorName[]> => {
 

    return CommentsMock.filter((c) => c.id_post === id_post);
  };
  public findCommentById = async (id: string): Promise<CommentDB> => {
     return CommentsMock.filter((c) => c.id === id)[0]
  }
  // creição de comment na database
  public insertComment = async (newComment: CommentDB): Promise<CommentDB> => {
    return newComment
  };

  // editar um post pelo seu id
  public async updateComment(idToEdit: string, commentDB: CommentDB) {
    
  }

  // deletar post
  public async deleteComment(idToDelete: string) {
   
  }

  // encontrar like ou dislike no DB relacionado com user e post criado
  public async findLikeDislikeComment(
    likeDislikeCommentsDB: LikeOrDislikeCommentDB
  ): Promise<COMMENT_LIKE | undefined> {
    const [result] = await BaseDataBase.connection(
      CommentsDataBaseMock.TABLE_LIKE_DISLIKE
    )
      .select()
      .where({
        id_user: likeDislikeCommentsDB.id_user,
        id_comment: likeDislikeCommentsDB.id_comment,
      });
    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return COMMENT_LIKE.LIKED;
    } else {
      return COMMENT_LIKE.DISLIKED;
    }
  }
  // deletar like e/ou dislike
  public async deleteLikeDislikeComment(
    likeDislikeCommentsDB: LikeOrDislikeCommentDB
  ): Promise<void> {
    await BaseDataBase.connection(CommentsDataBaseMock.TABLE_LIKE_DISLIKE)
      .delete()
      .where({
        id_user: likeDislikeCommentsDB.id_user,
        id_comment: likeDislikeCommentsDB.id_comment,
      });
  }
  // Editar like e/ou dislike
  public async updateLikeDislikeComment(
    likeDislikeCommentsDB: LikeOrDislikeCommentDB
  ): Promise<void> {
    await BaseDataBase.connection(CommentsDataBaseMock.TABLE_LIKE_DISLIKE)
      .update(likeDislikeCommentsDB)
      .where({
        id_user: likeDislikeCommentsDB.id_user,
        id_comment: likeDislikeCommentsDB.id_comment,
      });
  }
  // criar like e/ou dislike
  public async insertLikeDislikeComment(
    likeDislikeCommentsDB: LikeOrDislikeCommentDB
  ): Promise<void> {
    
  }
}
