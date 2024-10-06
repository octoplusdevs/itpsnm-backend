"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-cases/authenticate/authenticate.ts
var authenticate_exports = {};
__export(authenticate_exports, {
  LoginUseCase: () => LoginUseCase
});
module.exports = __toCommonJS(authenticate_exports);
var import_client = require("@prisma/client");
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var LoginUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
    this.jwtSecret = process.env.JWT_SECRET;
    this.ATTEMPT_LIMIT = 5;
  }
  async execute({ email, password }) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      return {
        success: false,
        message: "User not found"
      };
    }
    console.log({
      password,
      t: user
    });
    const passwordMatches = await import_bcryptjs.default.compare(password, user.password);
    if (!passwordMatches) {
      let newAttemptCount = user.loginAttempt + 1;
      await this.usersRepository.updateLoginAttempt(user.id, newAttemptCount);
      await this.usersRepository.logAccess(user.id, import_client.AccessStatus.FAILURE);
      if (newAttemptCount >= this.ATTEMPT_LIMIT) {
        await this.usersRepository.blockUser(user.id, true);
        return {
          success: false,
          message: "Account blocked due to multiple failed login attempts."
        };
      }
      return {
        success: false,
        message: "Invalid credentials."
      };
    }
    if (user.isBlocked) {
      return {
        success: false,
        message: "Account is blocked. Please contact support."
      };
    }
    if (!user.isActive) {
      return {
        success: false,
        message: "Account is not active. Please contact support."
      };
    }
    await this.usersRepository.updateLoginAttempt(user.id, 0);
    await this.usersRepository.logAccess(user.id, import_client.AccessStatus.SUCCESS);
    const token = import_jsonwebtoken.default.sign(
      { userId: user.id, role: user.role },
      this.jwtSecret,
      { expiresIn: "1h" }
      // Token expira em 1 hora
    );
    return {
      success: true,
      message: "Login successful",
      userId: user.id,
      role: user.role,
      token
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LoginUseCase
});
