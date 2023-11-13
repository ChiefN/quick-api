import * as vscode from "vscode";
import * as fileClient from "./data/FileClient";

export class SidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'quick-api.sidebarView';

    _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'log': {
                    console.log(data.value);
                    break;
                }
                case 'ready': {
                    if (this._view) {
                        const apiArr = fileClient.getApiArr(vscode.Uri.joinPath(this._extensionUri, 'src', 'data', 'content').fsPath)
                        this._view.webview.postMessage({ type: 'update-api-select', value: apiArr });
                    }
                    break;
                }
                case 'create-api': {
                    if (this._view) {
                        const api = fileClient.createNewApi(vscode.Uri.joinPath(this._extensionUri, 'src', 'data', 'content').fsPath)
                        const apiArr = fileClient.getApiArr(vscode.Uri.joinPath(this._extensionUri, 'src', 'data', 'content').fsPath)
                        this._view.webview.postMessage({ type: 'update-and-select-api-select', value: {arr: apiArr, selected: api.key}});
                    }
                    break;
                }
                case 'api-select-changed': {
                    if (this._view) {
                        const api = fileClient.getApi(vscode.Uri.joinPath(this._extensionUri, 'src', 'data', 'content', data.value).fsPath)
                        this._view.webview.postMessage({ type: 'selected-api', value: api});
                    }
                    break;
                }
                case 'update-api': {
                    if (this._view) {
                        fileClient.updateApiAsync(vscode.Uri.joinPath(this._extensionUri, 'src', 'data', 'content', data.value.key).fsPath, data.value)
                        //this._view.webview.postMessage({ type: 'selected-api', value: api});
                    }
                    break;
                }
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'scripts', 'main.js'));
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'styles', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'styles', 'vscode.css'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'styles', 'main.css'));

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">

				<title>Quick Api</title>
			</head>
			<body>
                <button id="create-api-btn">Create new Api</button>

                <div>
                    <select id="api-select">
                    </select>
                    <button id="start-api-btn">Start</button>
                </div>

                <div>
                    <input type="text" id="api-key-input" placeholder="Api key">
                    <button id="api-options-btn">Actions</button>
                </div>
                <div id="endpoints-container">

                </div>


                <div>
                    <button id="create-new-endpoint-btn">Create new</button>
                    <input type="text" id="endpoint-url-input" placeholder="/this/is/the/url?for=theendpoint">
                    <label for="endpoint-method-select-name">Method:</label>
                    <select name="endpoint-method-select-name" id="endpoint-method-select">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                    <label for="endpoint-res-status-select-name">Method:</label>
                    <select name="endpoint-res-status-select-name" id="endpoint-res-status-select">
                        <option value="200">200 - Ok</option>
                        <option value="201">201 - Created</option>
                        <option value="400">400 - Bad request</option>
                        <option value="401">401 - Unauthorized</option>
                        <option value="403">403 - Forbidden</option>
                        <option value="404">404 - Not found</option>
                        <option value="500">500 - Error</option>
                    </select>
                    <textarea id="response-input" placeholder="Response"></textarea>
                    <button id="save-endpoint-btn">Save</button>
                </div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
		</html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}