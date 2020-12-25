import VM from 'scratch-vm';
import storage from '../lib/storage';

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

const SET_VM = 'scratch-gui/vm/SET_VM';
const defaultVM = new VM();
defaultVM.attachStorage(storage);
const initialState = defaultVM;

window.vm = defaultVM;
window.storeToLocal = () => {
    var fr = new FileReader();
    fr.onload = function (evt) {
        var result = evt.target.result;
        try {
            let lskey = getQueryVariable('lskey');
            if (lskey) {
                localStorage.setItem(lskey, result)
                window.parent.postMessage('store success', '*');
            } else {
                window.parent.postMessage('store failed', '*');
            }
        } catch (e) {
            console.log('storage failed:' + e);
            window.parent.postMessage('store failed', '*');
        }
    }
    vm.saveProjectSb3().then(content => { fr.readAsDataURL(content) }).catch(e => {
        console.log('fail to saveProjectSb3');
        window.parent.postMessage('store failed', '*');
    });
}

window.resetScratch = () => {
    let durl = getQueryVariable('durl');
    let lskey = getQueryVariable('lskey');
    localStorage.removeItem(lskey);
    axios({
        method: "get",
        url: durl,
        responseType: 'blob',
        // headers: {
        //     Accept: 'application/octet-stream',
        // }
    }).then(res => {
        //console.log("response: ", res);
        // new Blob([data])用来创建URL的file对象或者blob对象
        const bfile = new Blob([res.data]);
        return bfile.arrayBuffer()
    }).then(result => {
        return window.vm.loadProject(result);
    }).then(() => {
        window.parent.postMessage('reset success', '*');
    }).catch(err => {
        console.log(err);
        window.parent.postMessage('reset failed', '*');
    });
}

window.addEventListener('message', function (e) {
    console.log("scratch:"+e.data);
    switch (e.data) {
        case 'clearSb3': localStorage.clear(); break;
        case 'store': storeToLocal(); break;
        case 'reset': resetScratch(); break;
        default: break;
    };
}, false);

//初始化完成后发送给题库一个信息
window.parent.postMessage('clear ready', '*');

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case SET_VM:
            return action.vm;
        default:
            return state;
    }
};
const setVM = function (vm) {
    window.vm = vm;
    return {
        type: SET_VM,
        vm: vm
    };
};

export {
    reducer as default,
    initialState as vmInitialState,
    setVM
};
