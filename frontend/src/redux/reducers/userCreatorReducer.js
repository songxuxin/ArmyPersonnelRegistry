const userCreatorReducer = (state={postInfo: false, error: null, superiors:[]}, action) => {
    switch (action.type) {
        case 'CREATION_SUCCESS':
            return {
                ...state,
                postInfo: true,
                error: null
            }
        case 'CREATION_FAIL':
            return {
                ...state,
                postInfo: false,
                error: action.error
            }
        case 'CHANGE_POST_FLAG':
            return {
                ...state,
                postInfo: false
            }
        case 'SUPERIORS_SUCCESS':
            return {
                ...state,
                superiors: action.data
            }
        case 'SUPERIORS_FAIL':
            return {
                ...state,
                error: action.error
            }
        default:
            return state;
    }
}

export default userCreatorReducer;