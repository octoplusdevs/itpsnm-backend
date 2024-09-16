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

// src/use-cases/file/get-file-by-id.ts
var get_file_by_id_exports = {};
__export(get_file_by_id_exports, {
  GetFileByIdUseCase: () => GetFileByIdUseCase
});
module.exports = __toCommonJS(get_file_by_id_exports);
var GetFileByIdUseCase = class {
  constructor(filesRepository) {
    this.filesRepository = filesRepository;
  }
  async execute({ id }) {
    const file = await this.filesRepository.findById(id);
    return file;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetFileByIdUseCase
});
