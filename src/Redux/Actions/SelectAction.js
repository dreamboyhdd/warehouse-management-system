import {SelectTypeAction} from '.';

export function CPN_spArea_UpdateId(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: SelectTypeAction.Area_UpdateId,
            params,
            resolve,
            reject
        })
    })
}

export function CPN_spPostOffice_UpdateId(params, dispatch) {
    debugger
    return new Promise((resolve, reject) => {
        dispatch({
            type: SelectTypeAction.PostOffce_UpdateId,
            params,
            resolve,
            reject
        })
    })
}

export function CPN_spDepartment_UpdateId(params, dispatch) {
    debugger
    return new Promise((resolve, reject) => {
        dispatch({
            type: SelectTypeAction.Department_UpdateId,
            params,
            resolve,
            reject
        })
    })
}

export function CPN_spCity_UpdateId(params, dispatch) {
    debugger
    return new Promise((resolve, reject) => {
        dispatch({
            type: SelectTypeAction.City_UpdateId,
            params,
            resolve,
            reject
        })
    })
}

export function CPN_spDistrict_UpdateId(params, dispatch) {
    debugger
    return new Promise((resolve, reject) => {
        dispatch({
            type: SelectTypeAction.District_UpdateId,
            params,
            resolve,
            reject
        })
    })
}