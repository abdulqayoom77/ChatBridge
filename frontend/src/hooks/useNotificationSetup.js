"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { StreamChat } from "stream-chat";
import useAuthUser from "./useAuthUser";
import { useNotificationStore } from "../store/useNotificationStore";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const useNotificationSetup = () => {
  const { authUser } = useAuthUser();
  const { addNotification, setConnected } = useNotificationStore();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let client = null;

    const setupNotifications = async () => {
      if (!tokenData?.token || !authUser) {
        return;
      }

      try {
        client = new StreamChat(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        setConnected(true);

        client.on("message.new", (event) => {
          if (event.user?.id && event.user.id !== authUser._id) {
            const notification = {
              id: event.message.id,
              channelId: event.cid || event.channel_id || "unknown",
              senderId: event.user.id,
              senderName: event.user.name || "Unknown User",
              senderImage: event.user.image || "/placeholder.svg",
              message: event.message.text || "New message",
              timestamp: event.message.created_at,
            };

            addNotification(notification);
          }
        });

        const filter = { members: { $in: [authUser._id] } };
        await client.queryChannels(filter, {}, { watch: true });
      } catch (error) {
        console.error("Error setting up notifications:", error);
        setConnected(false);
      }
    };

    setupNotifications();

    return () => {
      if (client) {
        client.disconnectUser();
        setConnected(false);
      }
    };
  }, [tokenData, authUser, addNotification, setConnected]);
};
