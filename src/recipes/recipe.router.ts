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

  envelope(document) {
    let resource = super.envelope(document);
    const userId = document.author._id ? document.author._id : document.author;
    const categories = document.caregories;
    const bookmarks = document.bookmarks;
    categories.forEach(category => {
      let _category = category._id ? category._id : category;
      resource._links.categories.push(_category);
    });
    bookmarks.forEach(bookmark => {
      let _bookmark = bookmark._id ? bookmark._id : bookmark;
      resource._links.bookmarks.push(_bookmark);
    });
    resource._links.author = `/users/${userId}`;

    return resource;
  }

  applyRoutes(app: restify.Server) {
    app.get(`${this.basePath}`, this.findAll);
    app.post(`${this.basePath}`, this.create);
    app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
    app.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
    app.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
  }
}

export const recipeRouter = new RecipeRouter();
