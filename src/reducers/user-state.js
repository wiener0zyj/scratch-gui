const SET_USERSTATE = 'scratch-gui/user-state/set-state'

const initialState = {
    tokken:null,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case SET_USERSTATE:
            return Object.assign({}, state, {
                tokken: action.tokken
            });
        default:
            return state;
    }
}

export {
    reducer as default,
    initialState as userStateInitialState,
};