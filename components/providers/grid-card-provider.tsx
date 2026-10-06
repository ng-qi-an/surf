import { GridItemType } from "@/lib/db";
import { createContext, useContext } from "react";

type GridCardContextType = {
    isDragging: boolean,
    enableEffect: boolean,
    setEnableEffect: (enable: boolean) => void,
    items: GridItemType[],
    setItems: React.Dispatch<React.SetStateAction<GridItemType[]>>,
}
export const GridCardContext = createContext<GridCardContextType>({} as any);
export const useGridCard = () => useContext(GridCardContext);

export default function GridCardProvider({children, isDragging, enableEffect, setEnableEffect, items, setItems}: {children: React.ReactNode} & GridCardContextType){
    return <GridCardContext.Provider value={{isDragging, enableEffect: true, setEnableEffect, items, setItems}}>
        {children}
    </GridCardContext.Provider>
}