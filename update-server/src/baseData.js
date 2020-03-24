const fs = require("fs");
const path = require("path");

const readBaseData = () => {
  const baseDataPath = path.resolve(__dirname, "..", "navitia-base-data");

  return new Promise((resolve, reject) => {
    fs.readdir(baseDataPath, (err, files) => {
      if (err) return reject(err);

      const dataPromises = files.map(file => {
        const fullPath = path.join(baseDataPath, file);

        return new Promise((resolve, reject) => {
          console.debug("read base data from", fullPath);

          fs.readFile(fullPath, (err, data) => {
            if (err) return reject(err);

            resolve(data.toString("utf8") + "\n");
          });
        });
      });

      Promise.all(dataPromises).then(contents => {
        const baseData = contents.reduce((acc, content, idx) => {
          const filename = files[idx];

          acc[filename] = content;

          return acc;
        }, {});

        resolve(baseData);
      });
    });
  });
};

readDataDir = () => {
  const baseDataPath = path.resolve(__dirname, "..", "navitia-base-data");

  return new Promise((resolve, reject) => {
    fs.readdir(baseDataPath, (err, files) => {
      if (err) return reject(err);

      const fullPaths = files.reduce((acc, file) => {
        acc[file] = path.join(baseDataPath, file);

        return acc;
      }, {});

      resolve(fullPaths);
    });
  });
};

module.exports = {
  readBaseData,
  readDataDir
};
