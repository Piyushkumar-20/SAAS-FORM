import { trpc } from "~/trpc/client"

export const useSignup = () => {
  const mutation = trpc.auth.signup.useMutation()

  return {
    signup: mutation.mutate,
    signupAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  }
}

export const useSignin = () => {
  const mutation = trpc.auth.login.useMutation()

  return {
    signin: mutation.mutate,
    signinAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  }
}

/**
 * Hook for user logout with automatic cache invalidation
 * Clears httpOnly cookie on server and invalidates auth queries
 */
export const useLogout = () => {
  const utils = trpc.useUtils()

  const mutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.auth.getLoggedInUserInfo.invalidate()
    },

    onError: (error: unknown) => {
      console.error("Logout failed:", error)
    },
  })

  return {
    logout: mutation.mutate,
    logoutAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}

/**
 * Hook to get the currently logged-in user's information
 * This query will be automatically invalidated when user logs in/out
 * Use this in authenticated pages like dashboard to display user info
 */
export const useLoggedInUser = () => {
  const query = trpc.auth.getLoggedInUserInfo.useQuery(undefined, {
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  }
}
