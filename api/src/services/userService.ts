import db from '../models';

export const getUserById = async (id: number) => {
  return await db.User.findByPk(id);
};

export const createUser = async (data: any) => {
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
