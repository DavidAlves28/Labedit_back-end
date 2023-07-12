// type do DataBase
export interface CommentDB {
  id: string;
  id_user: string;
  id_post: string;
  content: string;
  created_at: string;
  likes: number;
  dislikes: number;
  creator_name : string
}

export interface CommentDBWithCreatorName {
  id: string;
  id_user: string;
  id_post: string;
  creator_id: string;
  content: string;
  created_at: string;
  likes: number;
  dislikes: number;
  creator_name: string;
}

export interface CommentModel {
  id: string;
  id_user: string;
  id_post: string;
  content: string;
  created_at: string;
  likes: number;
  dislikes: number;
  creator_name: string; 
}
// classe Post
export class CommentPosts {
  constructor(
    private id: string,
    private idUser: string,
    private idPost: string,
    private content: string,
    private createdAt: string,
    private likes: number,
    private dislikes: number,
    private creator_name: string

 
  ) {}

  public getId(): string {
    return this.id;
  }
  public setId(value: string): void {
    this.id = value;
  }
  public getCreatorName(): string {
    return this.creator_name;
  }
  public setCreatorName(value: string): void {
    this.creator_name = value;
  }


  public getDislikes(): number {
    return this.dislikes;
  }
  public setDislikes(value: number) {
    this.dislikes = value;
  }

  // será utilizado no endpoint
  // encrementar dislikes
  public addDislike = (): void => {
    this.dislikes++;
  };
  // decrementar dislikes
  public removeDislike = (): void => {
    this.dislikes--;
  };

  public getLikes(): number {
    return this.likes;
  }
  public setLikes(value: number) {
    this.likes = value;
  }
  // será utilizado no endpoint
  // encrementar dislikes
  public addLike = (): void => {
    this.likes++;
  };
  // decrementar dislikes
  public removeLike = (): void => {
    this.likes--;
  };

  public getContent(): string {
    return this.content;
  }
  public setContent(value: string) {
    this.content = value;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public setCreatedAt(value: string): void {
    this.createdAt = value;
  }

  // para facilitar o retorno, geramos um CommentDB
  public toDBModel(): CommentDB {
    return {
      id: this.id,
      id_user: this.idUser,
      id_post: this.idPost,
      content: this.content,
      created_at: this.createdAt,
      likes: this.likes,
      dislikes: this.dislikes,   
      creator_name : this.creator_name   
    };
  }

  // facilita no retorno ao Front-end
  public toBusinessModel(): CommentModel {
    return {
      id: this.id,
      id_user: this.idUser,
      id_post: this.idPost,
      content: this.content,
      created_at: this.createdAt,
      likes: this.likes,
      dislikes: this.dislikes,
      creator_name : this.creator_name
     
    };
  }
}
