import { Request, Response } from "express";
import UserModel from "../models/user.model";

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const AllUsers = await UserModel.find().populate("movies");
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
    const newUser = await UserModel.create({ name, email, password });
    res.status(201).send(newUser);
  } catch (error: any) {
    res.status(400).send("Error creating user: " + error.message);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const { userId } = req.params;

  if (!name || !email || !password) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const userUpdated = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { name, email, password },
      { new: true } //to return a new changed object
    );

    if (!userUpdated) {
      return res.status(404).send("User not found");
    }

    res.status(201).send(userUpdated);
  } catch (error: any) {
    res.status(400).send("Error updating user: " + error.message);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.status(204).send("User deleted successfully");
  } catch (error: any) {
    res.status(400).send("Error deleting user: " + error.message);
  }
};
