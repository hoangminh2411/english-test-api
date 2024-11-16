import db from '../models';
import { UserAttributes } from '../models/user';

export default class UserService {
  /**
   * Get a user by ID
   */
  public async getUserById(id: number): Promise<UserAttributes | null> {
    return await db.User.findByPk(id);
  }

  /**
   * Create a new user
   */
  public async createUser(data: Partial<UserAttributes>): Promise<UserAttributes> {
    return await db.User.create(data as any);
  }

  /**
   * Update an existing user by ID
   */
  public async updateUser(id: number, data: Partial<UserAttributes>): Promise<boolean> {
    const [updatedCount] = await db.User.update(data, { where: { id } });
    return updatedCount > 0;
  }

  /**
   * Delete a user by ID
   */
  public async deleteUser(id: number): Promise<boolean> {
    const deletedCount = await db.User.destroy({ where: { id } });
    return deletedCount > 0;
  }

  /**
   * Get all users
   */
  public async getAllUsers(): Promise<UserAttributes[]> {
    return await db.User.findAll();
  }

  /**
   * Find a user by username
   */
  public async findUserByUsername(username: string): Promise<UserAttributes | null> {
    return await db.User.findOne({ where: { username } });
  }
}
