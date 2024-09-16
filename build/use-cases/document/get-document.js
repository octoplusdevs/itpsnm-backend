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

// src/use-cases/document/get-document.ts
var get_document_exports = {};
__export(get_document_exports, {
  GetDocumentUseCase: () => GetDocumentUseCase
});
module.exports = __toCommonJS(get_document_exports);

// src/use-cases/errors/resource-not-found.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found.");
  }
};

// src/use-cases/document/get-document.ts
var GetDocumentUseCase = class {
  constructor(documentsRepository) {
    this.documentsRepository = documentsRepository;
  }
  async execute({
    documentId
  }) {
    const document = await this.documentsRepository.findById(
      documentId
    );
    if (!document) {
      throw new ResourceNotFoundError();
    }
    return {
      document
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetDocumentUseCase
});
