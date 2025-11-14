import z from "zod";

export const recordSchema = z.object({
  placeFrom: z.object({}),
  placeTo: z.object({}),
});
