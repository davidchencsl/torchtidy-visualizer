import * as vscode from 'vscode';

export async function refreshDiagnostic(diagnosticCollection: vscode.DiagnosticCollection, reportFileUri: vscode.Uri) {
	vscode.workspace.openTextDocument(reportFileUri)
	.then(async (document) => {
		let text = document.getText();
		let report = JSON.parse(text);
		for (const filename in report){
			let fileUriList = await vscode.workspace.findFiles("**/"+filename);
			if (!fileUriList.length){
				continue;
			}
			const diagnostics: vscode.Diagnostic[] = [];
			let fileUri = fileUriList[0];
			for (const entry of report[filename]){
				let lineNo = entry['line_number'] - 1;
				let message = entry['message'];
				let name = entry['name'];
				let url = entry['url'];
				if (url === ""){
					url = "https://pytorch.org/tutorials/recipes/recipes/tuning_guide.html";
				}
				let doc = await vscode.workspace.openTextDocument(fileUri);
				let defaultRange = doc.lineAt(lineNo).range;
				let correctRange = new vscode.Range(new vscode.Position(lineNo, doc.lineAt(lineNo).firstNonWhitespaceCharacterIndex), defaultRange.end);
				let diagnostic: vscode.Diagnostic = {
					range: correctRange, 
					message: message,
					severity: vscode.DiagnosticSeverity.Warning,
					code: {
						value: name,
						target: vscode.Uri.parse(url)
					},
					source: "TorchTidy"
				};
				diagnostics.push(diagnostic);
			}
			diagnostics.sort((a, b) => a.range.start.line - b.range.start.line);
			diagnosticCollection.set(fileUri, diagnostics);
		}
	});
}