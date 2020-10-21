const SET_TOKEN = 'scratch-gui/user-state/set-token'
const SET_NICKNAME = 'scratch-gui/user-state/set-nickname'
const SET_HEAD = 'scratch-gui/user-state/set-head'

const initialState = {
    token: null,
    nickName: null,
    head: null
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case SET_TOKEN:
            return Object.assign({}, state, {
                token: action.token
            });
        case SET_NICKNAME:
            return Object.assign({}, state, {
                nickName: action.nickName
            });
        case SET_HEAD:
            return Object.assign({}, state, {
                head: action.head
            });
        default:
            return state;
    }
}

const setToken = function (token) {
    return {
        type: SET_TOKEN,
        token: token
    }
}
const setNickName = function (name) {
    return {
        type: SET_NICKNAME,
        nickName: name
    }
}
const setHead = function (head) {
    return {
        type: SET_HEAD,
        head: head
    }
}

export {
    reducer as default,
    initialState as userStateInitialState,
    setToken,
    setNickName,
    setHead
};