const chokidar = require("chokidar");
const EventEmitter = require("events").EventEmitter;
const fsExtra = require("fs-extra");
const readLastLines = require("read-last-lines");

let debug = console.log.bind(console);

class Observer extends EventEmitter {
  constructor() {
    super();
  }

  watchFolder(targetFolder) {
    try {
      debug(
        `[${new Date().toLocaleDateString()}] Watching for folder changes on: ${targetFolder}`
      );

      // initialize watcher
      let watcher = chokidar.watch(targetFolder, { persistent: true });

      // listen when a file has been added
      watcher.on("add", async filePath => {
        // if the new file's name is exactly error.log
        if (filePath.includes("error.log")) {
          debug(
            `[${new Date().toLocaleDateString()}] ${filePath} has been added.`
          );

          // read the content of new file
          let fileContent = await fsExtra.readFile(filePath);

          // emit an event when new file has been added
          this.emit("new-file-has-been-added", {
            message: fileContent.toString()
          });

          // remove the file error.log
          await fsExtra.unlink(filePath);
          debug(
            `[${new Date().toLocaleDateString()}] ${filePath} has been removed.`
          );
        }
      });
    } catch (error) {
      debug(error.toString());
    }
  }

  watchFile(targetFile) {
    try {
      debug(
        `[${new Date().toLocaleDateString()}] Watching for file changes on: ${targetFile}`
      );

      // initialize watcher
      let watcher = chokidar.watch(targetFile, { persistent: true });

      watcher.on("change", async filePath => {
        debug(
          `[${new Date().toLocaleDateString()}] ${filePath} has been updated`
        );

        // get content of file, in this case is the newest line
        let updateContent = await readLastLines.read(filePath, 1);

        // emit an event when the file has been updated
        this.emit("file-has-been-updated", {
          message: updateContent.toString()
        });
      });
    } catch (error) {
      debug(error.toString());
    }
  }
}

module.exports = Observer;
