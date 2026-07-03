import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Обов'язкове поле")
    .max(50, "Максимум 50 символів"),
  content: Yup.string()
    .required("Обов'язкове pole")
    .max(1000, "Максимум 1000 символів"),
  tag: Yup.string().required("Обов'язкове поле"),
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
      tag: "Note",
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
          <div className={css.error}>{formik.errors.title}</div>
        ) : null}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <input
          id="tag"
          type="text"
          className={css.input}
          {...formik.getFieldProps("tag")}
        />
        {formik.touched.tag && formik.errors.tag ? (
          <div className={css.error}>{formik.errors.tag}</div>
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
          <div className={css.error}>{formik.errors.content}</div>
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
