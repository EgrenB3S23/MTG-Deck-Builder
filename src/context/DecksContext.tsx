// todo 241017 maybe skip this and use localstorage instead (or in addition to?)

import { createContext, useState, ReactNode } from "react";
import { IDeck, IDecklistEntry } from "../interfaces";

interface DecksContextType {
	decks: IDeck[];
	setDecks: (value: IDeck[]) => void;
}

export const DecksContext = createContext<DecksContextType | undefined>(undefined);

interface DecksProviderProps {
	children: ReactNode;
}

export function DecksProvider({ children }: DecksProviderProps) {
	const [decks, setDecks] = useState<IDeck[]>([]);
	return <DecksContext.Provider value={{ decks, setDecks }}>{children}</DecksContext.Provider>;
}
