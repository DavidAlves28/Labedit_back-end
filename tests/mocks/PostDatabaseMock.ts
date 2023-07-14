import { LikesDislikesDB, POST_LIKE } from "./../../src/models/LikeOrDislikes";
import { UserDataBase } from "./../../src/database/UserDataBase";
import { BaseDataBase } from "../../src/database/BaseDataBase";
import {
  PostDB,
  PostDBWithCreatorName,
  PostModel,
} from "./../../src/models/Post";

const postsMock  : PostDBWithCreatorName[] = [
  {
    id: "id-mock-post1",
    creator_id: "id-mock-normal",
    content: "teste mock post",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
    creator_name: "Normal-User",
    counter:0
  },
  {
    id: "id-mock-post2",
    creator_id: "id-mock-normal",
    content: "teste mock post id 2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    likes: 2,
    dislikes: 1,
    creator_name: "Normal-User",
    counter:0
  },
];

export class PostDataBaseMock extends BaseDataBase {
  // tabela posts
  private static TABLE_POSTS = "posts";
  private static TABLE_LIKE_DISLIKE = "likes_dislikes";
  //   retornar todos os posts com id e name do criador.
  public getPostsWithCreatorName = async (): Promise<
    PostDBWithCreatorName[]
  > => {
    return postsMock;
  };

  // retornar post pelo id
  public async findPostById(id: string): Promise<PostDB | undefined> {
    return postsMock.filter((post) => post.id === id)[0];
  }

  public async getPostById(id: string): Promise<PostDB> {
    return postsMock.filter((post) => post.id === id)[0];
  }
  // creição de post na database
  public insertPost = async (newPost: PostDB): Promise<PostDB> => {
    return newPost
  };

  // editar um post pelo seu id
  public async updatePost(idToEdit: string, postDB: PostDB):Promise<void> {
    
  }

  // deletar post
  public async deletePost(idToDelete: string) {
    await BaseDataBase.connection(PostDataBaseMock.TABLE_POSTS)
      .delete()
      .where({ id: idToDelete });
  }

  // queries para like e/ou dislikes
  // retornar dados do post com dados do criador pelo id no post
  public findPostWithCreatorId = async (
    id: string
  ): Promise<PostDBWithCreatorName> => {

    return postsMock.filter((post) => post.id === id)[0]
  };

  // encontrar like ou dislike no DB relacionado com user e post criado
  public async findLikeDislike(
    likeDislikeDB: LikesDislikesDB
  ): Promise<POST_LIKE | undefined> {
    const [result] = await BaseDataBase.connection(
      PostDataBaseMock.TABLE_LIKE_DISLIKE
    )
      .select()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return POST_LIKE.LIKED;
    } else {
      return POST_LIKE.DISLIKED;
    }
  }
  // deletar like e/ou dislike
  public async deleteLikeDislike(
    likeDislikeDB: LikesDislikesDB
  ): Promise<void> {
    await BaseDataBase.connection(PostDataBaseMock.TABLE_LIKE_DISLIKE)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  }
  // Editar like e/ou dislike
  public async updateLikeDislike(
    likeDislikeDB: LikesDislikesDB
  ): Promise<void> {
    await BaseDataBase.connection(PostDataBaseMock.TABLE_LIKE_DISLIKE)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  }
  // criar like e/ou dislike
  public async insertLikeDislike(
    likeDislikeDB: LikesDislikesDB
  ): Promise<void> {
    
  }
}
