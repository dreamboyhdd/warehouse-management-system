import { fork } from "redux-saga/effects";

import watchMainActionSagas from "./MainAction";
import watchSelectSagas from "./SelectSaga";

export default function* rootSaga() {
    yield fork(watchMainActionSagas);
    yield fork(watchSelectSagas);
}
