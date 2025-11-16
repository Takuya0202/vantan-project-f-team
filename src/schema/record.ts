import z from "zod";

export const recordSchema = z.object({
  placeName: z.string(),
  distance: z.number(),
});
