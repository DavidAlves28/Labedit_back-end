
import z from "zod";
import { CommentModel } from "../../models/CommentPosts";

export interface GetCommentInputDTO {
  token: string;
  id_post: string;
}

export type GetCommentOutputDTO  = CommentModel[]


export const GetCommentSchema = z
  .object({
    token: z.string().min(1),
    id_post: z.string().min(1),
  })
  .transform((data) => data as GetCommentInputDTO);