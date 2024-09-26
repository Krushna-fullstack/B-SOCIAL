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
    img: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Pg = mongoose.model("Pg", pgSchema);
