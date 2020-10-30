"use strict";

import EventHandler from './EventHandler.js';

/**
 * Dispatch class
 */
class Main {

    /**
     * @constructor
     */
    constructor() {
        new EventHandler();
        Main.prepUX();
        Main.loadServiceWorker();
        Main.handleManifest();
    }

    /**
     * Prepare the user experience
     * @returns {void}
     */
    static prepUX() {
        document.getElementById(`installBanner`).style.display = 'none';
    }

    /**
     *
     * @returns {Promise<void>}
     */
    static async loadServiceWorker() {
        if ('serviceWorker' in navigator) {
            await navigator.serviceWorker.register('/ServiceWorker.js').then((registration) => {
                console.log('BDH ServiceWorker registration succeeded. Scope is ' + registration.scope);
            }).catch((error) => {
                console.log('Registration failed with ' + error);
            });
        }
    }

    /**
     * @returns {void}
     */
    static handleManifest() {
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            deferredPrompt = event;
            document.getElementById(`installBanner`).style.display = 'block';
            document.getElementById(`installButton`).addEventListener('click', () => {
                document.getElementById(`installBanner`).style.display = 'none';
                deferredPrompt.prompt();
                deferredPrompt.userChoice
                    .then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted the A2HS prompt');
                        } else {
                            console.log('User dismissed the A2HS prompt');
                        }
                        deferredPrompt = null;
                    });
            });
        });
    }
}

/**
 * Bootstraps program by instantiating object of Main()
 */
window.addEventListener('load', () => {
    new Main();
});
