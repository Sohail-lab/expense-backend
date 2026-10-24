import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./sql-loader.mjs", pathToFileURL("./"));