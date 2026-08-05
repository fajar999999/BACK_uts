import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";
import { AppError } from "../middleware/errorHandler";

const eventInclude = {
  category: true,
  speaker: true,
};

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await prisma.event.findMany({
      include: eventInclude,
      orderBy: { dateEvent: "desc" },
    });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError("Invalid event id", 400);
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: eventInclude,
    });

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, categoryId, speakerId, location, dateEvent, description } =
      req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new AppError("Name is required", 400);
    }

    const parsedCategoryId = Number(categoryId);
    const parsedSpeakerId = Number(speakerId);

    if (Number.isNaN(parsedCategoryId)) {
      throw new AppError("Valid categoryId is required", 400);
    }
    if (Number.isNaN(parsedSpeakerId)) {
      throw new AppError("Valid speakerId is required", 400);
    }
    if (!location || typeof location !== "string" || location.trim() === "") {
      throw new AppError("Location is required", 400);
    }
    if (!dateEvent) {
      throw new AppError("Date is required", 400);
    }
    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      throw new AppError("Description is required", 400);
    }

    const parsedDate = new Date(dateEvent);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new AppError("Invalid date format", 400);
    }

    const category = await prisma.category.findUnique({
      where: { id: parsedCategoryId },
    });
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const speaker = await prisma.speaker.findUnique({
      where: { id: parsedSpeakerId },
    });
    if (!speaker) {
      throw new AppError("Speaker not found", 404);
    }

    const event = await prisma.event.create({
      data: {
        name: name.trim(),
        categoryId: parsedCategoryId,
        speakerId: parsedSpeakerId,
        location: location.trim(),
        dateEvent: parsedDate,
        description: description.trim(),
      },
      include: eventInclude,
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError("Invalid event id", 400);
    }

    const { name, categoryId, speakerId, location, dateEvent, description } =
      req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new AppError("Name is required", 400);
    }

    const parsedCategoryId = Number(categoryId);
    const parsedSpeakerId = Number(speakerId);

    if (Number.isNaN(parsedCategoryId)) {
      throw new AppError("Valid categoryId is required", 400);
    }
    if (Number.isNaN(parsedSpeakerId)) {
      throw new AppError("Valid speakerId is required", 400);
    }
    if (!location || typeof location !== "string" || location.trim() === "") {
      throw new AppError("Location is required", 400);
    }
    if (!dateEvent) {
      throw new AppError("Date is required", 400);
    }
    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      throw new AppError("Description is required", 400);
    }

    const parsedDate = new Date(dateEvent);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new AppError("Invalid date format", 400);
    }

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Event not found", 404);
    }

    const category = await prisma.category.findUnique({
      where: { id: parsedCategoryId },
    });
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const speaker = await prisma.speaker.findUnique({
      where: { id: parsedSpeakerId },
    });
    if (!speaker) {
      throw new AppError("Speaker not found", 404);
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        name: name.trim(),
        categoryId: parsedCategoryId,
        speakerId: parsedSpeakerId,
        location: location.trim(),
        dateEvent: parsedDate,
        description: description.trim(),
      },
      include: eventInclude,
    });

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError("Invalid event id", 400);
    }

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Event not found", 404);
    }

    await prisma.event.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
