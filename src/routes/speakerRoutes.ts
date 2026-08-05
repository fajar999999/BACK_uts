import { Router } from "express";
import {
  getSpeakers,
  getSpeakerById,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
} from "../controllers/speakerController";

const router = Router();

router.get("/", getSpeakers);
router.get("/:id", getSpeakerById);
router.post("/", createSpeaker);
router.put("/:id", updateSpeaker);
router.delete("/:id", deleteSpeaker);

export default router;
