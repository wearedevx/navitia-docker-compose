/**
 * Script to create a JSON file out of an extracted GTFS/NTFS
 * Zip file
 *
 * The JSON ouput can then
 */

const path = require("path");
const fs = require("fs");

const dirName = process.argv[2];

if (!dirName) {
  console.log("Expected a path to a directory as parameter");

  process.exit(1);
}

const dirToRead = path.resolve(__dirname, dirName);
const files = fs.readdirSync(dirToRead);

let result = {};

files.forEach(file => {
  const filename = path.basename(file);

  const content = fs.readFileSync(path.join(dirToRead, file));

  result[filename] = content.toString("utf-8");
});

console.log(JSON.stringify(result, null, 4));
