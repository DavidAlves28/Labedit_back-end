import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { GetPostSchema } from "../dtos/posts/getPost.dto";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseErrror";
import { CreatePostSchema } from "../dtos/posts/createPost.dto";
import { UpdaterPostSchema } from "../dtos/posts/update.dto";
import { DeletePostSchema } from "../dtos/posts/deletePost.dto";
import { LikeDislikePSchema } from "../dtos/likeDislikes/like-dislikes.dto";
import { GetCommentSchema } from "../dtos/comments/getAllComments.dto";
import { CommentBusiness } from "../business/CommentBusiness";
import { CreateCommentScheme } from "../dtos/comments/createComment.dto";
import { UpdateCommentScheme } from "../dtos/comments/updateComment.dto";
import { DeleteCommentScheme } from "../dtos/comments/deleteComment.dto";

export class CommentController {
  // Injeção de dependência postBusiness
  constructor(private commentBusiness: CommentBusiness) {}

  // retorna todos os Posts
  public getAllCommentByPostID = async (req: Request, res: Response) => {
    try {
      // receber dados do Front-end
      const input = GetCommentSchema.parse({
        token: req.headers.authorization,
        idPost: req.params.id,
      });

      // enviar para Businnes para verificações
      const output = await this.commentBusiness.getAllCommentByPostID(input);

      // resposta para Front-end
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
  // criar um Comment
  public createComment = async (req: Request, res: Response) => {
    try {
      // receber dados do Front-end
      const input = CreateCommentScheme.parse({
        token: req.headers.authorization,
        content: req.body.content,
        idPost: req.params.id,
      });

      // enviar para Businnes para verificações
      const output = await this.commentBusiness.createComment(input);
      // resposta para Front-end
      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
  // editar post
  public updateComment = async (req: Request, res: Response) => {
    try {
      // receber dados do Front-end
      const input = UpdateCommentScheme.parse({
        idPostToEdit: req.params.id,
        token: req.headers.authorization,
        content: req.body.content,
      });
      // enviar para Businnes para verificações
      const output = await this.commentBusiness.updateComment(input)

      // resposta para Front-end
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  // delete Comment por id
  public deleteComment = async (req: Request, res: Response) => {
    try {
      // receber dados do Front-end
      const input = DeleteCommentScheme.parse({
        token: req.headers.authorization,
        idToDelete: req.params.id,
      });

      // enviar para Business para verificações
      const output = await this.commentBusiness.deleteComment(input)

      // resposta para Front-end
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  // endpoint para Like e/ou Dislikes
  public LikeDislikeComment = async (req: Request, res: Response) => {
    try {
      // receber dados do Front-end
      const input = LikeDislikePSchema.parse({
        postId: req.params.id,
        token: req.headers.authorization,
        like: req.body.like,
      });

      // enviar para Business para verificações
      const output = await this.commentBusiness.likeDislikeComment(input)

      // resposta para Front-end
      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
