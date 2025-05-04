"use client"

import { Search, Filter, RefreshCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchHeader({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter, 
  fetchRequests 
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or email..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Select value={statusFilter} onValueChange={setStatusFilter} className="flex-1 sm:flex-none">
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchRequests}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}