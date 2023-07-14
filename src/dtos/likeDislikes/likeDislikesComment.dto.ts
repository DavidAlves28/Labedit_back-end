import z from "zod";
// tipagem de entrada de dados
export interface LikesDislikesInputCommentDTO {
  commentId:string,
  token: string;
  like: boolean;
}

// tipagem de saída de dados para o Fron-end (sem password)

export type LikesDislikesOutputCommentDTO = undefined;

// verificação de dados para criação de LikesDislikes
export const LikeDislikeCommentPSchema = z
  .object({
    commentId: z.string().min(1),
    token: z.string().min(1),
    like: z.boolean(),
  })
  .transform((data) => data as LikesDislikesInputCommentDTO);
