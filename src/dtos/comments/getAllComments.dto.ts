
import z from "zod";
import { CommentModel } from "../../models/CommentPosts";

export interface GetCommentInputDTO {
  token: string;
  idPost: string;
}

export type GetCommentOutputDTO  = CommentModel[]


export const GetCommentSchema = z
  .object({
    token: z.string().min(1),
  })
  .transform((data) => data as GetCommentInputDTO);