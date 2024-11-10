import db from '../models';
import { UserAttributes } from '../models/user';

export const getUserById = async (id: number) => {
  return await db.User.findByPk(id);
};

export const createUser = async (data: any) => {
  console.log("USER DATA", data)
  return await db.User.create(data);
};

export const updateUser = async (id: number, data: any) => {
  return await db.User.update(data, { where: { id } });
};

export const deleteUser = async (id: number) => {
  return await db.User.destroy({ where: { id } });
};

export const getAllUsers = async () => {
  return await db.User.findAll();
};

// Find user by username
export const findUserByUsername = async (username: string): Promise<UserAttributes | null> => {
  return await db.User.findOne({ where: { username } });
};