import { Reducer } from "redux";
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

type NoteState = {
  notes: NoteType[];
  error: string | null;
  loading: boolean;
};
const initialState: NoteState = {
  notes: [],
  error: null,
  loading: false,
};

interface FetchNotesAction {
  type: typeof FETCH_NOTES;
}
interface FetchNotesSuccessAction {
  type: typeof FETCH_NOTES_SUCCESS;
  payload: NoteType[];
}
interface FetchNotesFailureAction {
  type: typeof FETCH_NOTES_FAILURE;
  payload: string;
}
interface CreateNoteAction {
  type: typeof CREATE_NOTE;
  payload: NoteType;
}
interface UpdateNoteAction {
  type: typeof UPDATE_NOTE;
  payload: NoteType;
}
interface UpdateNoteFailureAction {
  type: typeof UPDATE_NOTE_FAILURE;
  payload: string;
}
interface DeleteNoteAction {
  type: typeof DELETE_NOTE;
  payload: string | number;
}

type NoteAction =
  | FetchNotesAction
  | FetchNotesSuccessAction
  | FetchNotesFailureAction
  | CreateNoteAction
  | UpdateNoteAction
  | UpdateNoteFailureAction
  | DeleteNoteAction;

export const noteReducer: Reducer<NoteState, NoteAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case FETCH_NOTES:
      return { ...state, error: null, loading: true };
    case FETCH_NOTES_SUCCESS:
      return { ...state, notes: action.payload, loading: false };
    case FETCH_NOTES_FAILURE:
      return { ...state, error: action.payload, loading: false };
    case CREATE_NOTE:
      return { ...state, notes: [...state.notes, action.payload] };
    case UPDATE_NOTE:
      return {
        ...state,
        notes: state.notes.map((note) =>
          note._id === action.payload._id
            ? { ...note, ...action.payload }
            : note
        ),
      };
    case UPDATE_NOTE_FAILURE:
      return { ...state, error: action.payload };
    case DELETE_NOTE:
      return {
        ...state,
        notes: state.notes.filter((note) => note._id !== action.payload),
      };
    default:
      return state;
  }
};
