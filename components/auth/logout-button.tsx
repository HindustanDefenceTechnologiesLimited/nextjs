"use client";

import { Button } from "@/components/ui/button";
import api from "@/lib/auth";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LogoutButton({children}: {children?: React.ReactNode}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      toast.loading("Logging out...", { id: "logout" });

      // Call backend to clear refreshToken cookie
      await api.post("/api/auth/logout", {}, { withCredentials: true });

      // Clear Redux auth state
      dispatch(logout());

      toast.success("Logged out!", { id: "logout" });

      // Redirect to login page
      router.replace("/login");

    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Unable to logout");
    }
  };

  return (
    <div className='cursor-pointer' onClick={handleLogout}>
        {children ? children : <span>Logout</span>}
    </div>
  );
}
