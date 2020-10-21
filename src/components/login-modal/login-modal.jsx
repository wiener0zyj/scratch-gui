import Modal from '../../containers/modal.jsx';
import styles from './login-modal.css';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeLoginModal } from '../../reducers/modals.js';
import { setToken, setNickName, setHead } from '../../reducers/user-state.js'
import tranLogo from './tranlogo.png';
import closeIcon from './login-modal-close.svg';
import axios from 'axios';
class LoginModal extends React.Component {

    constructor(props) {
        super(props);

        this.emailRef = React.createRef();
        this.passRef = React.createRef();

        this.onEmailBlur = this.onEmailBlur.bind(this);
        this.onPassBlur = this.onPassBlur.bind(this);
        this.login = this.login.bind(this);
    }

    onEmailBlur() {
        //console.log(this.emailRef);
        const email = this.emailRef.current.value;
        if (email) {
            const reg = new RegExp(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
            const s = email.match(reg);
            if (!s || s[0] !== email) {
                alert('邮箱格式不正确');
            }
        } else {
            alert('邮箱不能为空！');
        }
    }

    onPassBlur() {
        //console.log(this.passRef);
        if (!this.passRef.current.value) {
            alert('密码不能为空！');
        }
    }

    login() {
        const email = this.emailRef.current.value;
        const password = this.passRef.current.value;
        if (!email) {
            alert('邮箱不能为空！');
            return;
        }
        const reg = new RegExp(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
        const s = email.match(reg);
        if (!s || s[0] !== email) {
            alert('邮箱格式不正确');
            return;
        }
        if (!password) {
            alert('密码不能为空！');
            return;
        }

        const sendData = {
            email: email,
            password: password
        };
        //调用登录接口，成功返回token和头像、昵称等信息，失败重新登陆
        axios.post('http://127.0.0.1:10005/service/login', sendData, { headers: { 'Content-Type': 'application/json' } }).then(response => {
            const data = response.data;
            switch (data.status) {
                case -1:
                    alert('sever:' + data.description);
                    break;
                case -2:
                    alert('sever:' + data.description);
                    break;
                case -3:
                    alert('sever:' + data.description);
                    break;
                case -4:
                    alert('sever:' + data.description);
                    break;
                case -5:
                    alert('sever:' + data.description);
                    break;
                case 1:
                    //token写入cookie
                    const token = data.result.token;
                    let exdate = new Date();
                    exdate.setDate(exdate.getDate() + 2);
                    this.setCookie('token', token, exdate);
                    //头像昵称写入state
                    this.props.setToken(token);
                    this.props.setNick(data.result.account.nickName);
                    this.props.setAvator(data.result.account.head);
                    this.props.onClose();
                    break;
                default: break;
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    delCookie(name) { //删除cookie
        var exp = new Date();
        exp.setTime(exp.getTime() - 1000);
        var cval = this.getCookie(name);
        if (cval) document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString();// + ";domain=zcpwriter.com";
    }

    getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr) return unescape(arr[2]); return null;
    }

    setCookie(c_name, value, expiredays) {  //设置cookie函数
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) +
            ((!expiredays) ? "" : ";expires=" + exdate.toUTCString());// + ';domain=.zcpwriter.com;path=/';
    }

    render() {
        return (<>
            <Modal
                className={styles.modalContent}
                overlayClassName={styles.overlayModalContent}
                //contentLabel={props.title}
                id="loginModal"
                //onRequestClose={props.onCancel}
                needHead={false}
            >
                <div className={styles.loginModalHead}>
                    <img className={styles.loginModalLoginLogo} src={tranLogo} />
                    <img className={styles.loginModalClose} src={closeIcon} onClick={this.props.onClose} />
                </div>
                <div className={styles.loginModalBody}>
                    <p className={styles.loginModalTitle}>登录</p>
                    <div className={styles.loginModalFormItem}>
                        <p>账号（注册时所用邮箱）</p>
                        <input type="email" ref={this.emailRef} onBlur={this.onEmailBlur} />
                    </div>
                    <div className={styles.loginModalFormItem}>
                        <p>密码</p>
                        <input type="password" ref={this.passRef} onBlur={this.onPassBlur} />
                    </div>
                    <div className={styles.loginModalFormItem}>
                        <a href='http://localhost:10005/register' className={styles.loginModalFl}>注册账号</a>
                        <a href='http://localhost:10005/forget' className={styles.loginModalFr}>忘记密码</a>
                    </div>
                    <div className={styles.loginModalButtonRow}>
                        <button type='button' className={styles.loginModalOkButton} onClick={this.login.bind(this)}>登录</button>
                    </div>
                </div>
            </Modal>
        </>);
    }
}
LoginModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    setToken: PropTypes.func.isRequired,
    setNick: PropTypes.func.isRequired,
    setAvator: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
}
// LoginModal.defaultProps = {
//     onCancel: () => { }
// }
const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(closeLoginModal()),
    setToken: token => dispatch(setToken(token)),
    setNick: name => dispatch(setNickName(name)),
    setAvator: head => dispatch(setHead(head)),
});

const mapStateToProps = () => ({});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginModal);