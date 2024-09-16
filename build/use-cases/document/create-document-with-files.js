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

// src/use-cases/document/create-document-with-files.ts
var create_document_with_files_exports = {};
__export(create_document_with_files_exports, {
  CreateDocumentWithFilesUseCase: () => CreateDocumentWithFilesUseCase
});
module.exports = __toCommonJS(create_document_with_files_exports);

// src/use-cases/errors/enrollment-not-found.ts
var EnrollmentNotFoundError = class extends Error {
  constructor() {
    super("Enrollment not found.");
  }
};

// src/use-cases/document/create-document-with-files.ts
var CreateDocumentWithFilesUseCase = class {
  constructor(documentRepository, fileRepository, enrollmentRepository) {
    this.documentRepository = documentRepository;
    this.fileRepository = fileRepository;
    this.enrollmentRepository = enrollmentRepository;
  }
  async execute(request) {
    const { enrollmentId, files } = request;
    const findEnrollment = await this.enrollmentRepository.checkStatus(enrollmentId);
    if (findEnrollment === null || !findEnrollment) {
      throw new EnrollmentNotFoundError();
    }
    const document = await this.documentRepository.create({ enrollmentId });
    const createdFiles = await Promise.all(files.map(
      (file) => this.fileRepository.create({
        ...file,
        documentId: document.id,
        identityCardNumber: findEnrollment.identityCardNumber
      })
    ));
    return {
      document,
      files: createdFiles
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateDocumentWithFilesUseCase
});
