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
        e.style.display = (state[e.getAttribute('fw-if')]) ? null : 'none';
    });
}
// Método para actualizar contenido de elementos con etiqueta fw-content
updateContent = (root, state, handlers) => {
    document.querySelectorAll('[fw-content]').forEach(e => {
        e.innerHTML = state[e.getAttribute('fw-content')];
    });
}
// Método para actualizar valor de elementos con etiqueta fw-attr:value
updateValues = (root, state, handlers) => {
    document.querySelectorAll('[fw-attr\\:value]').forEach(e => {
        e.value = state[e.getAttribute('fw-attr:value')];
    });
}
// Método para actualizar style de elementos con etiqueta fw-attr:style
updateStyle = (root, state, handlers) => {
    document.querySelectorAll('[fw-attr\\:style]').forEach(e => {
        e.style = state[e.getAttribute('fw-attr:style')];
    });
}

updateClass = (root, state, handlers) => {
    document.querySelectorAll('[fw-attr\\:class]').forEach(e => {
        e.className = state.class[e.getAttribute('fw-attr:class')];
    });
}

updateSrc = (root, state, handlers) => {
    document.querySelectorAll('[fw-attr\\:src]').forEach(e => {
        e.src = state.src[e.getAttribute('fw-attr:src')];
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
}

window.createApp = ({
                        rootElementId,
                        initialState,
                        handlers
                    }) => {
    //Actualizamos la vista con los valores iniciales
    update(rootElementId, initialState, handlers);

    // Método para establecer los eventos correspondientes según etiqueta fw-on:{event}
    setListeners = () => {
        // Para cada evento aceptado por el framework
        availableEvents.forEach(pEvent => {
            // Buscamos todos los elementos con evento pEvent y realizamos para cada uno
            document.querySelectorAll('[' + 'fw-on\\:' + pEvent + ']').forEach(e => {
                // Establecemos el Event Listener Adecuado para el elemento
                e.addEventListener(pEvent, (event) => {
                    //Obtenemos el Handler adecuado y lo corremos
                    handler = handlers[e.getAttribute('fw-on:' + pEvent)];
                    initialState = handler(initialState, event);
                    // Actualizamos la vista con el estado actual
                    update(rootElementId, initialState, handlers);
                });
            });
        });
    }
    setListeners();
}