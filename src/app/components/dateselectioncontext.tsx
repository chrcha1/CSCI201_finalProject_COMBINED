"use client"
import React, { createContext, useState, ReactNode } from 'react';

type DateSelectionContextType = {
    selectedDates: Set<string>;
    setSelectedDates: React.Dispatch<React.SetStateAction<Set<string>>>;
};

const defaultState: DateSelectionContextType = {
    selectedDates: new Set<string>(),
    setSelectedDates: () => {}
};

const DateSelectionContext = createContext<DateSelectionContextType>(defaultState);

type DateSelectionProviderProps = {
    children: ReactNode;
};

export const DateSelectionProvider: React.FC<DateSelectionProviderProps> = ({ children }) => {
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

    return (
        <DateSelectionContext.Provider value={{ selectedDates, setSelectedDates }}>
            {children}
        </DateSelectionContext.Provider>
    );
};

export default DateSelectionContext;