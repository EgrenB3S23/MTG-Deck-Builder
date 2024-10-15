import { createContext, useState, ReactNode } from "react";
import { IDecklistEntryFull } from "../interfaces";

// Definiera typen för Context-värdet
interface MyContextType {
	name: string;
	deckMain: IDecklistEntryFull[];
	deckSideboard: IDecklistEntryFull[];
	setName: (value: string) => void;
	setDeckMain: (value: IDecklistEntryFull[]) => void;
	setDeckSideboard: (value: IDecklistEntryFull[]) => void;
}

// Skapa en Context med en initial typ
export const DeckContext = createContext<MyContextType | undefined>(undefined);

// Definiera typen för props (i detta fall bara `children`)
interface MyProviderProps {
	children: ReactNode;
}

export function DeckProvider({ children }: MyProviderProps) {
	const [name, setName] = useState<string>("");
	const [deckMain, setDeckMain] = useState<IDecklistEntryFull[]>([]);
	const [deckSideboard, setDeckSideboard] = useState<IDecklistEntryFull[]>([]);

	return <DeckContext.Provider value={{ name, setName, deckMain, setDeckMain, deckSideboard, setDeckSideboard }}>{children}</DeckContext.Provider>;
}
