"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ProfileClient from "./ProfileClient";

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f1a14]">
          <div className="text-center text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">加载中...</p>
          </div>
        </div>
      }
    >
      <ProfileClient />
    </Suspense>
  );
}
