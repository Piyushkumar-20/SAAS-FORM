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