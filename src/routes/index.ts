import { Router } from "express";
import categoryRoutes from "./categoryRoutes";
import speakerRoutes from "./speakerRoutes";
import eventRoutes from "./eventRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Event Management System API is running",
  });
});

router.use("/categories", categoryRoutes);
router.use("/speakers", speakerRoutes);
router.use("/events", eventRoutes);

export default router;
