const path = require("path");

function readPackage(pkg) {
  if (process.env.LOCAL_DEPS) {
    const base = process.env.LOCAL_DEPS === "1"
      ? path.resolve(__dirname, "../wesl-js")
      : path.resolve(process.env.LOCAL_DEPS);
    const toolsPkgs = path.join(base, "packages");
    pkg.dependencies = {
      ...pkg.dependencies,
      "wesl-plugin": `link:${toolsPkgs}/wesl-plugin`,
      "wgsl-edit": `link:${toolsPkgs}/wgsl-edit`,
      "wgsl-play": `link:${toolsPkgs}/wgsl-play`,
    };
  }
  return pkg;
}

module.exports = { hooks: { readPackage } };
