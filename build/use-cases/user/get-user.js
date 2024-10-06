"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-cases/user/get-user.ts
var get_user_exports = {};
__export(get_user_exports, {
  GetUserUseCase: () => GetUserUseCase
});
module.exports = __toCommonJS(get_user_exports);

// src/use-cases/errors/user-not-found.ts
var UserNotFoundError = class extends Error {
  constructor() {
    super("User not found.");
  }
};

// src/use-cases/user/get-user.ts
var GetUserUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email
  }) {
    const user = await this.usersRepository.findByEmail(
      email
    );
    if (!user) {
      throw new UserNotFoundError();
    }
    delete user.password;
    return {
      user
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetUserUseCase
});
