var availableEvents = [
    'abort',
    'afterprint',
    'animationend',
    'animationiteration',
    'animationstart',
    'beforeprint',
    'beforeunload',
    'blur',
    'canplay',
    'canplaythrough',
    'change',
    'click',
    'contextmenu',
    'copy',
    'cut',
    'dblclick',
    'drag',
    'dragend',
    'dragenter',
    'dragleave',
    'dragover',
    'dragstart',
    'drop',
    'durationchange',
    'ended',
    'error',
    'focus',
    'focusin',
    'focusout',
    'fullscreenchange',
    'fullscreenerror',
    'hashchange',
    'input',
    'invalid',
    'keydown',
    'keypress',
    'keyup',
    'load',
    'loadeddata',
    'loadedmetadata',
    'loadstart',
    'message',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseover',
    'mouseout',
    'mouseup',
    'mousewheel',
    'offline',
    'online',
    'open',
    'pagehide',
    'pageshow',
    'paste',
    'pause',
    'play',
    'playing',
    'popstate',
    'progress',
    'ratechange',
    'resize',
    'reset',
    'scroll',
    'search',
    'seeked',
    'seeking',
    'select',
    'show',
    'stalled',
    'storage',
    'submit',
    'suspend',
    'timeupdate',
    'toggle',
    'touchcancel',
    'touchend',
    'touchmove',
    'touchstart',
    'transitionend',
    'unload',
    'volumechange',
    'waiting',
    'wheel'
];

updateIf = (root, state, handlers) => {
    document.querySelectorAll('[fw-if]').forEach(e => {
        e.style.display = getStateAttribute(state, e.getAttribute('fw-if')) ? null : 'none';
    });
}
// Método para actualizar contenido de elementos con etiqueta fw-content
updateContent = (root, state, handlers) => {
    document.querySelectorAll('[fw-content]').forEach(e => {
        e.innerHTML = getStateAttribute(state, e.getAttribute('fw-content'));
    });
}
// Método para actualizar valor de elementos con etiqueta fw-attr:value
updateValues = (root, state, handlers) => {
    document.querySelectorAll('[fw-attr\\:value]').forEach(e => {
        e.value = getStateAttribute(state, e.getAttribute('fw-attr:value'));
    });
}
// Método para actualizar style de elementos con etiqueta fw-attr:style
updateStyle = (root, state, handlers) => {
    document.querySelectorAll('[fw-attr\\:style]').forEach(e => {
        let style = getStateAttribute(state, e.getAttribute('fw-attr:style'));
        if (typeof style === "object") {
            for (const property in style) {
                let val = style[property];
                if (typeof val === "number"){
                    val = val+'px';
                }
                e.style[property] = val
            }
        } else {
            e.style = style;
        }
    });
}

updateClass = (root, state, handlers) => {
    document.querySelectorAll('[fw-attr\\:class]').forEach(e => {
        e.className = getStateAttribute(state, e.getAttribute('fw-attr:class'));
    });
}

updateSrc = (root, state, handlers) => {
    document.querySelectorAll('[fw-attr\\:src]').forEach(e => {
        e.src = getStateAttribute(state, e.getAttribute('fw-attr:src'));
    });
}

// Método update para actualizar la vista
update = (root, state, handlers) => {
    updateIf(root, state, handlers);
    updateContent(root, state, handlers);
    updateValues(root, state, handlers);
    updateStyle(root, state, handlers);
    updateClass(root, state, handlers);
    updateSrc(root, state, handlers);
    setListeners(root, state, handlers);
}

getStateAttribute = (state, searchStr) => {
    let val = state;
    for (const e of searchStr.split(".")) {
        if (val.hasOwnProperty(e)){
            val = val[e]
        }else{
            console.error('Could not Find prop: ' + searchStr + ' >>> ' + e + ' | ' + val + JSON.stringify(val))
            val = undefined;
            break;
        }
    }
    return Object.assign(val);
}

let _listeners = []

// Método para establecer los eventos correspondientes según etiqueta fw-on:{event}
setListeners = (rootElementId, initialState, handlers) => {
    // Para cada evento aceptado por el framework
    availableEvents.forEach(pEvent => {
        // Buscamos todos los elementos con evento pEvent y realizamos para cada uno
        let query = '[' + 'fw-on\\:' + pEvent + ']';
        document.querySelectorAll(query).forEach(e => {
            let store = {q: query, e: e};
            if(_listeners.find(x => x.q === store.q && x.e === store.e)){
                return;
            }
            _listeners.push({q: query, e: e})
            // Establecemos el Event Listener Adecuado para el elemento
            e.addEventListener(pEvent, (event) => {
                //Obtenemos el Handler adecuado y lo corremos
                let handler = handlers[e.getAttribute('fw-on:' + pEvent)];
                let _state = handler(initialState, event);
                if (_state !== undefined) {
                    initialState = _state
                }
                // Actualizamos la vista con el estado actual
                update(rootElementId, initialState, handlers);
            });
        });
    });
}

window.createApp = ({
                        rootElementId,
                        initialState,
                        handlers,
                        methods
                    }) => {

    //Actualizamos la vista con los valores iniciales
    update(rootElementId, initialState, handlers);


    setListeners(rootElementId, initialState, handlers);

    //----------------------------------------------------------------------
    // GAME ADDONS
    //----------------------------------------------------------------------

    calcDelta = () => {
        const now = Date.now();
        initialState.delta.val = now - initialState.delta.lastUpdate;
        initialState.delta.lastUpdate = now;
    }

    internalGameLoop = () => {
        calcDelta();
        let _state = methods.gameLoop(initialState);
        if (_state !== undefined) {
            initialState = _state
        }
        update(rootElementId, initialState, handlers);
    }

    internalGameInit = () => {
        initialState.delta = {}
        initialState.delta.lastUpdate = Date.now();

        if (methods.gameInit !== undefined) {
            let _state = methods.gameInit(initialState);
            if (_state !== undefined) {
                initialState = _state
            }
        }
    }


    if (methods.gameLoop !== undefined) {
        let tick = (gm = initialState.game) ? (gm.tickTime ?? 1000) : 1000;
        console.log('Starting Game Loop. game.tickTime = ' + tick);
        internalGameInit();
        setInterval(internalGameLoop, tick);
    }


}