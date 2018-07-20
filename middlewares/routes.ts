import { coreRouter } from "../src/core/core.router";
import { userRouter } from "../src/users/user.router";
import { reviewRouter } from "../src/reviews/review.router";

export const Routes = [coreRouter, reviewRouter, userRouter];
