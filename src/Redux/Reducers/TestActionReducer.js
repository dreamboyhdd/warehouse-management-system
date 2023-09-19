import { TestActionType } from '../../Actions/System'

/* save data from api */
const initialState = {
    KQOfficer:''
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case TestActionType.MB_spOfficer_Save_SUCCESS:
            return {
                ...state,
                KQOfficer: action.payload
            }
        default:
            return state;
    }
}
