import { IDeck } from "../interfaces";
import { emptyDeck } from "../utils";

export const viewDeckLoader = async (): Promise<IDeck> => {
	const a = localStorage.getItem("deckActive");
	if (!a) {
		localStorage.setItem("deckActive", JSON.stringify(emptyDeck()));
	}

	const deckStringFromLS = localStorage.getItem("deckActive") || JSON.stringify(emptyDeck); // if localStorage deck is missing or malformed, load empty deck instead.

	const data: IDeck = JSON.parse(deckStringFromLS || JSON.stringify(emptyDeck)); // 2-layer data validation. Looks weird but in case localStorage entry is malformed somehow.

	return data;
};
