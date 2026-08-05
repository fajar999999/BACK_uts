import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";
import { AppError } from "../middleware/errorHandler";

export const getSpeakers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const speakers = await prisma.speaker.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: speakers });
  } catch (error) {
    next(error);
  }
};

export const getSpeakerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError("Invalid speaker id", 400);
    }

    const speaker = await prisma.speaker.findUnique({ where: { id } });

    if (!speaker) {
      throw new AppError("Speaker not found", 404);
    }

    res.status(200).json({ success: true, data: speaker });
  } catch (error) {
    next(error);
  }
};

export const createSpeaker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, role, image } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new AppError("Name is required", 400);
    }
    if (!role || typeof role !== "string" || role.trim() === "") {
      throw new AppError("Role is required", 400);
    }
    if (!image || typeof image !== "string" || image.trim() === "") {
      throw new AppError("Image is required", 400);
    }

    const speaker = await prisma.speaker.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        image: image.trim(),
      },
    });

    res.status(201).json({ success: true, data: speaker });
  } catch (error) {
    next(error);
  }
};

export const updateSpeaker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError("Invalid speaker id", 400);
    }

    const { name, role, image } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new AppError("Name is required", 400);
    }
    if (!role || typeof role !== "string" || role.trim() === "") {
      throw new AppError("Role is required", 400);
    }
    if (!image || typeof image !== "string" || image.trim() === "") {
      throw new AppError("Image is required", 400);
    }

    const existing = await prisma.speaker.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Speaker not found", 404);
    }

    const speaker = await prisma.speaker.update({
      where: { id },
      data: {
        name: name.trim(),
        role: role.trim(),
        image: image.trim(),
      },
    });

    res.status(200).json({ success: true, data: speaker });
  } catch (error) {
    next(error);
  }
};

export const deleteSpeaker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError("Invalid speaker id", 400);
    }

    const existing = await prisma.speaker.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Speaker not found", 404);
    }

    await prisma.speaker.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Speaker deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
