"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Import our new components
import { UsersHeader } from "./components/UsersHeader"
import { UserSearchBar } from "./components/UserSearchBar"
import { UsersTable } from "./components/UsersTable"
import { DeleteUserDialog } from "./components/DeleteUserDialog"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:8000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:8000/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Remove the deleted user from the state
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUser(selectedUser._id)
      setDeleteDialogOpen(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const filteredUsers = users.filter(user => 
    (user.fullname?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (String(user.mobile || "")).includes(searchQuery)
  )

  return (
    <div className="flex flex-col gap-6 w-full">
      <UsersHeader />
      
      <Card className="w-full overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View, search, and manage user accounts in your system.
          </CardDescription>
          <UserSearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            fetchUsers={fetchUsers}
          />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <UsersTable 
              users={filteredUsers}
              loading={loading}
              formatDate={formatDate}
              setSelectedUser={setSelectedUser}
              setDeleteDialogOpen={setDeleteDialogOpen}
            />
          </div>
        </CardContent>
      </Card>

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedUser={selectedUser}
        handleDeleteUser={handleDeleteUser}
      />
    </div>
  )
}