"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import { Link } from "react-router";
import { useNotifications } from "../context/NotificationContext";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const { unreadMessages, markAsRead, clearAllNotifications } =
    useNotifications();

  const { data: friendRequests, isLoading: loadingFriendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  const isLoading = loadingFriendRequests;
  const hasNotifications =
    incomingRequests.length > 0 ||
    acceptedRequests.length > 0 ||
    unreadMessages.length > 0;

  return (
    <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
      <div className="container mx-auto max-w-4xl space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Notifications
          </h1>
          {unreadMessages.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="btn btn-outline btn-sm w-full sm:w-auto"
            >
              Clear All Messages
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8 sm:py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* UNREAD MESSAGES SECTION */}
            {unreadMessages.length > 0 && (
              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <MessageSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  <span>Unread Messages</span>
                  <span className="badge badge-primary text-xs">
                    {unreadMessages.length}
                  </span>
                </h2>

                <div className="space-y-2 sm:space-y-3">
                  {unreadMessages.map((messageData) => (
                    <div
                      key={messageData.id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-base-300 flex-shrink-0">
                              <img
                                src={
                                  messageData.senderImage || "/placeholder.svg"
                                }
                                alt={messageData.senderName || "User"}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm sm:text-base truncate">
                                {messageData.senderName || "Unknown User"}
                              </h3>
                              <p className="text-xs sm:text-sm opacity-70 truncate">
                                {messageData.message || "New message"}
                              </p>
                              <p className="text-xs opacity-50 mt-1">
                                {new Date(
                                  messageData.timestamp
                                ).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            <Link
                              to={`/chat/${messageData.senderId}`}
                              className="btn btn-primary btn-sm flex-1 sm:flex-none"
                              onClick={() => markAsRead(messageData.channelId)}
                            >
                              View Chat
                            </Link>
                            <button
                              onClick={() => markAsRead(messageData.channelId)}
                              className="btn btn-ghost btn-sm flex-1 sm:flex-none"
                            >
                              Mark Read
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FRIEND REQUESTS SECTION */}
            {incomingRequests.length > 0 && (
              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span>Friend Requests</span>
                  <span className="badge badge-primary text-xs">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-2 sm:space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-base-300 flex-shrink-0">
                              <img
                                src={
                                  request.sender.profilePic ||
                                  "/placeholder.svg"
                                }
                                alt={request.sender.fullName}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm sm:text-base truncate">
                                {request.sender.fullName}
                              </h3>
                              <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm text-xs">
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm text-xs">
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm w-full sm:w-auto"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQUESTS NOTIFICATIONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
                  <span>New Connections</span>
                </h2>

                <div className="space-y-2 sm:space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-8 sm:size-10 rounded-full flex-shrink-0">
                            <img
                              src={
                                notification.recipient.profilePic ||
                                "/placeholder.svg"
                              }
                              alt={notification.recipient.fullName}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base">
                              {notification.recipient.fullName}
                            </h3>
                            <p className="text-xs sm:text-sm my-1">
                              {notification.recipient.fullName} accepted your
                              friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success text-xs">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!hasNotifications && <NoNotificationsFound />}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
