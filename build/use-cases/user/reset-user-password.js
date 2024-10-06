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

// src/use-cases/user/reset-user-password.ts
var reset_user_password_exports = {};
__export(reset_user_password_exports, {
  ResetUserPasswordUseCase: () => ResetUserPasswordUseCase
});
module.exports = __toCommonJS(reset_user_password_exports);

// src/use-cases/errors/user-is-invalid-error.ts
var UserInvalidError = class extends Error {
  constructor() {
    super("User is invalid.");
  }
};

// src/use-cases/user/reset-user-password.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var ResetUserPasswordUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email,
    password
  }) {
    let findUser = await this.usersRepository.findByEmail(email);
    if (!findUser) {
      throw new UserInvalidError();
    }
    let newHashedPassword = await import_bcryptjs.default.hash(password, 10);
    await this.usersRepository.resetUserPassword(findUser.id, newHashedPassword);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ResetUserPasswordUseCase
});
