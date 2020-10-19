import Modal from '../../containers/modal.jsx';
import styles from './login-modal.css';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeLoginModal } from '../../reducers/modals.js';
import tranLogo from './tranlogo.png';
import closeIcon from './login-modal-close.svg';
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

        //调用登录接口，成功返回token和头像、昵称等信息，失败重新登陆

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
                        <a href='/forget/password' className={styles.loginModalFr}>忘记密码</a>
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
    title: PropTypes.string.isRequired
}
// LoginModal.defaultProps = {
//     onCancel: () => { }
// }
const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(closeLoginModal())
});

const mapStateToProps = () => ({});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginModal);