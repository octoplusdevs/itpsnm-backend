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

// src/repositories/in-memory/in-memory-check-ins-repository.ts
var in_memory_check_ins_repository_exports = {};
__export(in_memory_check_ins_repository_exports, {
  InMemoryCheckInsRepository: () => InMemoryCheckInsRepository
});
module.exports = __toCommonJS(in_memory_check_ins_repository_exports);
var import_dayjs = __toESM(require("dayjs"));
var import_node_crypto = require("crypto");
var InMemoryCheckInsRepository = class {
  constructor() {
    this.items = [];
  }
  async save(checkIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);
    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn;
    }
    return checkIn;
  }
  async findById(id) {
    const checkIn = this.items.find((item) => item.id === id);
    if (!checkIn) {
      return null;
    }
    return checkIn;
  }
  async findByUserIdOnDate(userId, date) {
    const startOfTheDay = (0, import_dayjs.default)(date).startOf("date");
    const endOfTheDay = (0, import_dayjs.default)(date).endOf("date");
    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = (0, import_dayjs.default)(checkIn.created_at);
      const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
      return checkIn.user_id === userId && isOnSameDate;
    });
    if (!checkInOnSameDate) {
      return null;
    }
    return checkInOnSameDate;
  }
  async findManyByUserId(userId, page) {
    return this.items.filter((checkIn) => checkIn.user_id === userId).slice((page - 1) * 20, page * 20);
  }
  async countByUserId(userId) {
    return this.items.filter((checkIn) => checkIn.user_id === userId).length;
  }
  async create(data) {
    const checkIn = {
      id: (0, import_node_crypto.randomUUID)(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: /* @__PURE__ */ new Date()
    };
    this.items.push(checkIn);
    return checkIn;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryCheckInsRepository
});
