// hooks/use-auth-init.ts
"use client";

import { useEffect } from "react";
import api from "@/lib/auth";
import { useDispatch } from "react-redux";
import { setAccessToken, logout, setLoading } from "@/store/slices/authSlice";

export default function useAuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get("/api/auth/me", { withCredentials: true });
        dispatch(setAccessToken(res.data.accessToken));
      } catch {
        dispatch(logout());
      }
    };

    init();
  }, [dispatch]);
}
