import axios from 'axios';

const requestStart = () => {
    return {
        type: 'FETCHING'
    }
}

const requestSuccess = (res) => {
    return {
        type: 'FETCH_SUCCESS',
        data: res.data,
    }
}

const requestFail = (err) => {
    return {
        type: 'FETCH_FAIL',
        error: err
    }
}

const deleteSuccess = (res) => {
    return {
        type: 'DELETE_SUCCESS',
        info: res
    }
}

const deleteFail = (err) => {
    return {
        type: 'DELETE_FAIL',
        info: err
    }
}

const loadMore = (res) => {
    console.log('-======in action load more ========')
    return {
        type: 'LOAD_MORE',
        data: res.data,
    }
}

const requestChildSuccess = (res) => {
    console.log(res.data.data.subordinate.length);
    return {
        type: 'FETCH_SUCCESS',
        data: res.data.data.subordinate
    }
}

const requestSuperiorSuccess = (res) => {
    // console.log("in requst superior success",res.data.data)
    return {
        type: 'FETCH_SUCCESS',
        data: [res.data.data]
    }
}




export const openChild = (user) => {
    return (dispatch) => {
        axios.get(`http://localhost:2020/api/user/${user._id}`)
            .then(response => {
                dispatch(requestChildSuccess(response));
            }).catch(error => {
                dispatch(requestFail(error));
            })
    }
}

export const openSuperior = (id) => {
    return (dispatch) => {
        axios.get(`http://localhost:2020/api/user/${id}`)
            .then(response => {
                console.log("open superior:", response);
                dispatch(requestSuperiorSuccess(response));
            }).catch(error => {
                dispatch(requestFail(error));
            })
    }
}

export const getUserList = (searchKeyWord, sortColumn, sortDirection, pageRange, isLoadMore=true) => {
    if (isLoadMore) {
        return (dispatch) => {    
            axios.get(`http://localhost:2020/api/users?searchKeyWord=${searchKeyWord}&sortColumn=${sortColumn}&sortDirection=${sortDirection}&pageRange=${pageRange}`)
                .then(response => {
                    dispatch(loadMore(response));
                }).catch(error => {
                    dispatch(requestFail(error));
                })
        }
    } else {
        return (dispatch) => {
            dispatch(requestStart());
            axios.get(`http://localhost:2020/api/users?searchKeyWord=${searchKeyWord}&sortColumn=${sortColumn}&sortDirection=${sortDirection}&pageRange=${pageRange}`)
                .then(response => {
                    dispatch(requestSuccess(response));
                }).catch(error => {
                    dispatch(requestFail(error));
                })
        }
    }
}


export const cleanData = () => {
    return {
        type: 'CLEAN_DATA',
    }
}

export const deleteUser = (userId) => {
    console.log('in delete')
    return (dispatch) => {
        axios.delete(`http://localhost:2020/api/user/${userId}`)
            .then(response => {
                dispatch(deleteSuccess(response));
                dispatch(cleanData());
                dispatch(getUserList('', '_id', 1, 1, true));
            }).catch(error => {
                dispatch(deleteFail(error));
            })
    }
}