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

// src/use-cases/province/destroy-province.ts
var destroy_province_exports = {};
__export(destroy_province_exports, {
  DestroyProvinceUseCase: () => DestroyProvinceUseCase
});
module.exports = __toCommonJS(destroy_province_exports);

// src/use-cases/errors/province-not-found.ts
var ProvinceNotFoundError = class extends Error {
  constructor() {
    super("Province not found.");
  }
};

// src/use-cases/province/destroy-province.ts
var DestroyProvinceUseCase = class {
  constructor(provincesRepository) {
    this.provincesRepository = provincesRepository;
  }
  async execute({
    id
  }) {
    let findProvince = await this.provincesRepository.findById(id);
    if (!findProvince) {
      throw new ProvinceNotFoundError();
    }
    return await this.provincesRepository.destroy(
      id
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DestroyProvinceUseCase
});
