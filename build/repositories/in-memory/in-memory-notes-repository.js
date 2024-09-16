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

// src/repositories/in-memory/in-memory-notes-repository.ts
var in_memory_notes_repository_exports = {};
__export(in_memory_notes_repository_exports, {
  InMemoryNotesRepository: () => InMemoryNotesRepository
});
module.exports = __toCommonJS(in_memory_notes_repository_exports);
var import_crypto = require("crypto");
var InMemoryNotesRepository = class {
  constructor() {
    this.items = [];
  }
  async addNote(data) {
    const note = {
      id: data.id ?? (0, import_crypto.randomInt)(99999),
      pf1: data.pf1 ?? 0,
      pf2: data.pf2 ?? 0,
      pft: data.pft ?? 0,
      nee: data.nee ?? 0,
      resource: data.resource ?? 0,
      level: data.level,
      enrollmentId: data.enrollmentId,
      subjectId: data.subjectId,
      created_at: /* @__PURE__ */ new Date(),
      update_at: /* @__PURE__ */ new Date(),
      ps1: data.ps1 ?? 0,
      ps2: data.ps2 ?? 0,
      pst: data.pst ?? 0,
      pt1: data.pt1 ?? 0,
      pt2: data.pt2 ?? 0,
      ptt: data.ptt ?? 0,
      mt1: null,
      mt2: null,
      mt3: null,
      mf: null,
      mfd: null
    };
    this.items.push(note);
    return note;
  }
  async update(id, data) {
    const findNoteIndex = this.items.findIndex((item) => item.id === id);
    if (findNoteIndex === -1) {
      return null;
    }
    const updatedNote = {
      ...this.items[findNoteIndex],
      id,
      pf1: data.pf1 ?? this.items[findNoteIndex].pf1,
      pf2: data.pf2 ?? this.items[findNoteIndex].pf2,
      pft: data.pft ?? this.items[findNoteIndex].pft,
      ps1: data.pf1 ?? this.items[findNoteIndex].ps1,
      ps2: data.pf2 ?? this.items[findNoteIndex].ps2,
      pst: data.pft ?? this.items[findNoteIndex].pst,
      pt1: data.pf1 ?? this.items[findNoteIndex].pt1,
      pt2: data.pf2 ?? this.items[findNoteIndex].pt2,
      ptt: data.pft ?? this.items[findNoteIndex].ptt,
      nee: data.nee ?? this.items[findNoteIndex].nee,
      resource: data.resource ?? this.items[findNoteIndex].resource,
      level: data.level ?? this.items[findNoteIndex].level,
      enrollmentId: data.enrollmentId ?? this.items[findNoteIndex].enrollmentId,
      subjectId: data.subjectId ?? this.items[findNoteIndex].subjectId,
      update_at: /* @__PURE__ */ new Date()
    };
    this.items[findNoteIndex] = updatedNote;
    return updatedNote;
  }
  async destroy(id) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
  async searchMany(criteria) {
    return this.items.filter((note) => {
      return Object.entries(criteria).every(([key, value]) => {
        return note[key] === value;
      });
    });
  }
  async getNoteWithFullGrades(criteria) {
    const note = this.items.find((note2) => {
      return Object.entries(criteria).every(([key, value]) => {
        return note2[key] === value;
      });
    });
    if (!note)
      return null;
    return {
      ...note
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryNotesRepository
});
