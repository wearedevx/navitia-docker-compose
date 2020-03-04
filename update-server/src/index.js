const path = require("path");
const os = require("os");
const fs = require("fs");
const uuid = require("uuid").v4;

const archiver = require("archiver");

const { TYR_DATABASE_FILE } = process.env;

/**
 * Creates a zip archive
 * @param {string} archivePath where to archive will be written to
 * @param {Object<string, string>} files An object containing the files to archive. Keys are filenames, Values are file content as string
 * @return {Promise<undefined, Error>}
 */
async function createZip(archivePath, files) {
  return new Promise((resolve, reject) => {
    // Create the actual file on fs
    let output;
    try {
      output = fs.createWriteStream(archivePath);
    } catch (err) {
      const error = new Error("Failed to create zip file");
      error.code = "ARCHIVE_FILE_CREATE_FAILED";
      error.source = err;
      reject(error);
    }

    const archive = archiver("zip");

    // Archiving ended
    output.on("close", () => {
      resolve();
    });

    // Error handling
    archive.on("error", err => {
      const error = new Error("Error writing archive");
      error.code = "ARCHIVE_WRITE_ERROR";
      error.source = err;
      reject(error);
    });

    // will send archive content to the filee
    archive.pipe(output);

    Object.entries(files).forEach(([filename, content]) => {
      console.debug("Appending file", filename, content);
      archive.append(content, { name: filename });
    });

    archive.finalize();
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

  const archivePath = path.join(
    TYR_DATABASE_FILE,
    "input",
    "default",
    uuid() + ".zip"
  );

  // Creates the archive in a temporary directory
  try {
    createZip(archivePath, req.body);
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
