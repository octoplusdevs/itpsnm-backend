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

// src/use-cases/county/destroy-county.ts
var destroy_county_exports = {};
__export(destroy_county_exports, {
  DestroyCountyUseCase: () => DestroyCountyUseCase
});
module.exports = __toCommonJS(destroy_county_exports);

// src/use-cases/errors/county-not-found.ts
var CountyNotFoundError = class extends Error {
  constructor() {
    super("County not found.");
  }
};

// src/use-cases/county/destroy-county.ts
var DestroyCountyUseCase = class {
  constructor(countiesRepository) {
    this.countiesRepository = countiesRepository;
  }
  async execute({
    id
  }) {
    let findCounty = await this.countiesRepository.findById(id);
    if (!findCounty) {
      throw new CountyNotFoundError();
    }
    return await this.countiesRepository.destroy(
      id
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DestroyCountyUseCase
});
