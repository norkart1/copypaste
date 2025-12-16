"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, Copy, Zap, Edit, Trash2 } from "lucide-react";

interface ProfileCardProps {
  name?: string;
  role?: string;
  email?: string;
  avatarSrc?: string;
  statusText?: string;
  statusColor?: string;
  glowText?: string;
  className?: string;
  juryId?: string;
  password?: string;
  assignmentCount?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopyPassword?: () => void;
}

export function ProfileCard({
  name = "Jury Member",
  role = "Event Judge",
  email,
  avatarSrc = "",
  statusText = "Active",
  statusColor = "bg-lime-500",
  glowText = "Currently Evaluating Programs",
  className,
  juryId,
  password,
  assignmentCount = 0,
  onEdit,
  onDelete,
  onCopyPassword,
}: ProfileCardProps) {
  const [copied, setCopied] = useState(false);

  // Derive a local clock text once per minute
  const timeText = useMemo(() => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, "0");
    const hour12 = ((h + 11) % 12) + 1;
    const ampm = h >= 12 ? "PM" : "AM";
    return `${hour12}:${m}${ampm}`;
  }, []);

  const handleCopy = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
        onCopyPassword?.();
      } catch {}
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("relative w-full", className)}
    >
      <div className="pointer-events-none absolute inset-x-0 -bottom-8 top-[75%] rounded-[28px]  z-0" />

      <Card className="relative z-10 mx-auto w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-50 to-white border border-gray-100 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-block h-2.5 w-2.5 rounded-full animate-pulse",
                  statusColor || "bg-emerald-500",
                )}
              />
              <span className="select-none text-gray-700">{statusText}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span className="tabular-nums">{timeText}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-4 sm:gap-5">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-200 shadow-lg">
              <Image
                src={avatarSrc}
                alt={`${name} avatar`}
                fill
                sizes="(max-width: 640px) 64px, 80px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="truncate text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                {name}
              </h3>
              <p className="text-sm text-gray-500">{role}</p>
              {juryId && (
                <p className="text-xs text-gray-400 font-mono">ID: {juryId.slice(0, 12)}...</p>
              )}
              {assignmentCount !== undefined && (
                <p className="text-xs text-emerald-600 font-medium">
                  {assignmentCount} program{assignmentCount !== 1 ? "s" : ""} assigned
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {password && (
              <Button
                variant="secondary"
                onClick={handleCopy}
                className="h-11 w-full justify-start gap-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-emerald-400 transition-all"
              >
                <Copy className="h-4 w-4 shrink-0" />
                <span className="truncate">{copied ? "Copied!" : "Copy Password"}</span>
              </Button>
            )}
            <div className="flex flex-row gap-2">
            {onEdit && (
              <Button
                variant="secondary"
                onClick={onEdit}
                className="h-11 w-full justify-start gap-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-emerald-400 transition-all"
              >
                <Edit className="h-4 w-4 shrink-0" />
                <span>Edit</span>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                onClick={onDelete}
                className="h-11 w-full justify-start gap-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-400 transition-all"
              >
                <Trash2 className="h-4 w-4 shrink-0" />
                <span>Delete</span>
              </Button>
            )}
            </div>
            {email && (
              <Button
                variant="secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(email);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  } catch {}
                }}
                className="h-11 w-full justify-start gap-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-emerald-400 transition-all"
              >
                <Copy className="h-4 w-4 shrink-0" />
                <span className="truncate">{copied ? "Copied!" : "Copy Email"}</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

