const ObserverClass = require("./modules/observers");

// init observer object
let Observer = new ObserverClass();

// define folder to watching. In project, we should put in file config or env
let targetFolder = "../laravel-example/storage/logs";
let targetFile = "../laravel-example/storage/logs/laravel.log";

// listen event new file has been added
Observer.on("new-file-has-been-added", logData => {
  // in this step, we can do anything we want like pushing alert message to chatwork or slack...
  console.log(logData.message);
});

Observer.on("file-has-been-updated", logData => {
  // in this step, we can do anything we want like pushing alert message to chatwork or slack...
  console.log(logData.message);
});

// start watching folder
// Observer.watchFolder(targetFolder);
Observer.watchFile(targetFile);
