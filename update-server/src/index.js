const path = require("path");
const os = require("os");
const fs = require("fs");
const uuid = require("uuid").v4;
const rmrf = require("rimraf");

const archiver = require("archiver");

const { execSync } = require("child_process");

const { readDataDir } = require("./baseData");

const { TYR_DATABASE_FILE } = process.env;

const Readable = require("stream").Readable;

function ReadableFromString(string) {
  const s = new Readable();
  s._read = () => {}; // redundant? see update below
  s.push(string);
  s.push(null);

  return s;
}

async function mergeDatasets(base, files) {
  const tempDir = path.join(os.tmpdir(), uuid());
  fs.mkdirSync(tempDir);
  const keys = Object.keys(base);

  Object.keys(files).forEach(filename => {
    if (!keys.includes(filename)) {
      keys.push(filename);
    }
  });

  console.debug("Keys in datasets:", keys);

  const promises = keys.map(
    key =>
      new Promise((resolve, reject) => {
        try {
          const fileToWrite = path.join(tempDir, key);
          const w = fs.createWriteStream(fileToWrite, { flags: "a" });
          console.debug("Will write", fileToWrite);

          if (base[key]) {
            const fileToAppendTo = base[key];
            console.debug("Will read", fileToAppendTo);
            const original = fs.createReadStream(fileToAppendTo);

            original.pipe(w, { end: false });

            original.on("end", () => {
              if (files[key]) {
                // remove the csv header
                const values = files[key].split("\n");
                values.shift();

                ReadableFromString(values.join("\n")).pipe(w);
              } else {
                w.end();
              }
            });
          } else {
            ReadableFromString(files[key]).pipe(w);
          }

          w.on("close", function() {
            console.debug("written", key, "to", fileToWrite);
            resolve();
          });

          w.on("error", function(error) {
            reject(error);
          });
        } catch (err) {
          console.debug("Something wrong Happend with", key);
          console.error(err);

          reject(err);
        }
      })
  );

  await Promise.all(promises);

  return tempDir;
}

function zip(tempDir, archivePath) {
  console.debug("Ziping", tempDir, "into", archivePath);
  execSync(`zip -j -r ${archivePath} ${tempDir}/*`);

  // rmrf(tempDir);
}

/**
 * Creates a zip archive
 * @param {Object<string, string>} baseData Base Navitia NTFS data (Bus and train networks)
 * @param {string} archivePath where to archive will be written to
 * @param {Object<string, string>} files An object containing the files to archive. Keys are filenames, Values are file content as string
 * @return {Promise<undefined, Error>}
 */
async function createZip(baseData, archivePath, files) {
  return new Promise((_resolve, reject) => {
    // Create the actual file on fs
    // let output;
    // try {
    //   output = fs.createWriteStream(archivePath);
    // } catch (err) {
    //   const error = new Error("Failed to create zip file");
    //   error.code = "ARCHIVE_FILE_CREATE_FAILED";
    //   error.source = err;
    //   reject(error);
    // }

    // const archive = archiver("zip");

    // // Archiving ended
    // output.on("close", () => {
    //   resolve();
    // });

    // // Error handling
    // archive.on("error", err => {
    //   const error = new Error("Error writing archive");
    //   error.code = "ARCHIVE_WRITE_ERROR";
    //   error.source = err;
    //   reject(error);
    // });

    // // will send archive content to the filee
    // archive.pipe(output);

    try {
      mergeDatasets(baseData, files)
        .then(t => zip(t, archivePath))
        .catch(err => {
          console.error(err);
          const error = new Error("Failed to create zip file");
          error.code = "ARCHIVE_FILE_CREATE_FAILED";
          error.source = err;
          reject(error);
        });
    } catch (err) {
      console.error(err);
      const error = new Error("Failed to create zip file");
      error.code = "ARCHIVE_FILE_CREATE_FAILED";
      error.source = err;
      reject(error);
    }

    // tempFiles.forEach(([name, tmpPath]) => {
    //   archive.file(tmpPath, { name });
    // });

    // // Object.entries(mergeDatasets(baseData, files)).forEach(
    // //   ([filename, content]) => {
    // //     // console.debug("Appending file", filename, content);
    // //     archive.append(content, { name: filename });
    // //   }
    // // );

    // archive.finalize();

    // tempFiles.remove();
  });
}

/**
 * Request handler
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @return {Promise<>}
 */
module.exports = async function(req, res) {
  // const tempDir = getTempDir();
  const baseData = await readDataDir();

  const archivePath = path.join(
    TYR_DATABASE_FILE,
    "input",
    "default",
    uuid() + ".zip"
  );

  // Creates the archive in a temporary directory
  try {
    createZip(baseData, archivePath, req.body);
  } catch (err) {
    switch (err.code) {
      case "ARCHIVE_FILE_CREATE_FAILED":
        res.status(500).send({
          success: false,
          reason: "La création de l'archive a échoué",
          error: err
        });
        return;

      case "ARCHIVE_WRITE_ERROR":
        res.status(500).send({
          success: false,
          reason: "Erreur pendant l'écriture dans l'archive",
          error: err
        });
        return;

      default:
        res.status(500).send({
          success: false,
          reason: "Une erreur inconnue est survenue",
          error: err
        });
        return;
    }
  }

  return res.status(200).send({
    success: true
  });
};
