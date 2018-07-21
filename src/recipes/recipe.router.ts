import { Model } from "../../middlewares/model";
import * as restify from "restify";
import { Recipe } from "./recipe.model";
import * as mongoose from "mongoose";

class RecipeRouter extends Model<Recipe> {
  constructor() {
    super(Recipe);
  }

  protected prepareOne(
    query: mongoose.DocumentQuery<Recipe, Recipe>
  ): mongoose.DocumentQuery<Recipe, Recipe> {
    return query
      .populate("categories", "name")
      .populate("bookmarks", "displayName username image")
      .populate("author", "displayName username image");
  }

  protected prepareAll(
    query: mongoose.DocumentQuery<Recipe[], Recipe>
  ): mongoose.DocumentQuery<Recipe[], Recipe> {
    return query
      .populate("categories", "name")
      .populate("bookmarks", "displayName username image")
      .populate("author", "displayName username image");
  }

  applyRoutes(app: restify.Server) {
    app.get("/recipes", this.findAll);
    app.post("/recipes", this.create);
    app.get("/recipes/:id", [this.validateId, this.findById]);
    app.patch("/recipes/:id", [this.validateId, this.update]);
    app.del("/recipes/:id", [this.validateId, this.delete]);
  }
}

export const recipeRouter = new RecipeRouter();
