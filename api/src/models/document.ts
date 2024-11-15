// models/document.ts
import { DataTypes, Model, Sequelize } from 'sequelize';

// Define the attributes of the Document model
export interface DocumentAttributes {
  id: number; // Primary key
  url: string; // URL of the document
  type: 'IMAGE' | 'AUDIO'; // Type of document
  createdAt?: Date; // Optional field for creation timestamp
  updatedAt?: Date; // Optional field for update timestamp
  questionId?: number;
}

// Extend the Model class to include the DocumentAttributes
export class Document extends Model<DocumentAttributes> implements DocumentAttributes {
  public id!: number; // Primary key
  public url!: string; // URL of the document
  public type!: 'IMAGE' | 'AUDIO'; // Type of document
  public createdAt!: Date; // Timestamp for creation
  public updatedAt!: Date; // Timestamp for updates
  public questionId?: number;
  // Define any associations here if needed
}

// Initialize the Document model
export default (sequelize: Sequelize) => {
  Document.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically increment the ID
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false, // URL is required
      },
      type: {
        type: DataTypes.ENUM('IMAGE', 'AUDIO'), // Allowed types for the document
        allowNull: false, // Type is required
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'question_id',
      }
    },
    {
      sequelize,
      tableName: 'documents', // Name of the table in the database
      timestamps: true, // Automatically manage createdAt and updatedAt fields,
      underscored: true, // Use snake_case for this model
    }
  );

  return Document; // Return the initialized model
};
