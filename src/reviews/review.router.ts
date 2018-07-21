import { Model } from "../../middlewares/model";
import * as restify from "restify";
import { Review } from "./review.model";
import * as mongoose from "mongoose";

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

  applyRoutes(app: restify.Server) {
    app.get("/reviews", this.findAll);
    app.post("/reviews", this.create);
    app.get("/reviews/:id", [this.validateId, this.findById]);
    app.del("/reviews/:id", [this.validateId, this.delete]);
  }
}

export const reviewRouter = new ReviewRouter();
