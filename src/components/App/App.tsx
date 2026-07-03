import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes, deleteNote, createNote } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";

export default function App() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<number | string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, String(search)),
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
    onError: () => {
      alert("Помилка при створенні нотатки");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      alert("Помилка при видаленні нотатки");
    },
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={debouncedSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            onPageChange={(e) => setPage(e.selected + 1)}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data && data.notes.length > 0 && (
        <NoteList
          items={data.notes}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}

      {data && data.notes.length === 0 && !isLoading && (
        <p style={{ textAlign: "center", margin: "20px" }}>
          Нотаток не знайдено.
        </p>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={(values) =>
            createMutation.mutate({ title: values.title, body: values.content })
          }
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
