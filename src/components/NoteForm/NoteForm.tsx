import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel: () => void;
}

const TAG_OPTIONS = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Обов'язкове поле")
    .max(50, "Максимум 50 символів"),
  content: Yup.string().max(500, "Максимум 500 символів"),
  tag: Yup.string()
    .required("Обов'язкове поле")
    .oneOf(TAG_OPTIONS, "Некоректний тег"),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
    onError: () => {
      alert("Помилка при створенні нотатки");
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      tag: "Todo",
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          className={css.input}
          {...formik.getFieldProps("title")}
        />
        {formik.touched.title && formik.errors.title ? (
          <ErrorMessage>{formik.errors.title}</ErrorMessage>
        ) : null}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          className={css.select}
          {...formik.getFieldProps("tag")}
        >
          {TAG_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {formik.touched.tag && formik.errors.tag ? (
          <ErrorMessage>{formik.errors.tag}</ErrorMessage>
        ) : null}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          className={css.textarea}
          {...formik.getFieldProps("content")}
        />
        {formik.touched.content && formik.errors.content ? (
          <ErrorMessage>{formik.errors.content}</ErrorMessage>
        ) : null}
      </div>

      <div className={css.actions}>
        <button type="button" onClick={onCancel} className={css.cancelButton}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={mutation.isPending}
          className={css.submitButton}
        >
          {mutation.isPending ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
