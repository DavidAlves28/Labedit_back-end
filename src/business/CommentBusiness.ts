import { GetCommentOutputDTO } from "../dtos/comments/getAllComments.dto";
import { CommentsDataBase } from "../database/CommentsDataBase";
import { PostDataBase } from "../database/PostDataBase";
import { GetCommentInputDTO } from "../dtos/comments/getAllComments.dto";
import {
  LikesDislikesInputDTO,
  LikesDislikesOutputDTO,
} from "../dtos/likeDislikes/like-dislikes.dto";

import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFounError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { CommentPosts } from "../models/CommentPosts";

import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import {
  CreateCommentInputDTO,
  CreateCommentOutputDTO,
} from "../dtos/comments/createComment.dto";
import {
  UpdateCommentInputDTO,
  UpdatedCommentOutputDTO,
} from "../dtos/comments/updateComment.dto";
import {
  DeleteCommentInputDTO,
  DeleteCommentOutputDTO,
} from "../dtos/comments/deleteComment.dto";
import {
  COMMENT_LIKE,
  LikeOrDislikeCommentDB,
} from "../models/LikeOrDislikesComments";
import {
  LikesDislikesInputCommentDTO,
  LikesDislikesOutputCommentDTO,
} from "../dtos/likeDislikes/likeDislikesComment.dto";

export class CommentBusiness {
  // Injeção de dependências
  constructor(
    private commentDataBase: CommentsDataBase, // Data Base
    private postDataBase: PostDataBase, // Data Base
    private idGenerator: IdGenerator, // UUID
    private tokenManager: TokenManager // Gerenciador de JWT Token
  ) {}

  // retornar todos os posts
  public getAllCommentByPostId = async (
    input: GetCommentInputDTO
  ): Promise<GetCommentOutputDTO> => {
    // receber dados do Front-end
    const { token, id_post } = input;
    // requer token do usuário logado
    const idPostExists = await this.postDataBase.findPostById(id_post);

    if (!idPostExists) {
      throw new NotFoundError("'id_post' não foi encontrado!");
    }
    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    // verificar se id existe  na DB.
    const commentDB = await this.commentDataBase.getAllCommentByPostID(id_post);
    // estância para novo comment
    const findComments = commentDB.map((comment) => {
      const comments = new CommentPosts(
        comment.id,
        comment.counter,
        comment.content,
        comment.created_at,
        comment.likes,
        comment.dislikes,
        comment.creator_name,
        comment.id_user,
        comment.id_post,
      );
      return comments.toBusinessModel();
    });
    // retorno para Front-end
    const output: GetCommentOutputDTO = findComments;
    return output;
  };

  // Criar Comment
  public createComment = async (
    input: CreateCommentInputDTO
  ): Promise<CreateCommentOutputDTO> => {
    // receber dados do Front-end
    const { token, content, idPost } = input;

    const idPostExists = await this.postDataBase.findPostById(idPost);

    if (!idPostExists) {
      throw new NotFoundError("'id_post' não foi encontrado!");
    }
    // requer token do usuário logado
    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    // gerar id pelo UUID
    const id = this.idGenerator.generate();

    // estância para novo comment

    const newComment = new CommentPosts(
      id,
      0,
      content,
      new Date().toLocaleString(), // createdAt
      0, //likes
      0, //dislikes
      payload.name,
      payload.id,
      idPost,
    );

    // criar post
    const newCommentDB = newComment.toDBModel();
    await this.commentDataBase.insertComment(newCommentDB);

    // Retorno para Fron-end

    const output: CreateCommentOutputDTO = {
      message: "Comentário criado com sucesso!",
      comment: newComment.toBusinessModel(),
    };
    return output;
  };

  // editar Comment
  public updateComment = async (
    input: UpdateCommentInputDTO
  ): Promise<UpdatedCommentOutputDTO> => {
    const { id, token, content } = input;

    // requer token do usuario
    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    // Buscar post na data base
    const commentExist = await this.commentDataBase.findCommentById(id);
    if (!commentExist) {
      throw new NotFoundError("'id' não encontrado.");
    }
    // verificar se quem criou o post é o mesmo do login atraves do id e creator_id
    if (payload.id !== commentExist.id_user) {
      throw new ForbiddenError("somente quem criou o Comentário pode editá-lo");
    }

    //estância novo comment
    const newComment = new CommentPosts(
      commentExist.id,
      commentExist.counter,
      commentExist.content,
      commentExist.created_at,
      commentExist.likes,
      commentExist.dislikes,
      payload.name,
      commentExist.id_user,
      commentExist.id_post,
    );

    // editar conteúdo
    newComment.setContent(content);

    // modelando tipagem
    const updatedNewComment = newComment.toDBModel();

    // enviar dados para DB
    await this.commentDataBase.updateComment(id, updatedNewComment);
    // saída para Front-end
    const output: UpdatedCommentOutputDTO = {
      message: "Post Atualizado com sucesso!",
      comment: newComment.toBusinessModel(),
    };
    return output;
  };

  //delete Comment
  public deleteComment = async (
    input: DeleteCommentInputDTO
  ): Promise<DeleteCommentOutputDTO> => {
    const { id, token } = input;
    // verificar se post existe
    // requer token do usuario
    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    // Buscar post na data base
    const commentExists = await this.commentDataBase.findCommentById(id);
    if (!commentExists) {
      throw new NotFoundError("'id' não encontrado.");
    }

    // O ADMIN também poderá deletar o Comentário
    // verificar se quem criou o Comentário é o mesmo do login atraves do id e creator_id
    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== commentExists.id_user) {
        throw new ForbiddenError(
          "somente quem criou o Comentário ou administrador pode deleta-lo"
        );
      }
    }

    // Enviar para DB
    await this.commentDataBase.deleteComment(id);
    // Retorno para Fron-end
    const output: DeleteCommentOutputDTO = {
      message: "Comentário deletado!",
    };
    return output;
  };

  // endpoint para like e/ou dislike
  public likeDislikeComment = async (
    input: LikesDislikesInputCommentDTO
  ): Promise<LikesDislikesOutputCommentDTO> => {
    const { token, commentId, like } = input;

    // requer token do usuário logado
    const payload = await this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    // Buscar post na data base
    const commentExist = await this.commentDataBase.findCommentById(commentId);

    if (!commentExist) {
      throw new NotFoundError("'id' não encontrado.");
    }
    //estânciar novo post
    const newComment = new CommentPosts(
      commentExist.id,
      commentExist.counter,
      commentExist.content,
      commentExist.created_at,
      commentExist.likes,
      commentExist.dislikes,
      payload.name,
      commentExist.id_user,
      commentExist.id_post,
    );

    // verificar se like é True ou False
    const likeDB = like ? 1 : 0;
    // add valores a tabela de realacimento likes ou dislikes
    const likeDislikeCommentDB: LikeOrDislikeCommentDB = {
      id_user: payload.id,
      id_comment: commentId,
      like: likeDB,
    };

    // verificar se tabela de relaciomento
    const LikeDislikesExists =
      await this.commentDataBase.findLikeDislikeComment(likeDislikeCommentDB);

    // se like estiver checked
    if (LikeDislikesExists === COMMENT_LIKE.LIKED) {
      // caso o like for 1 e ser clicado , então remover  o like.
      // Caso dê um like em um post que já tenha dado like, o like é desfeito. se for o mesmo craidor.
      if (like) {
        await this.commentDataBase.deleteLikeDislikeComment(
          likeDislikeCommentDB
        );
        newComment.removeLike();
      } else {
        // decrementar o like se houver do DB e encrementar um dislike
        await this.commentDataBase.updateLikeDislikeComment(
          likeDislikeCommentDB
        ); // edita o like no DB.
        newComment.removeLike(); //decrementa o like.
        newComment.addDislike(); // encrementa o dislike.
      }
      // Se dislike for checked
    } else if (LikeDislikesExists === COMMENT_LIKE.DISLIKED) {
      // Caso dê um like em um post que tenha dado dislike, o like sobrescreve o dislike.
      if (like === false) {
        //  remove like do DB
        await this.commentDataBase.deleteLikeDislikeComment(
          likeDislikeCommentDB
        );
        newComment.removeDislike(); //decrementa o like.
      }
      // Caso dê um dislike em um post que tenha dado like, o dislike sobrescreve o like
      else {
        await this.commentDataBase.updateLikeDislikeComment(
          likeDislikeCommentDB
        ); // edita o like no DB.
        newComment.removeDislike(); // decrementa o like.
        newComment.addLike(); // encrementa o like.
      }
    }
    // Caso não houver nunhum like ou dislike
    else {
      await this.commentDataBase.insertLikeDislikeComment(likeDislikeCommentDB); // inserir no DB
      // se like for 1 encrementar like
      // se like for 0 encrementar dislike
      like ? newComment.addLike() : newComment.addDislike();
    }

    // tipagem para enviar ao DB
    const updatednewComment = newComment.toDBModel();
    // update Comment
    await this.commentDataBase.updateComment(commentId, updatednewComment);
    // retorno para o Front
    const output: LikesDislikesOutputDTO = undefined;
    return output;
  };
}
