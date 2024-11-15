import { DataTypes, Model, Sequelize } from 'sequelize';

// Define the attributes of the User model
export interface UserAttributes {
  id: number; // Auto-generated ID
  username: string; // Username for the user
  password: string; // Hashed password
  isAdmin?: boolean; // Optional field to indicate if the user is an admin
  createdAt?: Date; // Optional field for creation timestamp
  updatedAt?: Date; // Optional field for update timestamp
}

// Extend the Model class to include the UserAttributes
export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number; // Required, auto-incremented
  public username!: string;
  public password!: string;
  public isAdmin?: boolean ;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Define any associations here if needed
}

// Initialize the User model
export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure usernames are unique
      
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false, // Default to false if not specified
        field: 'is_admin',
      },
    },
    {
      sequelize,
      tableName: 'users', // Name of the table in the database
      timestamps: true, // Automatically manage createdAt and updatedAt fields,
      underscored: true, // Use snake_case for this model
    }
  );

  return User;
};
