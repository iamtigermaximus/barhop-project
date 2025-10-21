import { NotificationType, HopInStatus } from "@prisma/client";

export interface NotificationData {
  id: string;
  userId: string;
  type: NotificationType;
  fromUserId: string;
  message?: string;
  barId?: string;
  read: boolean;
  createdAt: Date;
  hopInId?: string;
  meetupId?: string;
  fromUser?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  hopIn?: {
    id: string;
    barId?: string;
    bar?: {
      id: string;
      name: string;
    };
    status: HopInStatus;
  };
}

export interface HopInRequestData {
  fromUserId: string;
  toUserId: string;
  barId?: string;
  message?: string;
}

export interface WaveRequestData {
  fromUserId: string;
  toUserId: string;
}

export interface HopInResponseData {
  hopInId: string;
  status: "ACCEPTED" | "DECLINED";
  userId: string;
}

export interface NotificationsResponse {
  notifications: NotificationData[];
  unreadCount: number;
  total: number;
}
