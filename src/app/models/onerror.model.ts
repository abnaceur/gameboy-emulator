export class onerror {
    myErrorHandler(errorMsg, url, lineNumber) {
        alert(errorMsg + " on line " + lineNumber);
    }
}
