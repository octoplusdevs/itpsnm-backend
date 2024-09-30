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

// src/use-cases/province/create-province.ts
var create_province_exports = {};
__export(create_province_exports, {
  CreateProvinceUseCase: () => CreateProvinceUseCase
});
module.exports = __toCommonJS(create_province_exports);

// src/use-cases/errors/province-already-exists-error.ts
var ProvinceAlreadyExistsError = class extends Error {
  constructor() {
    super("Province already exists.");
  }
};

// src/use-cases/province/create-province.ts
var CreateProvinceUseCase = class {
  constructor(provincesRepository) {
    this.provincesRepository = provincesRepository;
  }
  async execute({
    name
  }) {
    const findProvince = await this.provincesRepository.findByName(name);
    if (findProvince) {
      throw new ProvinceAlreadyExistsError();
    }
    const province = await this.provincesRepository.create({
      name
    });
    return {
      province
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateProvinceUseCase
});
