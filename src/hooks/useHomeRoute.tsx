import React, {createContext, useContext} from "react";
import {useHomeContext} from "../context/homeContext";

type HomeContextType = ReturnType<typeof useHomeContext>;
const HomeContext = createContext<HomeContextType | null>(null);

export function HomeProvider({children}: {children: React.ReactNode})
{
    const routeDate = useHomeContext();
    return (
        <HomeContext.Provider value={routeDate}>
            {children}
        </HomeContext.Provider>
    )
}

export function useHome()
{
    const context = useContext(HomeContext);
    if(!context)
        throw new Error('useHome은 HomeProvider 내부에서 사용해야 합니다.');
    return context;
}