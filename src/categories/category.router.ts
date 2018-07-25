import { Model } from "../../middlewares/model";
import * as restify from "restify";
import { Category } from "./category.model";

class CategoryRouter extends Model<Category> {
  constructor() {
    super(Category);
  }

  applyRoutes(app: restify.Server) {
    app.get(`${this.basePath}`, this.findAll);
    app.post(`${this.basePath}`, this.create);
    app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
    app.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
    app.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
    app.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
  }
}

export const categoryRouter = new CategoryRouter();
