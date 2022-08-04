// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { refreshDiagnostic } from './diagnostics';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	
	console.log('Congratulations, your extension "torchtidy-visualizer" is now active!');
	let reportFileWatcher = vscode.workspace.createFileSystemWatcher(
		"**/torchtidy_report.json"
	);
	const torchTidyDiagnostics = vscode.languages.createDiagnosticCollection("TorchTidy");
	context.subscriptions.push(torchTidyDiagnostics);
	context.subscriptions.push(
		reportFileWatcher.onDidChange(async () => {
			let reportFileList = await vscode.workspace.findFiles("**/torchtidy_report.json");
			if (!reportFileList.length){
				return;
			}
			let reportFileUri = reportFileList[0];
			refreshDiagnostic(torchTidyDiagnostics, reportFileUri);
		})
	);
	let reportFileList = await vscode.workspace.findFiles("**/torchtidy_report.json");
	if (!reportFileList.length){
		return;
	}
	let reportFileUri = reportFileList[0];
	refreshDiagnostic(torchTidyDiagnostics, reportFileUri);
}

// this method is called when your extension is deactivated
export function deactivate() {
	
}

