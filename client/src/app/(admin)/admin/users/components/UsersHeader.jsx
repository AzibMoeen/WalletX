"use client"

import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UsersHeader() {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      <Button className="flex items-center gap-2">
        <UserPlus className="w-4 h-4" />
        Add User
      </Button>
    </div>
  )
}