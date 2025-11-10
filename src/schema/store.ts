import z from "zod";

// 案内開始ボタンを押した時にデータを送信するときのスキーマ
export const storeSchema = z.object({
  name: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type StoreRequest = z.infer<typeof storeSchema>;
