import z from "zod";

export interface CreateCommentInputDTO {
  token: string;
  content: string;
  idPost: string;
}

// saída do objeto quando criado
export interface CreateCommentOutputDTO {
  message: string;
  comment: {
    id: string;
    content: string;
    created_at: string;
    likes: number;   
  };
}

export const CreateCommentScheme = z
  .object({
    token: z.string().min(1),
    content: z.string().min(1),
    idPost: z.string().min(1),
  })
  .transform((data) => data as CreateCommentInputDTO);