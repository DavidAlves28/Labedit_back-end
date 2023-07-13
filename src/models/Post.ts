import { number } from "zod";

// type do DataBase
export interface PostDB {
    id: string;
    content: string;
    created_at: string;
    updated_at: string;
    likes: number;
    dislikes: number;
    creator_id: string;
    creator_name: string;
    counter : number
  }
  // type Post que contém o nome do criador.
  export interface PostDBWithCreatorName {
    id: string;
    creator_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    likes: number;
    dislikes: number;
    creator_name: string;
    counter :number
  }
  
  // é o modelo de Post que o front receberá (createdAt camelCase)
  export interface PostModel {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    likes: number;
    dislikes: number;
    creator: {
      id: string;
      name: string;
    },
    counter :number
  }
  // classe Post 
  export class Posts {
    constructor(
      private id: string,
      private content: string,
      private createdAt: string,
      private updatedAt: string,
      private likes: number,
      private dislikes: number,
      private creatorId: string,
      private creatorName: string,
      private counter : number,
      
    ) {}
  
    public getId(): string {
      return this.id;
    }
    public setId(value: string): void {
      this.id = value;
    }
  
    public getCreatorId(): string {
      return this.creatorId;
    }
  
    public setCreatorId(value: string): void {
      this.creatorId = value;
    }
  
    public getUpdatedAt(): string {
      return this.updatedAt;
    }
    public setUpdatedAt(value: string) {
      this.updatedAt = value;
    }
    public getDislikes(): number {
      return this.dislikes;
    }
    public setDislikes(value: number) {
      this.dislikes = value;
    }
  
    public addCounter = (): void => {     
      this.counter++
    };

    public RemoveCounter = (): void => {     
      this.counter--
    };
    // será utilizado no endpoint
    // encrementar dislikes
    public addDislike = (): void => {
      this.dislikes++;
      this.removeDislike()
    };

    // decrementar dislikes
    public removeDislike = (): void => {
      this.dislikes--;
      this.addCounter()
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
      this.counter++
      
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
    public getCreatorName(): string {
      return this.creatorName;
    }
  
    public setCreatorName(value: string): void {
      this.creatorName = value;
    }
    // para facilitar o retorno, geramos um PostDB
    public toDBModel(): PostDB {
      return {
        id: this.id,
        content: this.content,
        created_at: this.createdAt,
        updated_at: this.updatedAt,
        likes: this.likes,
        dislikes: this.dislikes,
        creator_id: this.creatorId,
        counter: this.counter,
        creator_name : this.creatorName
      };
    }

    // facilita no retorno ao Front-end 
    public toBusinessModel(): PostModel {
      return {
        id: this.id,
        content: this.content,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        likes: this.likes,
        dislikes: this.dislikes,
        creator: {
          id: this.creatorId,
          name: this.creatorName,
        },
        counter: this.counter

      };
    }
  }
  