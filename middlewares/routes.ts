import { coreRouter } from "../src/core/core.router";
import { userRouter } from "../src/users/user.router";
import { reviewRouter } from "../src/reviews/review.router";
import { recipeRouter } from "../src/recipes/recipe.router";
import { categoryRouter } from "../src/categories/category.router";

export const Routes = [
  coreRouter,
  reviewRouter,
  userRouter,
  recipeRouter,
  categoryRouter
];
