import * as mongoose from "mongoose";
import { User } from "../users/user.model";
import { Category } from "../categories/category.model";
import { Schema } from "mongoose";
import * as log4js from "log4js";
const log = log4js.getLogger("recipe-model");

export interface Generic extends mongoose.Document {
  description: number;
  image: string;
  video: string;
  position: number;
  created: Date;
}

export interface Recipe extends mongoose.Document {
  name: string;
  description: string;
  portion: number;
  number: number;
  image: object;
  video: string;
  time: number;
  categories: [mongoose.Schema.Types.ObjectId | Category];
  tag: number;
  ingredients: [Generic];
  directions: [Generic];
  draft: boolean;
  bookmarks: [mongoose.Schema.Types.ObjectId | User];
  author: mongoose.Schema.Types.ObjectId | User;
  created: Date;
}

const GenericSchema = new Schema({
  description: {
    type: String,
    trim: true,
    require: true
  },
  image: {
    type: String,
    require: true
  },
  video: {
    type: String,
    require: true
  },
  position: {
    type: Number,
    required: true
  },
  created: { type: Date, default: Date.now }
});

const RecipeSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  portion: {
    type: Number,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  image: {},
  video: {
    type: String,
    trim: true,
    require: true,
    match: [
      /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
      "Please fill a valid url"
    ]
  },
  time: {
    type: Number,
    required: true
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  ],
  tag: {
    type: Number,
    required: false
  },
  ingredients: {
    type: [GenericSchema],
    required: false
  },
  directions: {
    type: [GenericSchema],
    required: false
  },
  draft: {
    type: Boolean,
    required: true,
    default: true
  },
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false
    }
  ],
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  created: { type: Date, required: true, default: Date.now }
});

RecipeSchema.post("save", function(doc) {
  log.debug("%s has been saved", JSON.stringify(doc));
});

RecipeSchema.post("update", function(doc) {
  log.debug("%s has been updated", JSON.stringify(doc));
});

RecipeSchema.post("remove", function(doc) {
  log.debug("%s has been removed", JSON.stringify(doc));
});

export const Recipe = mongoose.model<Recipe>("Recipe", RecipeSchema);
