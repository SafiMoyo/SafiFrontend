"use client"
import { QueryClientProvider } from "@tanstack/react-query"
import { client } from "./api/client"
import type { ReactNode } from "react"
import AuthContextProvider from "@/context/auth"

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={client}>
      <AuthContextProvider>{children}</AuthContextProvider>
    </QueryClientProvider>
  )
}

export default ReactQueryProvider
