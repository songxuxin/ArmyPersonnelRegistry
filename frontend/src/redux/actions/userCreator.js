import axios from 'axios';

const postSuccess = (res) => {
    return {
        type: 'CREATION_SUCCESS',
    }
}

const postFail = (err) => {
    return {
        type: 'CREATION_FAIL',
        error: err
    }
}

const superiorsSuccess = (res) => {
    console.log('list superior success', res.data.length);
    return {
        type: 'SUPERIORS_SUCCESS',
        data: res.data,
    }
}

const superiorsFail = (err) =>{
    return {
        type: 'SUPERIORS_FAIL',
        error: err
    }
}

export const createUser = (user) => {
    console.log('in create user action: ', user);
    return (dispatch) => {
        axios.post('http://localhost:2020/api/user', {
            img: user.img,
            name: user.name,
            rank: user.rank,
            sex: user.radio,
            startDate: user.startDate,
            phone: user.phone,
            email: user.email,
            superiorId: user.superior
        })
        .then(res =>{
            dispatch(postSuccess(res));
        })
        .catch(err => {
            dispatch(postFail(err));
        })
    }
} 

export const getSuperiors = () =>{
    console.log('in create action, get superiors');
    return (dispatch) => {
        axios.get('http://localhost:2020/api/superiors')
        .then(response =>{
            console.log(response);
            dispatch(superiorsSuccess(response));
        }).catch(error => {
            dispatch(superiorsFail(error));
        })
    }
}

export const changePostInfo = () => {
    return {
        type: 'CHANGE_POST_FLAG'
    }
}
