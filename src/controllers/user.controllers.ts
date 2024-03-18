import { Request, Response } from "express";

export const getAllUser = (req: Request, res: Response) => {
  res.send("Get all users");
};

export const createUser = (req: Request, res: Response) => {
  res.send("User created");
};

export const updateUser = (req: Request, res: Response) => {
  res.send("User updated");
};

export const deleteUser = (req: Request, res: Response) => {
  const { userId } = req.params;
  res.send(`User delete, user :${userId}`);
};
