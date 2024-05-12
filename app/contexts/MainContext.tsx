"use client"

import { Squid } from "@0xsquid/sdk"
import { createContext, useContext, useReducer } from "react"

type MainContextStateType = {
  squid: Squid | null
  fromChain: string | number
  fromToken: string | number
  fromAmount: string
  toChain: string | number
  toToken: string | number
  toAddress: string
  slippage: number
}

type Action = {
  type: "setState"
  payload: Omit<Partial<MainContextStateType>, "squid">
}

type MainContextType = {
  state: MainContextStateType
  dispatch: React.Dispatch<Action>
}

const MainContext = createContext<MainContextType | undefined>(undefined)

function contextReducer(state: MainContextStateType, action: Action) {
  switch (action.type) {
    case "setState": {
      return { ...state, ...action.payload }
    }
  }
}

interface MainContextProviderProps extends Pick<MainContextStateType, "squid"> {
  children: React.ReactNode
}

function MainContextProvider({ children, squid }: MainContextProviderProps) {
  const [state, dispatch] = useReducer(contextReducer, {
    squid,
    fromChain: "",
    fromToken: "",
    fromAmount: "",
    toChain: "",
    toToken: "",
    toAddress: "",
    slippage: 1.0,
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
