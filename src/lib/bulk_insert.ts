import { Course, ItemPrices, Level, Province } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export const Provinces: Province[] = [
  { name: "Luanda", id: 1, created_at: new Date(), update_at: new Date() },
  { name: "Benguela", id: 2, created_at: new Date(), update_at: new Date() },
  { name: "Huíla", id: 3, created_at: new Date(), update_at: new Date() },
  { name: "Namibe", id: 4, created_at: new Date(), update_at: new Date() },
  { name: "Kwanza Sul", id: 5, created_at: new Date(), update_at: new Date() },
  { name: "Kwanza Norte", id: 6, created_at: new Date(), update_at: new Date() },
  { name: "Malanje", id: 7, created_at: new Date(), update_at: new Date() },
  { name: "Lunda Sul", id: 8, created_at: new Date(), update_at: new Date() },
  { name: "Lunda Norte", id: 9, created_at: new Date(), update_at: new Date() },
  { name: "Moxico", id: 10, created_at: new Date(), update_at: new Date() },
  { name: "Cuando Cubango", id: 11, created_at: new Date(), update_at: new Date() },
  { name: "Zaire", id: 12, created_at: new Date(), update_at: new Date() },
  { name: "Uíge", id: 13, created_at: new Date(), update_at: new Date() },
  { name: "Cunene", id: 14, created_at: new Date(), update_at: new Date() },
  { name: "Bengo", id: 15, created_at: new Date(), update_at: new Date() },
  { name: "Cabinda", id: 16, created_at: new Date(), update_at: new Date() },
  { name: "Luanda Norte", id: 17, created_at: new Date(), update_at: new Date() },
  { name: "Luanda Sul", id: 18, created_at: new Date(), update_at: new Date() },
];

export const levels: Level[] = [
  { name: "CLASS_10", id: 1, created_at: new Date(), update_at: new Date() },
  { name: "CLASS_11", id: 2, created_at: new Date(), update_at: new Date() },
  { name: "CLASS_12", id: 3, created_at: new Date(), update_at: new Date() },
  { name: "CLASS_13", id: 4, created_at: new Date(), update_at: new Date() },
]
export const courses: Course[] = [
  { name: "Ensino Médio Geral", id: 1, created_at: new Date(), update_at: new Date() },
  { name: "Ciências Sociais", id: 2, created_at: new Date(), update_at: new Date() },
  { name: "Ciências Exatas", id: 3, created_at: new Date(), update_at: new Date() },
  { name: "Humanidades", id: 4, created_at: new Date(), update_at: new Date() },
  { name: "Curso Técnico em Informática", id: 5, created_at: new Date(), update_at: new Date() },
  { name: "Curso Técnico em Enfermagem", id: 6, created_at: new Date(), update_at: new Date() },
  { name: "Curso Técnico em Gestão", id: 7, created_at: new Date(), update_at: new Date() },
  { name: "Curso de Formação Profissional", id: 8, created_at: new Date(), update_at: new Date() },
  { name: "Curso de Artes", id: 9, created_at: new Date(), update_at: new Date() },
  { name: "Curso de Línguas Estrangeiras", id: 10, created_at: new Date(), update_at: new Date() },
];

export const itemPrices: ItemPrices[] = [
  {
    id: 1,
    itemName: "Propina",
    basePrice: new Decimal("15500"),
    levelId: 1,
    priceWithIva: new Decimal("15500"),
    ivaPercentage: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    itemName: "Confirmação",
    basePrice: new Decimal("8000"),
    levelId: 1,
    priceWithIva: new Decimal("8000"),
    ivaPercentage: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]
