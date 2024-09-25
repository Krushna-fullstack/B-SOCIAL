import mongoose, { Schema } from "mongoose";

const pgSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    pricePerMonth: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    img: {
      type: String,
    },
    contact: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Pg = mongoose.model("Pg", pgSchema);
