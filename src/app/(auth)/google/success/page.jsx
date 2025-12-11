"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FullScreenLoader } from "@/components/ui/Loader";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const { isAuthenticated, authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      router.push("/dashboard/home");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  return (<FullScreenLoader/>);
}
