import { all } from "redux-saga/effects";
import { noteSaga } from "./noteSaga";

export default function* rootSaga() {
  yield all([noteSaga()]);
}
