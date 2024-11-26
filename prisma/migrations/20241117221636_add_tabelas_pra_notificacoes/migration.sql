-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationRecipient" (
    "id" SERIAL NOT NULL,
    "notificationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "seenAt" TIMESTAMP(3),
    "isResponsible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NotificationRecipient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRecipient" ADD CONSTRAINT "NotificationRecipient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRecipient" ADD CONSTRAINT "NotificationRecipient_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
