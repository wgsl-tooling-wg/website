import { stripTypeScriptTypes } from "node:module";

export default (tsSource) =>
  stripTypeScriptTypes(Buffer.from(tsSource).toString());
