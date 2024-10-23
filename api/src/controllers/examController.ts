import { Request, Response } from 'express';
import db from '../models';

// Tạo một kỳ thi mới
export const createExam = async (req: Request, res: Response) => {
  try {
    const exam = await db.Exam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// Lấy tất cả các kỳ thi
export const getAllExams = async (req: Request, res: Response) => {
  try {
    const exams = await db.Exam.findAll();
    res.status(200).json(exams);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// Lấy một kỳ thi theo ID
export const getExamById = async (req: Request, res: Response) => {
  try {
    const exam = await db.Exam.findByPk(req.params.id);
    if (exam) {
      res.status(200).json(exam);
    } else {
      res.status(404).json({ message: 'Exam not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// Cập nhật một kỳ thi
export const updateExam = async (req: Request, res: Response) => {
  try {
    const [updated] = await db.Exam.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedExam = await db.Exam.findByPk(req.params.id);
      res.status(200).json(updatedExam);
    } else {
      res.status(404).json({ message: 'Exam not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// Xóa một kỳ thi
export const deleteExam = async (req: Request, res: Response) => {
  try {
    const deleted = await db.Exam.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Exam not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
