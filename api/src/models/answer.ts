import { DataTypes, Model, Sequelize } from 'sequelize';

// Define the attributes of the Answer model
export interface AnswerAttributes {
  id: number; // Auto-generated ID
  questionId: number; // Foreign key to associate with a question
  content: string; // The content of the answer
  isCorrect?: boolean; // Flag to indicate if the answer is correct
  createdAt?: Date; // Optional field for creation timestamp
  updatedAt?: Date; // Optional field for update timestamp
}


export type CreateAnswerAttributes = Omit<AnswerAttributes, 'id' | 'createdAt' | 'updatedAt'>;

// Extend the Model class to include the AnswerAttributes
export class Answer extends Model<AnswerAttributes> implements AnswerAttributes {
  public id!: number; // Required, auto-incremented
  public questionId!: number;
  public content!: string;
  public isCorrect?: boolean ;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Define associations if needed
}



// Initialize the Answer model
export default (sequelize: Sequelize) => {
  Answer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // This makes the ID auto-generated
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'answers', // Table name in the database
      timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
  );

  return Answer;
};
