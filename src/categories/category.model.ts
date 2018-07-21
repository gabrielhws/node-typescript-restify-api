import * as mongoose from "mongoose";
import { Schema } from "mongoose";

export interface Category extends mongoose.Document {
  name: string;
  icon: string;
  position: number;
  created: Date;
}

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  icon: {
    type: String,
    unique: true,
    required: false
  },
  premium: {
    type: Boolean,
    required: true,
    default: true
  },
  position: {
    type: Number,
    required: false
  },
  created: { type: Date, required: true, default: Date.now }
});

export const Category = mongoose.model<Category>("Category", CategorySchema);
