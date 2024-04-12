import { Request, Response } from "express";
import prisma from "../db/client";

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const AllUsers = await prisma.user.findMany({
      include: {
        movies: true,
      },
    });
    res.status(200).send(AllUsers);
  } catch (error: any) {
    res.status(400).send("Error retrieving users: " + error.message);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const newUser = await prisma.user.create({
      data: { name, email, password },
    });
    res.status(201).send(newUser);
  } catch (error: any) {
    res.status(400).send("Error creating user: " + error.message);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const userId = parseInt(req.params.userId);

  if (!name || !email || !password) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const userUpdated = await prisma.user.update({
      where: { id: userId },
      data: { name, email, password },
    });

    if (!userUpdated) {
      return res.status(404).send("User not found");
    }

    res.status(201).send(userUpdated);
  } catch (error: any) {
    res.status(400).send("Error updating user: " + error.message);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.status(204).send("User deleted successfully");
  } catch (error: any) {
    res.status(400).send("Error deleting user: " + error.message);
  }
};
