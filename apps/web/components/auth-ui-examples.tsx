"use client"

import { useLoggedInUser, useLogout } from "~/hooks/api/auth"
import { Button } from "~/components/ui/button"
import { useRouter } from "next/navigation"

/**
 * Example: User Profile Component
 *
 * This component demonstrates:
 * 1. Using useLoggedInUser() to access cached user data
 * 2. Automatic UI updates when auth cache is invalidated
 * 3. Logout mutation with cache cleanup
 */
export function UserProfile() {
  const router = useRouter()
  const { user, isLoading, isError } = useLoggedInUser()
  const { logoutAsync, isPending: isLoggingOut } = useLogout()

  const handleLogout = async () => {
    try {
      await logoutAsync()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading user info...</div>
  }

  if (isError || !user) {
    return <div className="text-sm text-red-500">Failed to load user info</div>
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <p className="font-medium text-gray-900">{user.fullname}</p>
        <p className="text-gray-500">{user.email}</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </Button>
    </div>
  )
}

/**
 * Example: Navbar Component
 *
 * Demonstrates how authentication state automatically updates
 * the navbar when user logs in or out
 */
export function Navbar() {
  const { user, isLoading } = useLoggedInUser()

  return (
    <nav className="border-b bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="font-bold">FormBuilder</h1>
        <div>
          {isLoading ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : user ? (
            <UserProfile />
          ) : (
            <Button variant="outline" onClick={() => (window.location.href = "/login")}>
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
