import { createContext, useState, ReactNode } from "react";
import { IDecklistEntry } from "../interfaces";

// DeckContext contains the deck "being worked on", so that the user can navigate between pages and come back to continue editing the deck.

// Definiera typen för Context-värdet
interface DeckContextType {
	ID: string;
	name: string;
	deckMain: IDecklistEntry[];
	deckSideboard: IDecklistEntry[];
	setID: (value: string) => void;
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
	const [ID, setID] = useState<string>("");
	const [deckMain, setDeckMain] = useState<IDecklistEntry[]>([]);
	const [deckSideboard, setDeckSideboard] = useState<IDecklistEntry[]>([]);

	return <DeckContext.Provider value={{ ID, setID, name, setName, deckMain, setDeckMain, deckSideboard, setDeckSideboard }}>{children}</DeckContext.Provider>;
}
