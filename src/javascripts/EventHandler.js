"use strict";

/**
 * Event handling class
 */
export default class EventHandler {

    /**
     * @constructor
     */
    constructor() {
        EventHandler.#handleFileUploadButton();
        EventHandler.#stopEnterKey();
        EventHandler.#handleDropArea();
    }

    /**
     * @returns {void}
     */
    static #handleFileUploadButton() {
        document.getElementById('uploadFileButton').addEventListener('click', async function() {
            document.getElementById(`resultText`).innerText = await EventHandler.performFetch();
            setTimeout(function() {
                document.getElementById(`resultText`).innerText = '\u00A0'; //inserts a text space so element doesn't roll up
            }, 1000);
        });
    }

    /**
     * @returns {void}
     */
    static #handleDropArea() {
        let dropArea = document.getElementById('dropArea');
        let dragArea = document.getElementById('dragArea');

        dropArea.addEventListener('drop', function(event) {
            EventHandler.#preventDefaults(event);
            event.dataTransfer.dropEffect = 'copy';
            let files = event.dataTransfer.files;
            for (let file of files) {
                if (file.name.match('.csv')) {
                    let reader = new FileReader();
                    reader.onload = async function() {
                        document.getElementById(`resultText`).innerText = await EventHandler.performFetch(file);
                    }
                    reader.readAsDataURL(file)
                }
            }
        }, false);

        dropArea.addEventListener('dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
            event.dataTransfer.dropEffect = 'copy';
            dragArea.style.opacity = '1';
        }, false);

        dropArea.addEventListener('dragleave', function(event) {
            event.preventDefault();
            event.stopPropagation();
            event.dataTransfer.dropEffect = 'copy';
            dragArea.style.opacity = '0.6';
        }, false);

    }

    /**
     * For disabling enter key
     * @returns {void}
     */
    static #stopEnterKey() {
        document.addEventListener('keypress', function(event) {
            const theKey = event.key;
            if (theKey.length > 1) {
                if (theKey === 'Enter') {
                    EventHandler.#preventDefaults(event);
                }
            }
        });
    }

    /**
     * For disabling default browser drag/drop behavior
     * @returns {void}
     */
    static #preventDefaults(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * @async
     * @returns {Promise<string>}
     */
    static async performFetch(dropped) {
        let data = new FormData();
        if (dropped) {
            data.append('file', dropped);
        } else {
            let file = document.getElementById('fileUpload');
            data.append('file', file.files[0]);
        }
        try {
            const response = await fetch(document.url, {
                method: 'POST',
                body: data,
                headers: {
                    'x-requested-with': 'fetch.0'
                }
            });
            return await response.text();
        } catch(error) {
            console.log(`ERROR: ${error}`);
        }
    }
}