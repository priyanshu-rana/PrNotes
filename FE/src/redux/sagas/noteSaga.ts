import { call, put, takeEvery } from "redux-saga/effects";
import { getNotes, updateNoteAPI } from "../../Service/ApiService";
import { NoteType } from "../../Component/CreateOrUpdateNoteModal";
import {
  fetchNotesFailure,
  fetchNotesSuccess,
  updateNote,
  updateNoteFailure,
} from "../actions/noteActions";
import { FETCH_NOTES, UPDATE_NOTE } from "../constants";
import { toast } from "react-toastify";

function* fetchNotesSaga() {
  try {
    const authToken = localStorage.getItem("login");
    const notes: NoteType[] = yield call(getNotes, authToken);
    yield put(fetchNotesSuccess(notes));
  } catch (error: Error | any) {
    yield put(fetchNotesFailure(error.message));
  }
}

function* updateNoteSaga(action: {
  type: typeof UPDATE_NOTE;
  payload: NoteType;
}) {
  try {
    if (!action.payload._id) return;
    const auth_token = localStorage.getItem("login");
    yield call(updateNoteAPI, action.payload._id, action.payload, auth_token);
    if (action.payload.done) {
      console.log(action.payload);
      toast.success(`Great, you have done: ${action.payload.title}`);
    } else {
      toast.success(`Oops, removed ' ${action.payload.title} ' from done`);
    }
  } catch (error: Error | any) {
    yield put(updateNoteFailure(error.message));
  }
}

export function* noteSaga() {
  yield takeEvery(FETCH_NOTES, fetchNotesSaga);
  yield takeEvery(UPDATE_NOTE, updateNoteSaga);
}
