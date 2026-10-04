import { createContext, useContext } from "react";

type GridCardContextType = {
    isDragging: boolean,
}
export const GridCardContext = createContext<GridCardContextType>({} as any);
export const useGridCard = () => useContext(GridCardContext);

export default function GridCardProvider({children, isDragging}: {children: React.ReactNode, isDragging: boolean}){
    return <GridCardContext.Provider value={{isDragging}}>
        {children}
    </GridCardContext.Provider>
}