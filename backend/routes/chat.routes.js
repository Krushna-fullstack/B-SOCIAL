import express from "express";
const router = express.Router();

router.post("/new", async (req, res) => {
  try {
    const { prompt } = req.body;
    // Your chat logic here
    res.json({
      response: "This is a test response",
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
