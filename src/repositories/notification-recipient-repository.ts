import { NotificationRecipient, Notification } from '@prisma/client'

export interface NotificationRecipientRepository {
  findAllByNotificationId(notificationId: number): Promise<Notification[]>;

  findByNotificationAndUser(notificationId: number, userId: number): Promise<Notification | null>;

  create(data: {
    notificationId: number;
    userId: number;
    seenAt?: Date;
    isResponsible?: boolean;
  }): Promise<NotificationRecipient>;

  markAsSeen(notificationId: number, userId: number): Promise<Notification | null>;

  findResponsibleByNotificationId(notificationId: number): Promise<Notification | null>;

  destroy(id: number): Promise<boolean>;
}
