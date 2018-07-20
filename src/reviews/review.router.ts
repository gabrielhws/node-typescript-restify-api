import { Model } from "../../middlewares/model";
import * as restify from "restify";
import { Review } from "./review.model";

class ReviewRouter extends Model<Review> {
  constructor() {
    super(Review);
  }

  applyRoutes(app: restify.Server) {
    app.get("/review", this.findAll);
    app.post("/review", this.create);
    app.get("/review/:id", [this.validateId, this.findById]);
    app.del("/review/:id", [this.validateId, this.delete]);
  }
}

export const reviewRouter = new ReviewRouter();
