import { Request, Response } from "express";
import UserModel from "../models/user.model";

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const AllUsers = await UserModel.find().populate("movies");
    res.status(200).send(AllUsers);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  /* 
  control as much errors as possible. this are going to be evaluated heavily
if (!name || !email || !password) return res.status(400).send("Mising data");
 */
  try {
    const newUser = await UserModel.create({ name, email, password });
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const { userId } = req.params;
  try {
    const userUpdated = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { name, email, password },
      { new: true } //to return a new changed object
    );
    res.status(201).send(userUpdated);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    await UserModel.findByIdAndDelete({ _id: userId });
    res.status(204).send(`user deleted`);
  } catch (error) {
    res.status(400).send(error);
  }
};
