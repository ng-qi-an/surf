import { GridItemType } from "@/lib/db";
import { createContext, useContext } from "react";

type GridCardContextType = {
    isDragging: boolean,
    enableEffect: boolean,
    setEnableEffect: (enable: boolean) => void,
    setShowEditDialog: (show: boolean) => void,
    items: GridItemType[],
    setItems: React.Dispatch<React.SetStateAction<GridItemType[]>>,
}
export const GridCardContext = createContext<GridCardContextType>({} as any);
export const useGridCard = () => useContext(GridCardContext);

export default function GridCardProvider({children, isDragging, enableEffect, setShowEditDialog, setEnableEffect, items, setItems}: {children: React.ReactNode} & GridCardContextType){
    return <GridCardContext.Provider value={{isDragging, enableEffect, setEnableEffect, items, setItems, setShowEditDialog}}>
        {children}
    </GridCardContext.Provider>
}