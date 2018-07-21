import * as mongoose from "mongoose";
import * as log4js from "log4js";
import { User } from "../users/user.model";
import { Recipe } from "../recipes/recipe.model";
import { Schema } from "mongoose";
const log = log4js.getLogger("review-model");

export interface Review extends mongoose.Document {
  rating: number;
  comments: string;
  author: mongoose.Schema.Types.ObjectId | User;
  recipe: mongoose.Schema.Types.ObjectId | Recipe;
  created: Date;
}

const ReviewSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comments: {
    type: String,
    trim: true,
    required: true,
    maxlength: 500
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
});

/**
 * CRUD
 */

ReviewSchema.post("save", function(doc) {
  log.debug("%s has been saved", JSON.stringify(doc));
});

ReviewSchema.post("update", function(doc) {
  log.debug("%s has been updated", JSON.stringify(doc));
});

ReviewSchema.post("remove", function(doc) {
  log.debug("%s has been removed", JSON.stringify(doc));
});

export const Review = mongoose.model<Review>("Review", ReviewSchema);
