import { createContext, useState, ReactNode } from "react";
import { IDecklistEntry } from "../interfaces";

// Definiera typen för Context-värdet
interface MyContextType {
	name: string;
	deckMain: IDecklistEntry[];
	deckSideboard: IDecklistEntry[];
	setName: (value: string) => void;
	setDeckMain: (value: IDecklistEntry[]) => void;
	setDeckSideboard: (value: IDecklistEntry[]) => void;
}

// Skapa en Context med en initial typ
export const DeckContext = createContext<MyContextType | undefined>(undefined);

// Definiera typen för props (i detta fall bara `children`)
interface MyProviderProps {
	children: ReactNode;
}

export function DeckProvider({ children }: MyProviderProps) {
	const [name, setName] = useState<string>("");
	const [deckMain, setDeckMain] = useState<IDecklistEntry[]>([]);
	const [deckSideboard, setDeckSideboard] = useState<IDecklistEntry[]>([]);

	return <DeckContext.Provider value={{ name, setName, deckMain, setDeckMain, deckSideboard, setDeckSideboard }}>{children}</DeckContext.Provider>;
}
