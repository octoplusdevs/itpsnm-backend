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

// src/use-cases/county/create-county.ts
var create_county_exports = {};
__export(create_county_exports, {
  CreateCountyUseCase: () => CreateCountyUseCase
});
module.exports = __toCommonJS(create_county_exports);

// src/use-cases/errors/county-already-exists-error.ts
var CountyAlreadyExistsError = class extends Error {
  constructor() {
    super("County already exists.");
  }
};

// src/use-cases/county/create-county.ts
var CreateCountyUseCase = class {
  constructor(countyRepository) {
    this.countyRepository = countyRepository;
  }
  async execute({
    name
  }) {
    const findCounty = await this.countyRepository.findByName(name);
    if (findCounty) {
      throw new CountyAlreadyExistsError();
    }
    const province = await this.countyRepository.create({
      name
    });
    return {
      province
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateCountyUseCase
});
