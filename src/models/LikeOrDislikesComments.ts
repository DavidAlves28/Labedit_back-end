import { LikesDislikes } from "./LikeOrDislikes";

export interface LikeOrDislikeCommentDB {
  id_user: string;
  id_comment: string;
  like: number | null;
}

export interface LikeOrDislikeComment {
  idUser: string;
  like: number | null;
}

export class LikeDislikeComment extends LikesDislikes {}
export enum COMMENT_LIKE {
  LIKED = "LIKED",
  DISLIKED = "DISLIKED",
}
