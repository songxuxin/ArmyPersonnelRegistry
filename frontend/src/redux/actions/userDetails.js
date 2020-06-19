import axios from 'axios';

const requestStart = () => {
    return {
        type: 'DETAILS_FETCHING'
    }
}

const requstSuccess = (res) => {
    return {
        type: 'DETAILS_FETCH_SUCCESS',
        data: res.data
    }
}

const requestFail = (err) => {
    return {
        type: 'DETAILS_FETCH_FAIL',
        error: err
    }
}

const postSuccess = () => {
    return {
        type: 'POST_SUCCESS'
    }
}

const postFail = (err) => {
    return {
        type: 'POST_FAIL',
        error: err
    }
}

export const getOneUser = (id) => {
    return (dispatch) => {
        dispatch(requestStart());
        axios.get(`http://localhost:2020/api/user/${id}`)
            .then(response => {
                dispatch(requstSuccess(response));
            }).catch(error => {
                dispatch(requestFail(error));
            })
    }
}

export const updateUser = (user) => {
    const req = {
        img : user.img,
        name : user.name,
        rank : user.rank,
        sex : user.sex,
        startDate : user.startDate,
        phone : user.phone,
        email : user.email
    }
    if(user.superior){
        if(typeof user.superior === 'string'){
            req.superiorId = user.superior;
        }else{
            console.log(user.superior);
            req.superiorId = user.superior._id;
        }
    }
    return (dispatch) => {
        axios.post(`http://localhost:2020/api/user/${user.id}`, req)
        .then(response => {
            dispatch(postSuccess());
        }).catch(error => {
            dispatch(postFail(error));
        }
        )
    }
}

export const changePostInfo = () => { 
    return {
        type: 'CHANGE_POST_FLAG'
    }
}