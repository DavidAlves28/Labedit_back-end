import z from "zod";

export interface UpdateCommentInputDTO {
  id: string;
  token: string;
  content: string;
}
export interface UpdatedCommentOutputDTO {
  message: string;
  comment: {
    id: string;
    content: string;
    created_at: string;
    likes: number;   
  };
}

export const UpdateCommentScheme = z
  .object({
    id: z.string().min(1),
    token: z.string().min(1),
    content: z.string().min(1),
  })
  .transform((data) => data as UpdateCommentInputDTO);
