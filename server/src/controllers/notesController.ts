import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import NoteModel from '../models/note';

export const getNotes: RequestHandler = async (_req, res, next) => {
  try {
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const { noteId } = req.params;
  try {
    // Check if the id is valid
    if (!mongoose.isValidObjectId(noteId))
      throw createHttpError(400, 'Invalid note ID.');
    const note = await NoteModel.findById(noteId).exec();
    // Check if note exists
    if (!note) throw createHttpError(404, 'Note not found.');
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

interface CreateNoteBody {
  title?: string;
  text?: string;
}

export const createNote: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody,
  unknown
> = async (req, res, next) => {
  const { title, text } = req.body;
  try {
    if (!title) throw createHttpError(400, 'Note must have a title.');

    const nNote = await NoteModel.create({
      title,
      text,
    });

    res.status(201).json(nNote);
  } catch (error) {
    next(error);
  }
};

interface UpdateNoteParams {
  noteId: string;
}
interface UpdateNoteBody {
  title?: string;
  text?: string;
}

export const updateNote: RequestHandler<
  UpdateNoteParams,
  unknown,
  UpdateNoteBody,
  unknown
> = async (req, res, next) => {
  const { noteId } = req.params;
  const { title, text } = req.body;
  try {
    if (!mongoose.isValidObjectId(noteId))
      throw createHttpError(400, 'Invalid note id.');
    if (!title) throw createHttpError(400, 'Title must be provided.');
    const note = await NoteModel.findById(noteId).exec();

    if (!note) throw createHttpError(404, 'Note not found.');

    note.title = title;
    note.text = text;

    const uNote = await note.save();
    res.status(200).json(uNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const { noteId } = req.params;
  try {
    if (!mongoose.isValidObjectId(noteId))
      throw createHttpError(400, 'Invalid note id.');

    const note = NoteModel.findById(noteId).exec();
    if (!note) throw createHttpError(404, 'Note not found.');

    await NoteModel.findByIdAndDelete(noteId).exec();

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
