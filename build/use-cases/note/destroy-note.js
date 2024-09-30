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

// src/use-cases/note/destroy-note.ts
var destroy_note_exports = {};
__export(destroy_note_exports, {
  DestroyNoteUseCase: () => DestroyNoteUseCase
});
module.exports = __toCommonJS(destroy_note_exports);
var DestroyNoteUseCase = class {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }
  async execute({
    id
  }) {
    const success = await this.notesRepository.destroy(id);
    return {
      success
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DestroyNoteUseCase
});
