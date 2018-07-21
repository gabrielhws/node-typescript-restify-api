import { Model } from "../../middlewares/model";
import * as restify from "restify";
import { Category } from "./category.model";

class CategoryRouter extends Model<Category> {
  constructor() {
    super(Category);
  }

  applyRoutes(app: restify.Server) {
    app.get("/categories", this.findAll);
    app.post("/categories", this.create);
    app.get("/categories/:id", [this.validateId, this.findById]);
    app.patch("/categories/:id", [this.validateId, this.update]);
    app.put("/categories/:id", [this.validateId, this.replace]);
    app.del("/categories/:id", [this.validateId, this.delete]);
  }
}

export const categoryRouter = new CategoryRouter();
