"use client";

import { createContext, useContext, Dispatch, SetStateAction } from "react";
import { Operation } from "./types";

type DataContextType = {
    operation: Operation | null;
    setOperation: Dispatch<SetStateAction<Operation | null>>

    //   allies: AllyEntity[];
    //   setAllies: Dispatch<SetStateAction<AllyEntity[]>>;
    //   groups: Group[];
    //   setGroups: Dispatch<SetStateAction<Group[]>>;
    //   selectedAllies: AllyEntity[];
    //   setSelectedAllies: Dispatch<SetStateAction<AllyEntity[]>>;

    //   hostiles: HostileEntity[];
    //   setHostiles: Dispatch<SetStateAction<HostileEntity[]>>;
    //   selectedHostiles: HostileEntity[];
    //   setSelectedHostiles: Dispatch<SetStateAction<HostileEntity[]>>;
};

const DataContext = createContext<DataContextType>({
    operation: null,
    setOperation: () => { },
    //   allies: [],
    //   setAllies: () => {},
    //   groups: [],
    //   setGroups: () => {},
    //   selectedAllies: [],
    //   setSelectedAllies: () => {},
    //   hostiles: [],
    //   setHostiles: () => {},
    //   selectedHostiles: [],
    //   setSelectedHostiles: () => {},
});


export const useData = () => useContext(DataContext);

export default DataContext;
