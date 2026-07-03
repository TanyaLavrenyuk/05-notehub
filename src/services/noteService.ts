import axios from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";

const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const noteApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number = 1,
  searchQuery: string = "",
): Promise<FetchNotesResponse> => {
  const params: { page: number; perPage: number; search?: string } = {
    page,
    perPage: 12,
  };

  if (searchQuery.trim() !== "") {
    params.search = searchQuery;
  }

  const response = await noteApi.get<FetchNotesResponse>("/notes", { params });
  return response.data;
};

export interface CreateNoteInput {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (noteData: CreateNoteInput): Promise<Note> => {
  const response = await noteApi.post<Note>("/notes", noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await noteApi.delete<Note>(`/notes/${id}`);
  return response.data;
};
