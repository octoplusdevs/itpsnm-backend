import { Notification, NotificationStatus } from '@prisma/client'

export interface NotificationRepository {
  create(data: {
    title: string;
    message: string;
    paymentId: number;
  }): Promise<Notification>;

  searchMany(query: string, page: number): Promise<{
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: Notification[];
  }>

  findById(id: string): Promise<Notification | null>;

  updateStatus(id: string, status: NotificationStatus): Promise<Notification | null>;

  destroy(id: string): Promise<boolean>;
}
