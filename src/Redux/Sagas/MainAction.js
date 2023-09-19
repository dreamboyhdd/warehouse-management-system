import { put, takeLatest, take, cancel, delay, takeEvery, debounce } from 'redux-saga/effects';
import { mainTypes } from "../Actions";
import I18n from '../../Language'
import { EN, VN, LANE } from '../../Enum';
import { getData } from '../../Utils/Storage';
import { API_END_POINT, api, APIKey } from "../../Services";

export function* LOADING(action) {
    try {
        delay(300);
        const IsLoading = action && action.params.IsLoading;
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: IsLoading });
    }
    catch (e) {
    }
}


export function* API_spCallServer(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
 
        //params received
        const params = action && action.params
        params.API_key = APIKey;
        let FuncApi = "API_spCallServer";
        /// catch api die
        yield delay(300);
        //Check select data redis
        switch (params.func) {
            case "CPN_spPostOffice_ByAreaId":
                FuncApi = "CPN_spPostOffice_ByAreaId"
                break;

            case "CPN_spDepartment_ByPostId":
                FuncApi = "CPN_spDepartment_ByPostId"
                break;

            // case "CPN_spPayment_Customer_Confirm_Save":
            //     FuncApi = "API_spCallServer_NotOutPut"
            //     break;

            // case "CPN_spPayment_Customer_Save":
            //     FuncApi = "API_spCallServer_NotOutPut"
            //     break;

            case "CPN_spOfficer_ByDepartId":
                FuncApi = "CPN_spOfficer_ByDepartId"
                break;

            case "CPN_spLocation_GET":
                FuncApi = "CPN_spLocation_GET"
                break;

            case "CPN_spCustomer_ByPostId":
                FuncApi = "CPN_spCustomer_ByPostId"
                break;

            case "CPN_spVehicle_ByPostId":
                FuncApi = "CPN_spVehicle_ByPostId"
                break;
            default:
                break;
        }
        //End check select data redis
        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + FuncApi, params)
        // check call api success
        if (respone && respone.status == 200) {
            respone.data === "" ? action.resolve([]) : action.resolve(JSON.parse(respone.data));
            //console.log(respone.data, "biwbdjwvdugwvdgy");
        }
        else {
            // api call fail
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });

        }
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}

export function* API_spCallServerNoLoading(action) {
    try {
        debugger
        //show loading
        //yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
 
        //params received
        const params = action && action.params
        params.API_key = APIKey;
        let FuncApi = "API_spCallServer";
        /// catch api die
        yield delay(300);
        //End check select data redis

        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + FuncApi, params);
        // check call api success
        if (respone && respone.status == 200) {
            respone.data === "" ? action.resolve([]) : action.resolve(JSON.parse(respone.data))
        }
        else {
            // api call fail
            action.reject(respone)
           // yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });

        }
        //yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
       // yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}

export function* API_CPN_spBusinessRevenueforCustomer(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
 
        //params received
        const params = action && action.params
        params.API_key = APIKey;
        let FuncApi = "CPN_spBusinessRevenueforCustomer";
        /// catch api die
        yield delay(300);
        //End check select data redis

        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + FuncApi, params);
        debugger
        // check call api success
        if (respone && respone.status == 200) {
            respone.data === "" ? action.resolve([]) : action.resolve(JSON.parse(respone.data))
        }
        else {
            // api call fail
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });

        }
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}

export function* changeLanguage(action) {
    try {
        const language = action.params.language;
        const Type = action.params.Type;
        let newLanguage = language == VN ? EN : VN;
        delay(300);
        yield put({ type: mainTypes.CHANGE_LANGUAGE_SUCCESS, payload: newLanguage })

        I18n.locale = newLanguage
        action.resolve(newLanguage)
    }
    catch (e) {
        action.reject(e)
    }
}

export function* checkLanguage(action) {
    try {
        const language = yield getData(LANE)
        const newLanguage = language !== null && language !== '' && JSON.parse(language) === 'en' ? JSON.parse(language) : 'vn'
        yield put({ type: mainTypes.CHECK_LANGUAGE_SUCCESS, payload: newLanguage })
        I18n.locale = newLanguage
    }
    catch (e) {
    }
}


export function* EncryptString(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });

        //params received
        const params = action && action.params
        params.API_key = APIKey;
        let FuncApi = "EncryptString";
        /// catch api die
        yield delay(300);


        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + FuncApi, params)

        // check call api success
        if (respone && respone.status === 200) {
            respone.data === "" ? action.resolve('') : action.resolve(respone.data)
        }
        else {
            // api call fail
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });

        }
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}
export function* DecryptString(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });

        //params received
        const params = action && action.params
        params.API_key = APIKey;
        let FuncApi = "DecryptString";
        /// catch api die
        yield delay(300);


        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + FuncApi, params)

        // check call api success
        if (respone && respone.status === 200) {
            respone.data === "" ? action.resolve('') : action.resolve(respone.data)
        }
        else {
            // api call fail
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });

        }
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}
export function* VeryfiSMS(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });

        //params received
        const params = action && action.params
        params.API_key = APIKey;
        let FuncApi = "VeryfiSMS";
        /// catch api die
        yield delay(300);


        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + FuncApi, params)

        // check call api success
        if (respone && respone.status === 200) {
            respone.data === "" ? action.resolve('') : action.resolve(respone.data)
        }
        else {
            // api call fail
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });

        }
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}

export function* API_spCallPostImage(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });

        //params received
        const params = action && action.params
        params.API_key = APIKey;
        let FuncApi = "API_spCallPostImage";
        /// catch api die
        yield delay(300);


        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + FuncApi, params)

        // check call api success

        respone.data === "" ? action.resolve([]) : action.resolve(respone.data)

        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}
export default function* watchMainActionSagas() {
    ///Watcher watch Sagas
    yield takeLatest(mainTypes.LOADING, LOADING);
    yield takeLatest(mainTypes.CHANGE_LANGUAGE, changeLanguage)
    yield takeLatest(mainTypes.CHECK_LANGUAGE, checkLanguage)
    yield takeEvery(mainTypes.CallServer, API_spCallServer)
    yield takeEvery(mainTypes.CallServerNoLoading, API_spCallServerNoLoading)
    yield takeEvery(mainTypes.CallPostImage, API_spCallPostImage)
    yield takeLatest(mainTypes.EncryptString, EncryptString);
    yield takeLatest(mainTypes.DecryptString, DecryptString);
    yield takeLatest(mainTypes.VeryfiSMS, VeryfiSMS);
    yield takeLatest(mainTypes.BusinessRevenueforCustomer, API_CPN_spBusinessRevenueforCustomer);
   
    
}