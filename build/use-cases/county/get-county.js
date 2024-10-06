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

// src/use-cases/county/get-county.ts
var get_county_exports = {};
__export(get_county_exports, {
  GetCountyUseCase: () => GetCountyUseCase
});
module.exports = __toCommonJS(get_county_exports);

// src/use-cases/errors/county-not-found.ts
var CountyNotFoundError = class extends Error {
  constructor() {
    super("County not found.");
  }
};

// src/use-cases/county/get-county.ts
var GetCountyUseCase = class {
  constructor(countyRepository) {
    this.countyRepository = countyRepository;
  }
  async execute({
    countyId
  }) {
    const county = await this.countyRepository.findById(
      countyId
    );
    if (!county) {
      throw new CountyNotFoundError();
    }
    return {
      county
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetCountyUseCase
});
