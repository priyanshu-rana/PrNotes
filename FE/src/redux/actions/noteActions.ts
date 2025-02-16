import { NoteType } from "../../Component/CreateOrUpdateNoteModal";
import {
  CREATE_NOTE,
  DELETE_NOTE,
  FETCH_NOTES,
  FETCH_NOTES_FAILURE,
  FETCH_NOTES_SUCCESS,
  UPDATE_NOTE,
  UPDATE_NOTE_FAILURE,
} from "../constants";

export const fetchNotes = () => ({ type: FETCH_NOTES });
export const fetchNotesSuccess = (notes: NoteType[]) => ({
  type: FETCH_NOTES_SUCCESS,
  payload: notes,
});
//TODO: Scope of refactoring
export const fetchNotesFailure = (error: Error | any) => ({
  type: FETCH_NOTES_FAILURE,
  payload: error,
});
export const createNote = (note: NoteType) => ({
  type: CREATE_NOTE,
  payload: note,
});
export const updateNote = (note: NoteType) => ({
  type: UPDATE_NOTE,
  payload: note,
});
//TODO: Scope of refactoring
export const updateNoteFailure = (error: Error | any) => ({
  type: UPDATE_NOTE_FAILURE,
  payload: error,
});
//TODO: Scope of refactoring
export const deleteNote = (noteId: string | number) => ({
  type: DELETE_NOTE,
  payload: noteId,
});
