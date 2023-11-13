//@ts-check
(function () {
    let currentApi = {
        key: ''
    };
    let currentEndpoint = '';

    const vscode = acquireVsCodeApi();

    function sendToLog(msg){
        vscode.postMessage({ type: 'log', value: msg });
    }

    //Eventlisteners
    document.getElementById('api-select')?.addEventListener('change', (evt) => {
        let selectElement = evt.target;
        vscode.postMessage({ type: 'api-select-changed', value: selectElement.value });
    });
    document.getElementById('create-api-btn')?.addEventListener('click', () => {
        vscode.postMessage({ type: 'create-api', value: "" });
    });
    document.getElementById('create-endpoint-btn')?.addEventListener('click', () => {
        currentEndpoint = '';
    });

    const createOrUpdateEndpoint = () => {
        sendToLog("Try update");
        if(currentApi.key === '') {
            return;
        }
        sendToLog("Update");

        let found = false;

        let url = document.getElementById('endpoint-url-input').value;
        let method = document.getElementById('endpoint-method-select').value;
        let status = document.getElementById('endpoint-res-status-select').value;
        let response = document.getElementById('response-input').value;

        let urlExistsAndMethodExists = false;
        if(url + method !== currentEndpoint){
            for(let i = 0; i < currentApi.endpoints.length; i++){
                if(url + method === currentApi.endpoints[i].url + currentApi.endpoints[i].method){
                    urlExistsAndMethodExists = true;
                    break;
                }
            }
        }
        if(urlExistsAndMethodExists){
            sendToLog("Already exists");
            return;
        }

        if(currentEndpoint === ''){
            currentApi.endpoints.push({
                url: url,
                method: method,
                status: status,
                response: response
            });
        }else{
            let index = -1;
            let found = false;
            for(let i = 0; i < currentApi.endpoints.length; i++){
                if(currentApi.endpoints[i].url + currentApi.endpoints[i].method === currentEndpoint){
                    index = i;
                    found = true;
                    break;
                }
            }
            if(found){
                currentApi.endpoints[index].url = url;
                currentApi.endpoints[index].method = url;
                currentApi.endpoints[index].status = url;
                currentApi.endpoints[index].response = url;
            }
        }       


        vscode.postMessage({ type: 'update-api', value: currentApi });
        setCurrentApi(currentApi);
    };

    document.getElementById('save-endpoint-btn')?.addEventListener('click', () => {
        createOrUpdateEndpoint();
    });

    const refreshApiSelect = (apiArr, selectKey = '') => {
        const select = document.getElementById('api-select');
        if (select !== null) {
            let html = `<option value="">
                            Select an API
                        </option>`;
            apiArr.map((api) => {
                if(selectKey === api) {
                    html += `<option value="${api}" selected>
                        ${api.substring(0, api.length - 5)}
                    </option>`;
                    return;
                }
                html += `<option value="${api}">
                            ${api.substring(0, api.length - 5)}
                        </option>`;
            });
            select.innerHTML = html;
        }
        if(selectKey !== ''){
            vscode.postMessage({ type: 'api-select-changed', value: selectKey });
        }
    };

    const selectEndpoint = (evt) => {
        let url = evt.target.dataset.url;
        let method = evt.target.dataset.method;
        currentEndpoint = url + method;


        //TODO: This is what to do next


        let radios = document.querySelectorAll('[name="radio"]');
        for(let i = 0; i < radios.length; i++){
            if(radios[i].checked){
                currentApi = radios[i].value;
                for(let j = 0; j < currentApi.endpoints.length; j++){
                    if(currentApi.endpoints[j].url + currentApi.endpoints[j].method === currentEndpoint){
                        document.getElementById('endpoint-url-input').value = currentApi.endpoints[i].url;
                        document.getElementById('endpoint-method-select').value = currentApi.endpoints[i].method;
                        document.getElementById('endpoint-res-status-select').value = currentApi.endpoints[i].status;
                        document.getElementById('response-input').value = currentApi.endpoints[i].response;
                    break;
                    }
                }
                break;
            }
        }
    };


    const setCurrentApi = (api) => {
        currentApi = api;
        const container = document.getElementById('endpoints-container');
        const apiKeyInput = document.getElementById('api-key-input');

        if(apiKeyInput !== null){
            apiKeyInput.value = api.key.substring(0, api.key.length - 5);
        }

        if (container !== null) {
            let radios = document.querySelectorAll('[name="radio"]');
            for(let i = 0; i < radios.length; i++){
                radios[i].removeEventListener('click', selectEndpoint);
            }

            let html = '';
            api.endpoints.map((endpoint) => {
                html += `
                <label>
                <input type="radio" name="radio" value="${endpoint.url}${endpoint.method}"/>
                ${endpoint.url} ${endpoint.method} {endpoint.status}
                </label>
                `;
            });
            container.innerHTML = html;

            let radios2 = document.querySelectorAll('[name="radio"]');
            for(let i = 0; i < radios2.length; i++){
                radios2[i].addEventListener('click', selectEndpoint);
            }
        }
    };


    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'update-api-select': {
                refreshApiSelect(message.value);
                break;
            }
            case 'update-and-select-api-select': {
                refreshApiSelect(message.value.arr, message.value.selected);
                break;
            }
            case 'selected-api': {
                setCurrentApi(message.value);
                break;
            }
        }
    });

    vscode.postMessage({ type: 'ready', value: "" });
}());