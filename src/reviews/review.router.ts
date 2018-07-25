import { Model } from "../../middlewares/model";
import * as restify from "restify";
import { Review } from "./review.model";
import * as mongoose from "mongoose";
import * as log4js from "log4js";
const log = log4js.getLogger("review-router");

class ReviewRouter extends Model<Review> {
  constructor() {
    super(Review);
  }

  protected prepareOne(
    query: mongoose.DocumentQuery<Review, Review>
  ): mongoose.DocumentQuery<Review, Review> {
    return query
      .populate("author", "displayName username image")
      .populate("recipe", "name");
  }

  protected prepareAll(
    query: mongoose.DocumentQuery<Review[], Review>
  ): mongoose.DocumentQuery<Review[], Review> {
    return query
      .populate("author", "displayName username image")
      .populate("recipe", "name");
  }

  envelope(document) {
    log.trace("Enter in Envelope");
    let resource = super.envelope(document);
    const recipeId = document.recipe._id
      ? document.recipe._id
      : document.recipe;
    const userId = document.author._id ? document.author._id : document.author;
    resource._links.recipe = `/recipes/${recipeId}`;
    resource._links.author = `/users/${userId}`;
    return resource;
  }

  applyRoutes(app: restify.Server) {
    app.get(`${this.basePath}`, this.findAll);
    app.post(`${this.basePath}`, this.create);
    app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
    app.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
  }
}

export const reviewRouter = new ReviewRouter();
