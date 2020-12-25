import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import VM from 'scratch-vm';
import AudioEngine from 'scratch-audio';

import { setProjectUnchanged } from '../reducers/project-changed';
import {
    LoadingStates,
    getIsLoadingWithId,
    onLoadedProject,
    projectError,
    requestProjectUpload
} from '../reducers/project-state';
import {
    openLoadingProject,
    closeLoadingProject
} from '../reducers/modals';
import axios from 'axios';

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

/*
 * Higher Order Component to manage events emitted by the VM
 * @param {React.Component} WrappedComponent component to manage VM events for
 * @returns {React.Component} connected component with vm events bound to redux
 */
const vmManagerHOC = function (WrappedComponent) {
    class VMManager extends React.Component {
        constructor(props) {
            super(props);
            bindAll(this, [
                'loadProject'
            ]);
        }
        componentDidMount() {
            if (!this.props.vm.initialized) {
                this.audioEngine = new AudioEngine();
                this.props.vm.attachAudioEngine(this.audioEngine);
                this.props.vm.setCompatibilityMode(true);
                this.props.vm.initialized = true;
                this.props.vm.setLocale(this.props.locale, this.props.messages);
            }
            if (!this.props.isPlayerOnly && !this.props.isStarted) {
                this.props.vm.start();
            }
        }
        componentDidUpdate(prevProps) {
            // if project is in loading state, AND fonts are loaded,
            // and they weren't both that way until now... load project!
            if (this.props.isLoadingWithId && this.props.fontsLoaded &&
                (!prevProps.isLoadingWithId || !prevProps.fontsLoaded)) {
                this.loadProject();
            }
            // Start the VM if entering editor mode with an unstarted vm
            if (!this.props.isPlayerOnly && !this.props.isStarted) {
                this.props.vm.start();
            }
        }

        loadPresetSb3(url) {
            axios({
                method: "get",
                url: url,
                responseType: 'blob',
                // headers: {
                //     Accept: 'application/octet-stream',
                // }
            }).then(res => {
                //console.log("response: ", res);
                // new Blob([data])用来创建URL的file对象或者blob对象
                const bfile = new Blob([res.data]);
                bfile.arrayBuffer().then(result => {
                    this.props.requestProjectUpload(this.props.loadingState);
                    this.props.onLoadingStarted();
                    this.props.vm.loadProject(result).then(() => {
                        this.props.onLoadingFinished(this.props.loadingState, true);
                    }).catch(err => {
                        this.props.onError(err);
                    });
                }).catch(err => {
                    console.log('获取arrayBuffer失败：', err);
                });
            }).catch(error => {
                console.log("下载sb3文件失败: response: ", error);
            });
        }

        loadProject() {
            return this.props.vm.loadProject(this.props.projectData)
                .then(() => {
                    this.props.onLoadedProject(this.props.loadingState, this.props.canSave);
                    // Wrap in a setTimeout because skin loading in
                    // the renderer can be async.
                    setTimeout(() => this.props.onSetProjectUnchanged());

                    // If the vm is not running, call draw on the renderer manually
                    // This draws the state of the loaded project with no blocks running
                    // which closely matches the 2.0 behavior, except for monitors–
                    // 2.0 runs monitors and shows updates (e.g. timer monitor)
                    // before the VM starts running other hat blocks.
                    if (!this.props.isStarted) {
                        // Wrap in a setTimeout because skin loading in
                        // the renderer can be async.
                        setTimeout(() => this.props.vm.renderer.draw());
                    }
                    //启动时根据url参数载入相应的project
                    let caller = getQueryVariable('caller');
                    let lskey = getQueryVariable('lskey');
                    let durl = getQueryVariable('durl');
                    if (caller && caller === 'ZCPTB') {
                        const lsItem = localStorage.getItem(lskey);
                        if (lsItem) {
                            dataURItoBlob(lsItem).arrayBuffer().then(result => {
                                this.props.requestProjectUpload(this.props.loadingState);
                                this.props.onLoadingStarted();
                                this.props.vm.loadProject(result).then(() => {
                                    this.props.onLoadingFinished(this.props.loadingState, true);
                                }).catch(err => {
                                    this.props.onError(err);
                                    if (durl) {
                                        this.loadPresetSb3(durl);
                                    }
                                });
                            }).catch((err) => {
                                console.log('blob解析失败');
                                if (durl) {
                                    this.loadPresetSb3(durl);
                                }
                            });
                        } else if (durl) {
                            this.loadPresetSb3(durl);
                        }
                    }
                })
                .catch(e => {
                    this.props.onError(e);
                });
        }
        render() {
            const {
                /* eslint-disable no-unused-vars */
                fontsLoaded,
                loadingState,
                locale,
                messages,
                isStarted,
                onError: onErrorProp,
                onLoadedProject: onLoadedProjectProp,
                onSetProjectUnchanged,
                projectData,
                /* eslint-enable no-unused-vars */
                isLoadingWithId: isLoadingWithIdProp,
                vm,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    isLoading={isLoadingWithIdProp}
                    vm={vm}
                    {...componentProps}
                />
            );
        }
    }

    VMManager.propTypes = {
        canSave: PropTypes.bool,
        cloudHost: PropTypes.string,
        fontsLoaded: PropTypes.bool,
        isLoadingWithId: PropTypes.bool,
        isPlayerOnly: PropTypes.bool,
        isStarted: PropTypes.bool,
        loadingState: PropTypes.oneOf(LoadingStates),
        locale: PropTypes.string,
        messages: PropTypes.objectOf(PropTypes.string),
        onError: PropTypes.func,
        onLoadedProject: PropTypes.func,
        onSetProjectUnchanged: PropTypes.func,
        projectData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        username: PropTypes.string,
        vm: PropTypes.instanceOf(VM).isRequired,
        requestProjectUpload: PropTypes.func,
        onLoadingFinished: PropTypes.func,
        onLoadingStarted: PropTypes.func
    };

    const mapStateToProps = state => {
        const loadingState = state.scratchGui.projectState.loadingState;
        return {
            fontsLoaded: state.scratchGui.fontsLoaded,
            isLoadingWithId: getIsLoadingWithId(loadingState),
            locale: state.locales.locale,
            messages: state.locales.messages,
            projectData: state.scratchGui.projectState.projectData,
            projectId: state.scratchGui.projectState.projectId,
            loadingState: loadingState,
            isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
            isStarted: state.scratchGui.vmStatus.started
        };
    };

    const mapDispatchToProps = dispatch => ({
        onError: error => dispatch(projectError(error)),
        onLoadedProject: (loadingState, canSave) =>
            dispatch(onLoadedProject(loadingState, canSave, true)),
        onSetProjectUnchanged: () => dispatch(setProjectUnchanged()),
        onLoadingFinished: (loadingState, success) => {
            dispatch(onLoadedProject(loadingState, false, success));
            dispatch(closeLoadingProject());
        },
        requestProjectUpload: loadingState => dispatch(requestProjectUpload(loadingState)),
        onLoadingStarted: () => dispatch(openLoadingProject()),
    });

    // Allow incoming props to override redux-provided props. Used to mock in tests.
    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );

    return connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(VMManager);
};

export default vmManagerHOC;
