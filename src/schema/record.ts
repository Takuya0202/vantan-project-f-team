import z from "zod";

export const recordSchema = z.object({
    placeId : z.number(),
    distance : z.number(),
});
