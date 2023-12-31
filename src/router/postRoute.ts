import express from "express";
import { PostController } from "../controller/PostController";
import { PostBusiness } from "../business/PostBusiness";
import { PostDataBase } from "../database/PostDataBase";
import { IdGenerator } from "../services/IdGenerator";

import { TokenManager } from "../services/TokenManager";
import { CommentController } from "../controller/CommentController";
import { CommentBusiness } from "../business/CommentBusiness";
import { CommentsDataBase } from "../database/CommentsDataBase";

export const postRoute = express.Router();

const postController = new PostController(
  new PostBusiness(new PostDataBase(), new IdGenerator(), new TokenManager())
);

const commentController = new CommentController(
  new CommentBusiness(
    new CommentsDataBase(),
    new PostDataBase(),
    new IdGenerator(),
    new TokenManager()
  )
);

postRoute.get("/", postController.getPostsWithCreatorName);
postRoute.post("/", postController.createPost);

postRoute.get("/:id", postController.getPostsById);

postRoute.get("/:id/comments", commentController.getAllCommentByPostId);

postRoute.post("/:id/comments", commentController.createComment);

postRoute.put("/:id", postController.updatePost);
postRoute.put("/comments/:id", commentController.updateComment);

postRoute.delete("/:id", postController.deletePost);
postRoute.delete("/comments/:id", commentController.deleteComment);
// route para Like e/ou Dislike
postRoute.put("/:id/like", postController.LikeDislikePost);
postRoute.put("/comments/:id/like", commentController.LikeDislikeComment);
