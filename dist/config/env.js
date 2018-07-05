"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const all_1 = require("./env/all");
const development_1 = require("./env/development");
const local_1 = require("./env/local");
const production_1 = require("./env/production");
exports.Env = _.extend(
  all_1.default,
  production_1.default,
  local_1.default,
  development_1.default
);
