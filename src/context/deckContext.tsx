import { createContext, useState, ReactNode } from "react";
import { IDecklistEntry } from "../interfaces";

// Definiera typen för Context-värdet
interface DeckContextType {
	name: string;
	deckMain: IDecklistEntry[];
	deckSideboard: IDecklistEntry[];
	setName: (value: string) => void;
	setDeckMain: (value: IDecklistEntry[]) => void;
	setDeckSideboard: (value: IDecklistEntry[]) => void;
}

// Skapa en Context med en initial typ
export const DeckContext = createContext<DeckContextType | undefined>(undefined);

// Definiera typen för props (i detta fall bara `children`)
interface DeckProviderProps {
	children: ReactNode;
}

export function DeckProvider({ children }: DeckProviderProps) {
	const [name, setName] = useState<string>("");
	const [deckMain, setDeckMain] = useState<IDecklistEntry[]>([]);
	const [deckSideboard, setDeckSideboard] = useState<IDecklistEntry[]>([]);

	return <DeckContext.Provider value={{ name, setName, deckMain, setDeckMain, deckSideboard, setDeckSideboard }}>{children}</DeckContext.Provider>;
}
