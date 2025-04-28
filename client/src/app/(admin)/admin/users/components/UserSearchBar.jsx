"use client"

import { Search, RefreshCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function UserSearchBar({ searchQuery, setSearchQuery, fetchUsers }) {
  return (
    <div className="flex items-center gap-4 pt-4 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button variant="outline" size="icon" onClick={fetchUsers}>
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </div>
  )
}