import { IDeck } from "../interfaces";
import { emptyDeck } from "../utils";

// export const randomCardLoader = async (): Promise<IMtgCard> => {
export const viewDeckLoader = async (): Promise<IDeck> => {
	// const resp: Response = await fetch(`${baseURL}/cards/random/`);
	const deckStringFromLS: string = localStorage.getItem("deckUnchecked") || JSON.stringify(emptyDeck); // if localStorage deck is missing or malformed, load empty deck instead.
	const data: IDeck = JSON.parse(deckStringFromLS || JSON.stringify(emptyDeck)); // 2-layer data validation. Looks weird but in case localStorage entry is malformed somehow.

	return data;
};
