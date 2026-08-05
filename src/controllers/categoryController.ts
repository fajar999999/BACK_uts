import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";
import { AppError } from "../middleware/errorHandler";

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError("Invalid category id", 400);
    }

    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new AppError("Name is required", 400);
    }

    const category = await prisma.category.create({
      data: { name: name.trim() },
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError("Invalid category id", 400);
    }

    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new AppError("Name is required", 400);
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Category not found", 404);
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError("Invalid category id", 400);
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Category not found", 404);
    }

    await prisma.category.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
