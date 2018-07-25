import { Model } from "../../middlewares/model";
import * as restify from "restify";
import { Recipe } from "./recipe.model";
import * as mongoose from "mongoose";
import * as log4js from "log4js";
const log = log4js.getLogger("recipe-router");

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
    log.trace("Enter in Envelope");
    let resource = super.envelope(document);
    resource._links.categories = [];
    resource._links.bookmarks = [];
    const categories = document.categories;
    const bookmarks = document.bookmarks;
    if (document.author) {
      const userId = document.author._id
        ? document.author._id
        : document.author;
      resource._links.author = `/users/${userId}`;
    }
    if (categories.length > 0) {
      categories.forEach(category => {
        let _category = category._id ? category._id : category;
        resource._links.categories.push(`/categories/${_category}`);
      });
    }
    if (bookmarks.length > 0) {
      bookmarks.forEach(bookmark => {
        let _bookmark = bookmark._id ? bookmark._id : bookmark;
        resource._links.bookmarks.push(`/users/${_bookmark}`);
      });
    }

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
