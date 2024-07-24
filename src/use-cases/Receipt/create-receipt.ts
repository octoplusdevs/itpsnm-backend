import { ReceiptsRepository } from "@/repositories/receipt-repository";
import { Receipt } from "@prisma/client";

interface CreateReceiptRequest {
  tuition_id: number;
  path: string;
  payment_id: number;
}

export class CreateReceiptUseCase {
  constructor(private receiptsRepository: ReceiptsRepository) { }

  async execute(request: CreateReceiptRequest): Promise<Receipt> {
    const { tuition_id, path, payment_id } = request;

    const receipt = await this.receiptsRepository.create({
      tuition_id,
      path,
      payment_id
    });

    return receipt;
  }
}
