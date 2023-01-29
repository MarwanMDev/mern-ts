import { Note as NoteModel } from '../../models/note';
import { formatedDate } from '../../utils/formatedDate';
import './index.css';

interface Props {
  note: NoteModel;
}

const Note = ({ note }: Props) => {
  const { title, text, createdAt, updatedAt } = note;

  let createdUpdatedDate: string;
  if (updatedAt > createdAt) {
    createdUpdatedDate = 'Updated: ' + formatedDate(updatedAt);
  } else {
    createdUpdatedDate = 'Created: ' + formatedDate(createdAt);
  }
  return (
    <div className="card w-96 min-h-16 bg-gradient-to-b from-slate-800 to-base-100 text-white shadow-xl hover:border hover:border-white transition-all duration-100 ease-in cursor-pointer">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="whitespace-pre-line overflow-hidden">{text}</p>
        <div className="card-actions justify-center">
          <p className="text-xs">{createdUpdatedDate}</p>
        </div>
      </div>
    </div>
  );
};

export default Note;
