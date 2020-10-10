import Modal from '../../containers/modal.jsx';
import styles from './login-modal.css';
import React from 'react';
import PropTypes from 'prop-types';
import Box from '../box/box.jsx';
import SubmitLoginButton from './submit-login-button.jsx';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Button from '../button/button.jsx';
import { closeLoginModal } from '../../reducers/modals.js';
import style from 'react-tooltip/dist/style';
const LoginModal = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={props.title}
        id="loginModal"
        onRequestClose={props.onCancel}
    >
        <Box>
            <input
                className={styles.minInput}
                name="account"
                placeholder="账号"
                type="text"
            /><br />
            <input
                className={styles.minInput}
                name="password"
                placeholder="密码"
                type="password"
            /><br />
            <div className={styles.jumpBtns}>
                <span className={styles.jumpOption}>注册</span>
                <span className={styles.jumpOption}>忘记密码</span>    
            </div>
            <SubmitLoginButton className={styles.btnSubmit} />
        </Box>
    </Modal>
);
LoginModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
}
// LoginModal.defaultProps = {
//     onCancel: () => { }
// }
const mapDispatchToProps = dispatch => ({
    onCancel: () => dispatch(closeLoginModal())
});

const mapStateToProps = () => ({});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginModal);