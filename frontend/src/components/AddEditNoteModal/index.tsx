import React from 'react';
import { useForm } from 'react-hook-form';
import { NoteInput } from '../../network/notes_api';
import * as NoteAPI from '../../network/notes_api';
import { Note } from '../../models/note';
import { AiOutlinePlus } from 'react-icons/ai';

interface AddEditNoteModalProps {
  noteToEdit?: Note;
  onNoteSaved: (note: Note) => void;
}

const AddEditNoteModal = ({
  noteToEdit,
  onNoteSaved,
}: AddEditNoteModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || '',
      text: noteToEdit?.text || '',
    },
  });

  async function onSubmit(input: NoteInput) {
    try {
      let noteResponse: Note;
      if (noteToEdit) {
        noteResponse = await NoteAPI.updateNote(
          noteToEdit._id,
          input
        );
      } else {
        noteResponse = await NoteAPI.createNote(input);
      }
      onNoteSaved(noteResponse);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <label
        htmlFor="my-modal"
        className="btn btn-success w-48 flex justify-center items-center text-md"
      >
        <AiOutlinePlus /> Add Note
      </label>

      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {noteToEdit ? 'Edit Note' : 'Add Note'}
          </h3>
          <p className="py-4">
            <form
              className="flex flex-col gap-5"
              id="addEditNoteForm"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  className="input w-full min-w-full"
                  {...register('title', { required: true })}
                  autoFocus
                />
                {errors.title && (
                  <div className="mb-3 text-normal text-red-500 ">
                    {errors.title.message}
                  </div>
                )}
              </div>

              <div>
                <textarea
                  className="textarea min-w-full"
                  placeholder="Text"
                  {...register('text', { required: 'required' })}
                ></textarea>
              </div>
            </form>
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn">
              Cancel
            </label>
            <button
              type="submit"
              form="addEditNoteForm"
              className="btn btn-success"
              disabled={isSubmitting}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditNoteModal;
