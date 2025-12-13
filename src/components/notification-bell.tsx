"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, X, ExternalLink, CheckCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getPusherClient, CHANNELS } from "@/lib/pusher-client";
import type { Notification } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  initialNotifications?: Notification[];
  initialUnreadCount?: number;
}

export function NotificationBell({
  initialNotifications = [],
  initialUnreadCount = 0,
}: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const bellRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(CHANNELS.RESULTS);

    channel.bind("notification-created", (data: { notification: Notification }) => {
      setNotifications((prev) => [data.notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(data.notification.title, {
          body: data.notification.message,
          icon: "/icon-192x192.png",
          badge: "/icon-96x96.png",
        });
      }
    });

    return () => {
      channel.unbind("notification-created");
      pusher.unsubscribe(CHANNELS.RESULTS);
    };
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleNotificationClick = useCallback(async (notification: Notification) => {
    router.push(`/results/${notification.programId}`);
    setIsOpen(false);

    if (!notification.read) {
      try {
        await fetch(`/api/notifications/${notification.id}/read`, {
          method: "POST",
        });
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  }, [router]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await fetch("/api/notifications/read-all", {
        method: "POST",
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }, []);

  return (
    <div className="relative">
      <motion.button
        ref={bellRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-3 rounded-2xl transition-all duration-300",
          "bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl",
          "shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/30",
          "hover:shadow-[0_8px_30px_rgba(139,69,19,0.15)] hover:border-[#8B4513]/20",
          isOpen && "bg-gradient-to-br from-[#8B4513]/10 to-[#A0522D]/5 ring-2 ring-[#8B4513]/20"
        )}
        aria-label="Notifications"
      >
        <Bell className={cn(
          "w-5 h-5 transition-colors",
          unreadCount > 0 ? "text-[#8B4513]" : "text-gray-500"
        )} />

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute -top-1 -right-1 bg-gradient-to-br from-[#8B4513] to-[#6B3410] text-white text-[10px] font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1.5 shadow-lg border-2 border-white"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 md:w-96 z-50 max-h-[500px] overflow-hidden flex flex-col"
            >
              <div className="bg-gradient-to-br from-white to-gray-50/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden">
                <div className="relative px-5 py-4 border-b border-gray-100/80">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8B4513]/5 to-transparent" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B4513] to-[#A0522D] flex items-center justify-center shadow-lg">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs text-[#8B4513] font-medium">{unreadCount} unread</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="p-2 text-gray-500 hover:text-[#8B4513] hover:bg-[#8B4513]/10 rounded-xl transition-all"
                          title="Mark all as read"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-y-auto flex-1 max-h-[350px]">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                        <Sparkles className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-gray-800 font-semibold">All caught up!</p>
                      <p className="text-sm text-gray-500 mt-1">
                        New results will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleNotificationClick(notification)}
                          className={cn(
                            "p-4 cursor-pointer rounded-2xl transition-all mb-2 group relative overflow-hidden",
                            !notification.read 
                              ? "bg-gradient-to-r from-[#8B4513]/10 to-[#8B4513]/5 hover:from-[#8B4513]/15 hover:to-[#8B4513]/10 border border-[#8B4513]/10" 
                              : "hover:bg-gray-50 border border-transparent"
                          )}
                        >
                          <div className="flex gap-3">
                            <div className={cn(
                              "w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 transition-all",
                              !notification.read 
                                ? "bg-gradient-to-br from-[#8B4513] to-[#A0522D] shadow-[0_0_10px_rgba(139,69,19,0.4)]" 
                                : "bg-gray-200"
                            )} />

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2 mb-1">
                                <p className={cn(
                                  "text-sm font-semibold leading-tight",
                                  !notification.read ? "text-gray-900" : "text-gray-600"
                                )}>
                                  {notification.title}
                                </p>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded-full">
                                  {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>

                              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                {notification.message}
                              </p>

                              <div className="flex items-center gap-1 text-xs text-[#8B4513] font-medium opacity-0 group-hover:opacity-100 transition-all pt-2">
                                <span>View Details</span>
                                <ExternalLink className="w-3 h-3" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
