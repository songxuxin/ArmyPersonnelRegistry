const initState = {
    isLoading: false, data: [], error: null, updateInfo: false
};

const userDetailsReducer = (state = initState, action) => {
    switch(action.type){
        case 'DETAILS_FETCHING':
            return {
                ...state,
                isLoading: true,
            }
        case 'DETAILS_FETCH_SUCCESS':
            return {
                ...state,
                data: action.data,
                isLoading: false,
                error: null
            }
        case 'DETAILS_FETCH_FAIL':
            return {
                ...state,
                error: action.error,
                isLoading: false
            }
        case 'DETAILS_DELETE_FAIL':
            return {
                ...state,
                deletInfo: action.info
            }
        case 'DETAILS_DELETE_SUCCESS':
            return {
                ...state,
                deletInfo: action.info
            }
        case 'POST_SUCCESS':
            return {
                ...state,
                updateInfo: true
            }
        case 'POST_FAIL':
            return {
                ...state,
                updateInfo: false,
                error: action.error
            }
        case 'CHANGE_POST_FLAG':
            return {
                ...state,
                updateInfo: false
            }
        default:
            return state;
    }
}

export default userDetailsReducer;