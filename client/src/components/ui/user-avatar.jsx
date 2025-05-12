"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export function UserAvatar({ user, size = "md", className = "" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    "2xl": "h-20 w-20",
    "3xl": "h-28 w-28",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  const renderUserInitials = () => {
    if (!user || !user.fullname) return "";
    const names = user.fullname.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <Avatar className={`${sizeClass} ${className}`}>
      <AvatarImage src={user?.profilePicture} alt={user?.fullname || "User"} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {user ? renderUserInitials() : <User className="h-5 w-5" />}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
