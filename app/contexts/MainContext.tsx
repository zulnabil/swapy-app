"use client"

import { Squid } from "@0xsquid/sdk"
import { createContext, useContext } from "react"

type MainContextType = {
  squid: Squid | null
}

const MainContext = createContext<MainContextType | undefined>(undefined)

interface MainContextProviderProps extends MainContextType {
  children: React.ReactNode
}

function MainContextProvider({ children, squid }: MainContextProviderProps) {
  return (
    <MainContext.Provider value={{ squid }}> {children} </MainContext.Provider>
  )
}

function useMainContext() {
  const context = useContext(MainContext)
  if (context === undefined) {
    throw new Error("useMainContext must be used within a MainContextProvider")
  }
  return context
}

export { useMainContext, MainContextProvider }
