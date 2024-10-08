import asyncHandler from "../middlewares/asyncHandler.js";
import { Pg } from "./../models/pg.model.js";
import { v2 as clodinary } from "cloudinary";

export const createPg = asyncHandler(async (req, res) => {
  try {
    const { name, location, description, pricePerMonth, contact } = req.body;
    let { img } = req.body;

    if (
      !name ||
      !location ||
      !description ||
      !pricePerMonth ||
      !contact ||
      !img
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (img) {
      const uploadedResponse = await clodinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPg = new Pg({
      name,
      location,
      description,
      pricePerMonth,
      contact,
      img,
    });

    await newPg.save();

    res.status(201).json(newPg);
  } catch (error) {
    console.log("Error in createPg controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export const getAllPgs = asyncHandler(async (req, res) => {
  try {
    const pgs = await Pg.find().sort({ createdAt: -1 });

    if (pgs.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(pgs);
  } catch (error) {
    console.log("Error in getAllPgs controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export const deletePg = asyncHandler(async (req, res) => {
  try {
    const pg = await Pg.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({ error: "Pg not found" });
    }

    await Pg.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Pg deleted successfully" });
  } catch (error) {
    console.log("Error in deletePg controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
