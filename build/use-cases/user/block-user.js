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

// src/use-cases/user/block-user.ts
var block_user_exports = {};
__export(block_user_exports, {
  BlockUserUseCase: () => BlockUserUseCase
});
module.exports = __toCommonJS(block_user_exports);

// src/use-cases/errors/user-is-invalid-error.ts
var UserInvalidError = class extends Error {
  constructor() {
    super("User is invalid.");
  }
};

// src/use-cases/user/block-user.ts
var BlockUserUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email,
    status
  }) {
    let findUser = await this.usersRepository.findByEmail(email);
    if (!findUser) {
      throw new UserInvalidError();
    }
    await this.usersRepository.blockUser(findUser.id, status);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockUserUseCase
});
