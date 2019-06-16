// muTS note:
// This file is NOT a part of muTS.
// It's used to load AMDModules version of the code for demo page (index.html)

requirejs (["AMDModules/bin/Mu.js"], function (_mu) {
    let Mu = _mu.default.prototype.constructor;
    
    // Hook up events once everyting has loaded
    let FileInputElement = document.getElementById ("fileInput");
    
    document.getElementById ("parseFile").addEventListener ("click", () => {
        if (FileInputElement.files.length < 1) {
            console.log ("No file was selected");
            return;
        }
        
        let reader = new FileReader();
        
        reader.onload = () => {
            console.log ("Result:", new Mu (new Uint8Array (reader.result)));
        }
        
        reader.readAsArrayBuffer (FileInputElement.files[0]);
    });
});