import { createContext, useState, ReactNode } from "react";
import { IDeck } from "../interfaces";

// Definiera typen för Context-värdet
interface MyContextType {
	deck: IDeck | null;
	setDeck: (value: IDeck) => void;

	// old version used id, name, deckMain and deckSideboard instead of just "deck":
	// id: string;
	// name: string;
	// deckMain: IDecklistEntry[];
	// deckSideboard: IDecklistEntry[];
	// setId: (value: string) => void;
	// setName: (value: string) => void;
	// setDeckMain: (value: IDecklistEntry[]) => void;
	// setDeckSideboard: (value: IDecklistEntry[]) => void;
}

// Skapa en Context med en initial typ
export const DeckContext = createContext<MyContextType | undefined>(undefined);

// Definiera typen för props (i detta fall bara `children`)
interface MyProviderProps {
	children: ReactNode;
}

export function DeckProvider({ children }: MyProviderProps) {
	const [deck, setDeck] = useState<IDeck | null>(null);

	// old version used id, name, deckMain and deckSideboard instead of just "deck":
	// const [id, setId] = useState<string>("");
	// const [name, setName] = useState<string>("");
	// const [deckMain, setDeckMain] = useState<IDecklistEntry[]>([]);
	// const [deckSideboard, setDeckSideboard] = useState<IDecklistEntry[]>([]);

	return <DeckContext.Provider value={{ deck, setDeck }}>{children}</DeckContext.Provider>;
	// return <DeckContext.Provider value={{ id, setId, name, setName, deckMain, setDeckMain, deckSideboard, setDeckSideboard }}>{children}</DeckContext.Provider>;
}
