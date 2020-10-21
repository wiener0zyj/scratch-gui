/*
NOTE: this file only temporarily resides in scratch-gui.
Nearly identical code appears in scratch-www, and the two should
eventually be consolidated.
*/

import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { setToken, setNickName, setHead } from '../reducers/user-state.js'
import { connect } from 'react-redux';

import AccountNavComponent from '../components/menu-bar/account-nav.jsx';
import { openAccountMenu, closeAccountMenu, accountMenuOpen } from '../reducers/menus.js';


const getCookie = function (name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr) return unescape(arr[2]); return null;
}
const delCookie = function (name) { //删除cookie
    var exp = new Date();
    exp.setTime(exp.getTime() - 1000);
    var cval = getCookie(name);
    if (cval) document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString();// + ";domain=zcpwriter.com";
}

const AccountNav = function (props) {
    const {
        ...componentProps
    } = props;
    return (
        <AccountNavComponent
            {...componentProps}
        />
    );
};

AccountNav.propTypes = {
    classroomId: PropTypes.string,
    isEducator: PropTypes.bool,
    isRtl: PropTypes.bool,
    isStudent: PropTypes.bool,
    isOpen: PropTypes.bool,
    profileUrl: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    username: PropTypes.string
};

const mapStateToProps = state => ({
    classroomId: '',
    isEducator: false,
    isStudent: false,
    profileUrl: '',
    thumbnailUrl: state.scratchGui.userState.head ?
        state.scratchGui.userState.head : 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1603176790310&di=389f13116570b663b730935bceaaf795&imgtype=0&src=http%3A%2F%2Fmp2.iqiyipic.com%2Fimage%2F20180722%2Ff7%2Ffd%2Fppu_398158930102_pp_601_300_300.jpg',
    username: state.scratchGui.userState.nickName ?
        state.scratchGui.userState.nickName : 'undefined',
    isOpen: accountMenuOpen(state)

});

const mapDispatchToProps = (dispatch) => ({
    onClick: () => dispatch(openAccountMenu()),
    onClose: () => dispatch(closeAccountMenu()),
    onLogOut: () => {
        //删除cookie
        delCookie('token');
        dispatch(closeAccountMenu());
        dispatch(setToken(null));
        dispatch(setNickName(null));
        dispatch(setHead(null));
    }
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountNav));
