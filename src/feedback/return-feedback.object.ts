import { Prisma } from "@prisma/client";
import { returnUserObject } from "src/user/return-user.object";


export const returnFeedbackObject:Prisma.FeedbackSelect = {
    user: {
        select: returnUserObject
    },
    createdAt: true,
    id: true,
    text: true,
}