const fs = require("fs");
const path = require("path");

const dir = __dirname;

for (const file of fs.readdirSync(dir)) {
  if (file.endsWith(".runtime.test.js") && file !== "index.runtime.test.js") {
    require(path.join(dir, file));
  }
}
