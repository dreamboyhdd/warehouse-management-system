import { put, takeLatest, take, cancel, delay, call } from 'redux-saga/effects';
import { api, APIKey, API_END_POINT } from '../../Services';
import { mainTypes,SelectTypeAction } from "../Actions";

export function* CPN_spArea_UpdateId(action) {
    try {

        //params received
        const AreaID = action && action.params
        /// catch api die
        yield delay(300);
        yield put({ type: SelectTypeAction.Area_UpdateId_Success, payload: AreaID });
        
    }
    catch (e) {
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)
    }
}

export function* CPN_spPostOffice_UpdateId(action) {
    try {

        //params received
        const AreaID = action && action.params
        /// catch api die
        yield delay(300);
        yield put({ type: SelectTypeAction.PostOffce_UpdateId_Success, payload: AreaID });
        
    }
    catch (e) {
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)
    }
}

export function* CPN_spDepartment_UpdateId(action) {
    try {

        //params received
        const AreaID = action && action.params
        /// catch api die
        yield delay(300);
        yield put({ type: SelectTypeAction.Department_UpdateId_Success, payload: AreaID });
        
    }
    catch (e) {
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)
    }
}

export function* CPN_spCity_UpdateId(action) {
    try {

        //params received
        const CityId = action && action.params
        /// catch api die
        yield delay(300);
        yield put({ type: SelectTypeAction.City_UpdateId_Success, payload: CityId });
        
    }
    catch (e) {
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)
    }
}


export function* CPN_spDistrict_UpdateId(action) {
    try {

        //params received
        const DistrictId = action && action.params
        /// catch api die
        yield delay(300);
        yield put({ type: SelectTypeAction.District_UpdateId_Success, payload: DistrictId });
        
    }
    catch (e) {
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)
    }
}

export default function* watchSelectSagas() {

    ///Watcher watch Sagas
    yield takeLatest(SelectTypeAction.Area_UpdateId, CPN_spArea_UpdateId)
    yield takeLatest(SelectTypeAction.PostOffce_UpdateId, CPN_spPostOffice_UpdateId)
    yield takeLatest(SelectTypeAction.Department_UpdateId, CPN_spDepartment_UpdateId)
    yield takeLatest(SelectTypeAction.City_UpdateId, CPN_spCity_UpdateId)
    yield takeLatest(SelectTypeAction.District_UpdateId, CPN_spDistrict_UpdateId)
    
    
}