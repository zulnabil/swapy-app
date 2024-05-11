"use client"

import { Squid } from "@0xsquid/sdk"
import { createContext, useContext, useReducer } from "react"

type MainContextStateType = {
  squid: Squid | null
  selectedChainIdFrom: string | number
  selectedTokenFrom: string | number
  selectedChainIdTo: string | number
  selectedTokenTo: string | number
}

type Action = {
  type:
    | "setSelectedChainIdFrom"
    | "setSelectedTokenFrom"
    | "setSelectedChainIdTo"
    | "setSelectedTokenTo"
  payload: string | number
}

type MainContextType = {
  state: MainContextStateType
  dispatch: React.Dispatch<Action>
}

const MainContext = createContext<MainContextType | undefined>(undefined)

function contextReducer(state: MainContextStateType, action: Action) {
  switch (action.type) {
    case "setSelectedChainIdFrom": {
      return { ...state, selectedChainIdFrom: action.payload }
    }
    case "setSelectedTokenFrom": {
      return { ...state, selectedTokenFrom: action.payload }
    }
    case "setSelectedChainIdTo": {
      return { ...state, selectedChainIdTo: action.payload }
    }
    case "setSelectedTokenTo": {
      return { ...state, selectedTokenTo: action.payload }
    }
  }
}

interface MainContextProviderProps extends Pick<MainContextStateType, "squid"> {
  children: React.ReactNode
}

function MainContextProvider({ children, squid }: MainContextProviderProps) {
  const [state, dispatch] = useReducer(contextReducer, {
    squid,
    selectedChainIdFrom: "",
    selectedTokenFrom: "",
    selectedChainIdTo: "",
    selectedTokenTo: "",
  })
  const value = { state: { ...state, squid }, dispatch }

  return <MainContext.Provider value={value}> {children} </MainContext.Provider>
}

function useMainContext() {
  const context = useContext(MainContext)
  if (context === undefined) {
    throw new Error("useMainContext must be used within a MainContextProvider")
  }
  return context
}

export { useMainContext, MainContextProvider }
