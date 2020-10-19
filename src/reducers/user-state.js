const SET_USERSTATE = 'scratch-gui/user-state/set-state'

const initialState = {
    token: null,
    nickName: null,
    head: null
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case SET_USERSTATE:
            return Object.assign({}, state, {
                tokken: action.token,
                nickName: action.nickName,
                head: action.head
            });
        default:
            return state;
    }
}

export {
    reducer as default,
    initialState as userStateInitialState,
};