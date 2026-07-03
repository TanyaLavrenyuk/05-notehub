import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  items: Note[];
  onDelete: (id: string) => void;
}

export default function NoteList({ items, onDelete }: NoteListProps) {
  if (items.length === 0) return null;

  return (
    <ul className={css.list}>
      {items.map(({ id, title, body }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{body}</p>
          <div className={css.footer}>
            <span className={css.tag}>Note</span>
            <button
              className={css.button}
              type="button"
              onClick={() => onDelete(id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
