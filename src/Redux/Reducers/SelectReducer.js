import { SelectTypeAction } from '../Actions'

/* save data from api */
const initialState = {
    AreaID : -1,
    PostId : -1,
    DepartId : -1,
    CityId : -1,
    DistrictId : -1
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case SelectTypeAction.Area_UpdateId_Success:
            return {
                ...state,
                AreaID: action.payload
            }
        case SelectTypeAction.PostOffce_UpdateId_Success:
            return {
                ...state,
                PostId: action.payload
            }
        case SelectTypeAction.Department_UpdateId_Success:
            return {
                ...state,
                DepartId: action.payload
            }
        case SelectTypeAction.City_UpdateId_Success:
            return {
                ...state,
                CityId: action.payload
            }
        case SelectTypeAction.District_UpdateId_Success:
            return {
                ...state,
                DistrictId: action.payload
            }
        default:
            return state;
    }
}
