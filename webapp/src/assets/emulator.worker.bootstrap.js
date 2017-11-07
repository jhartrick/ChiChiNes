importScripts("./assets/require.js");

require({
    baseUrl: "./assets"
},
    ["require",  "emulator.worker"],

    function (req,  tendo) {
        var tend = new tendo.tendoWrapper();
        tend.require = require;
        onmessage = (e) => {
            try {
                // send message to the nintendo wrapper
                tend.handleMessage(e);
            } catch (error) {
                postMessage({ 'error': error } );
            }
        }
        postMessage('ready');
    }
);
