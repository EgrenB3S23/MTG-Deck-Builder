import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { IDeck } from "../interfaces";
import { getDecksFromLS } from "../utils";

interface IDecksContext {
	// Basic context read/write for decks array:
	storedDecks: IDeck[];
	setStoredDecks: (value: IDeck[]) => void; // sets entire decks array.

	//CRUD:
	createDeck: (deck: IDeck) => void;
	readDeck: (id: string) => IDeck | null;
	updateDeck: (deck: IDeck) => void;
	deleteDeck: (id: string) => void;

	// moving data between context & localStorage:
	loadDecksFromLSToContext: () => void;
	saveDecksFromContextToLS: () => void;
}

// Assuming IDeck has a unique 'id' property.
export const DecksContext = createContext<IDecksContext | undefined>(undefined);

interface MyProviderProps {
	children: ReactNode;
}

// export function DecksProvider({ children }: MyProviderProps) {
export const DecksProvider /* : React.FC */ = ({ children }: MyProviderProps) => {
	// Basic context read/write for decks array:
	const [storedDecks, setStoredDecks] = useState<IDeck[]>([]);

	// CREATE
	const createDeck = (inputDeck: IDeck) => {
		setStoredDecks((prevDecks) => [...prevDecks, inputDeck]);
	};

	// READ
	const readDeck = (id: string) => {
		const deckToReturn: IDeck | undefined = storedDecks.find((deck) => deck.id === id);

		return deckToReturn || null;
	};

	// UPDATE
	const updateDeck = (inputDeck: IDeck) => {
		setStoredDecks((prevDecks) =>
			prevDecks.map(
				(deck) => (deck.id === inputDeck.id ? inputDeck : deck) //
			)
		);
	};

	// DELETE
	const deleteDeck = (id: string) => {
		setStoredDecks((prevDecks) =>
			prevDecks.filter(
				(deck) => deck.id !== id //
			)
		);
	};

	// moving data between context & localStorage:
	const loadDecksFromLSToContext = () => {
		let decksFromLS = JSON.parse(localStorage.getItem("decksContext") || "[]");
		console.log('in loadDecksFromLSToContext. Loading decks from LS("decksContext"):', decksFromLS);

		if (decksFromLS.length == 0) {
			decksFromLS = JSON.parse(localStorage.getItem("decks") || "[]");
			console.log("no decks found in LS:decksContext. Trying LS:decks...", decksFromLS);
		}
		if (decksFromLS) {
			setStoredDecks(decksFromLS);
		}
	};
	const saveDecksFromContextToLS = () => {
		const dataToSave = JSON.stringify(storedDecks);
		localStorage.setItem("decksContext", dataToSave);
	};

	useEffect(() => {
		console.log("triggered DecksContext useEffect([])\nstoredDecks:", storedDecks);
		// if (!storedDecks) {
		// if (storedDecks.length > 0) {
		loadDecksFromLSToContext();
		// }
	}, []);

	useEffect(() => {
		console.log("triggered DecksContext useEffect([storedDecks])\nstoredDevks:", storedDecks);

		//whenever storedDecks changes, save to localStorage (unless empty)
		if (storedDecks) {
			// localStorage.setItem("decksContext", JSON.stringify(storedDecks));
			saveDecksFromContextToLS;
		}
	}, [storedDecks]);

	return (
		<DecksContext.Provider
			value={{
				// Basic context read/write:
				storedDecks,
				setStoredDecks,
				// CRUD:
				createDeck,
				readDeck,
				updateDeck,
				deleteDeck,
				// moving data between context & localStorage:
				loadDecksFromLSToContext,
				saveDecksFromContextToLS,
			}}
		>
			{children}
		</DecksContext.Provider>
	);
};

// // Hook for consuming the DecksContext
// export const useDecks = () => {
// 	const context = useContext(DecksContext);
// 	if (!context) throw new Error("useDecks must be used within a DecksProvider");
// 	return context;
// };

///////////////////////////////

// import { createContext, useState, ReactNode, useEffect } from "react";
// import { IDeck } from "../interfaces";

// // the intent for storedDecks is to always mirror what's in localStorage.
// interface MyContextType {
// 	// loadedDeck: IDeck | null;
// 	storedDecks: IDeck[];

// 	// setLoadedDeck: (value: IDeck | null) => void;
// 	setStoredDecks: (value: IDeck[]) => void;

//     // CRUD
// 	createDeck: (deck: IDeck) => void;
// 	readDeck: (id: string) => IDeck | null;
// 	updateDeck: (deck: IDeck) => void;
// 	deleteDeck: (id: string) => void;
// 	// saveDeck: (value: IDeck) => IDeck;
// }

// // Skapa en Context med en initial typ
// export const DecksContext = createContext<MyContextType | undefined>(undefined);

// // Definiera typen för props (i detta fall bara `children`)
// interface MyProviderProps {
// 	children: ReactNode;
// }

// export function DecksProvider({ children }: MyProviderProps) {
// 	// const [loadedDeck, setLoadedDeck] = useState<IDeck | null>(null);
// 	const [storedDecks, setStoredDecks] = useState<IDeck[]>([]);

//     	useEffect(() => {
//             //whenever storedDecks changes, save to localStorage (unless empty)
//             if(storedDecks) {

//             }
//         }, [storedDecks]);

// 	// old version used id, name, deckMain and deckSideboard instead of just "deck":
// 	// const [id, setId] = useState<string>("");
// 	// const [name, setName] = useState<string>("");
// 	// const [deckMain, setDeckMain] = useState<IDecklistEntry[]>([]);
// 	// const [deckSideboard, setDeckSideboard] = useState<IDecklistEntry[]>([]);

// 	return <DecksContext.Provider value={{ /* loadedDeck, setLoadedDeck,  */storedDecks, setStoredDecks }}>{children}</DecksContext.Provider>;
// 	// return <DeckContext.Provider value={{ id, setId, name, setName, deckMain, setDeckMain, deckSideboard, setDeckSideboard }}>{children}</DeckContext.Provider>;
// }
