import { createContext, useState, ReactNode } from "react";
import { parsedCard } from "../interfaces";

// Definiera typen för Context-värdet
interface MyContextType {
	name: string;
	deckMain: parsedCard[];
	deckSideboard: parsedCard[];
	setName: (value: string) => void;
	setDeckMain: (value: parsedCard[]) => void;
	setDeckSideboard: (value: parsedCard[]) => void;
}

// Skapa en Context med en initial typ
export const DeckContext = createContext<MyContextType | undefined>(undefined);

// Definiera typen för props (i detta fall bara `children`)
interface MyProviderProps {
	children: ReactNode;
}

export function DeckProvider({ children }: MyProviderProps) {
	const [name, setName] = useState<string>("");
	const [deckMain, setDeckMain] = useState<parsedCard[]>([]);
	const [deckSideboard, setDeckSideboard] = useState<parsedCard[]>([]);

	return <DeckContext.Provider value={{ name, setName, deckMain, setDeckMain, deckSideboard, setDeckSideboard }}>{children}</DeckContext.Provider>;
}
