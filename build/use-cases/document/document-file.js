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

// src/use-cases/document/document-file.ts
var document_file_exports = {};
__export(document_file_exports, {
  CreateDocumentUseCase: () => CreateDocumentUseCase
});
module.exports = __toCommonJS(document_file_exports);
var CreateDocumentUseCase = class {
  constructor(documentsRepository) {
    this.documentsRepository = documentsRepository;
  }
  async execute({
    enrollment_id,
    created_at,
    id,
    update_at
  }) {
    const document = await this.documentsRepository.create({
      enrollment_id,
      created_at,
      id,
      update_at
    });
    return {
      document
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateDocumentUseCase
});
