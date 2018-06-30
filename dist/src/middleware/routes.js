"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_router_1 = require("../routers/core.router");
const user_router_1 = require("../routers/user.router");
exports.Routes = [user_router_1.userRouter, core_router_1.coreRouter];
