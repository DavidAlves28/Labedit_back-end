import {
  COMMENT_LIKE,
  LikeOrDislikeCommentDB,
} from "../models/LikeOrDislikesComments";
import { CommentDB } from "../models/CommentPosts";

import { BaseDataBase } from "./BaseDataBase";
import { PostDataBase } from "./PostDataBase";

export class CommentsDataBase extends BaseDataBase {
  // tabela posts

  public static TABLE_COMMENTS = "comment_post";
  public static TABLE_LIKE_DISLIKE = "likes_dislikes_comments";
  // retornar todos os comentários relacionados com post.
  public getAllCommentByPostID = async (
    id_post: string
  ): Promise<CommentDB[]> => {
    const result = await BaseDataBase.connection(
      CommentsDataBase.TABLE_COMMENTS
    )
      .select(
        `${CommentsDataBase.TABLE_COMMENTS}.id  `,
        `${CommentsDataBase.TABLE_COMMENTS}.content`,
        `${CommentsDataBase.TABLE_COMMENTS}.created_at`,
        `${CommentsDataBase.TABLE_COMMENTS}.likes`,
        `${CommentsDataBase.TABLE_COMMENTS}.dislikes`,
        `${CommentsDataBase.TABLE_COMMENTS}.creator_name`,
        `${PostDataBase.TABLE_POSTS}.id AS postId`
      )
      .join(
        `${PostDataBase.TABLE_POSTS}`,
        `${PostDataBase.TABLE_POSTS}.id`,
        "=",
        `${CommentsDataBase.TABLE_COMMENTS}.${id_post}`
      );

    return result;
  };
  public findCommentById = async (id: string): Promise<CommentDB> => {
    const [result] = await BaseDataBase.connection(
      CommentsDataBase.TABLE_COMMENTS
    ).where({ id });

    return result;
  };
  // creição de comment na database
  public insertComment = async (newComment: CommentDB): Promise<CommentDB> => {
    return await BaseDataBase.connection(
      CommentsDataBase.TABLE_COMMENTS
    ).insert(newComment);
  };

  // editar um post pelo seu id
  public async updateComment(idToEdit: string, commentDB: CommentDB) {
    await BaseDataBase.connection(CommentsDataBase.TABLE_COMMENTS)
      .update(commentDB)
      .where({ id: idToEdit });
  }

  // deletar post
  public async deleteComment(idToDelete: string) {
    await BaseDataBase.connection(CommentsDataBase.TABLE_COMMENTS)
      .delete()
      .where({ id: idToDelete });
  }

  // encontrar like ou dislike no DB relacionado com user e post criado
  public async findLikeDislikeComment(
    likeDislikeCommentsDB: LikeOrDislikeCommentDB
  ): Promise<COMMENT_LIKE | undefined> {
    const [result] = await BaseDataBase.connection(
      CommentsDataBase.TABLE_LIKE_DISLIKE
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
    await BaseDataBase.connection(CommentsDataBase.TABLE_LIKE_DISLIKE)
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
    await BaseDataBase.connection(CommentsDataBase.TABLE_LIKE_DISLIKE)
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
    await BaseDataBase.connection(CommentsDataBase.TABLE_LIKE_DISLIKE).insert(
      likeDislikeCommentsDB
    );
  }
}
