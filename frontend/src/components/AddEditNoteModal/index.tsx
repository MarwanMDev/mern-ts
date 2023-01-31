import React from 'react';
import { useForm } from 'react-hook-form';
import { NoteInput } from '../../network/notes_api';
import * as NoteAPI from '../../network/notes_api';
import { Note } from '../../models/note';

interface AddEditNoteModalProps {
  show?: string;
  noteToEdit?: Note | null;
  onNoteSaved: (note: Note) => void;
}

const AddEditNoteModal = ({
  show,
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
      <input
        type="checkbox"
        id="addEditModal"
        className="modal-toggle"
      />
      <div className={`modal modal-${show} cursor-pointer`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-white">
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
                  value={noteToEdit ? noteToEdit.title : ''}
                  className="input w-full min-w-full text-white"
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
                  className="textarea min-w-full text-white"
                  value={noteToEdit ? noteToEdit.text : ''}
                  placeholder="Text"
                  {...register('text', { required: 'required' })}
                ></textarea>
              </div>
            </form>
          </p>
          <div className="modal-action">
            <label htmlFor="addEditModal" className="btn">
              Cancel
            </label>
            <button
              type="submit"
              form="addEditNoteForm"
              className="btn btn-success"
              disabled={isSubmitting}
            >
              {noteToEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditNoteModal;
