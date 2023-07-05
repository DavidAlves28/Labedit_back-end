import z from "zod";

export interface DeleteCommentInputDTO {
  id: string;
  token: string;
}
export interface DeleteCommentOutputDTO {
  message: string;
}

export const DeleteCommentScheme = z
  .object({
    id: z.string().min(1),
    token: z.string().min(1),
  })
  .transform((data) => data as DeleteCommentInputDTO);
