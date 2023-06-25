export class LikesDislikes {
    constructor(userId: string, postId: string, like: number) {}
  }
  // type para user no DataBase
  export interface LikesDislikesDB {
    user_id: string;
    post_id: string;
    like: number;
  }
  // enum type para controlar o estado do like ou dislike
  export enum POST_LIKE {
    LIKED = "LIKED",
    DISLIKED = "DISLIKED"
  }