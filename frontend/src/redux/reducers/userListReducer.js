const initState = { isLoading: false, data: [], error: null, deletInfo: null };

const userListReducer = (state = initState, action) => {
    switch(action.type){
        case 'FETCHING':
            return {
                ...state,
                isLoading: true,
            }
        case 'FETCH_SUCCESS':
            return {
                ...state,
                data: action.data,
                isLoading: false,
                error: null
            }
        case 'FETCH_FAIL':
            return {
                ...state,
                error: action.error,
                isLoading: false
            }
        case 'DELETE_FAIL':
            return {
                ...state,
                deletInfo: action.info
            }
        case 'DELETE_SUCCESS':
            return {
                ...state,
                deletInfo: action.info
            }
        case 'CLEAN_DATA': 
            return {
                ...state,
                data: []
            }
        case 'LOAD_MORE':
            return {
                ...state,
                data: [...action.data]
            }
        default:
            return state;
    }
}

export default userListReducer;