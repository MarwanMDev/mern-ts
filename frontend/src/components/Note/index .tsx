import { Note as NoteModel } from '../../models/note';
import { formatedDate } from '../../utils/formatedDate';
import { CiTrash } from 'react-icons/ci';
import './index.css';

interface Props {
  note: NoteModel;
  onNoteClicked: (note: NoteModel) => void;
  onDeleteNoteClicked: (note: NoteModel) => void;
}

const Note = ({
  note,
  onNoteClicked,
  onDeleteNoteClicked,
}: Props) => {
  const { title, text, createdAt, updatedAt } = note;

  let createdUpdatedDate: string;
  if (updatedAt > createdAt) {
    createdUpdatedDate = 'Updated: ' + formatedDate(updatedAt);
  } else {
    createdUpdatedDate = 'Created: ' + formatedDate(createdAt);
  }
  return (
    <div
      className="card w-96 min-h-16 bg-gradient-to-b from-slate-800 to-base-100 text-white shadow-xl
    hover:scale-105 transition-all duration-100 ease-in cursor-pointer"
      onClick={() => onNoteClicked(note)}
    >
      <div className="card-body">
        <div className="flex flex-row justify-between items-center">
          <h2 className="card-title">{title}</h2>
          <CiTrash
            className="text-lg hover:text-red-500"
            onClick={(e) => {
              onDeleteNoteClicked(note);
              e.stopPropagation();
            }}
          />
        </div>
        <p className="whitespace-pre-line overflow-hidden">{text}</p>
        <div className="card-actions justify-center">
          <p className="text-xs">{createdUpdatedDate}</p>
        </div>
      </div>
    </div>
  );
};

export default Note;
