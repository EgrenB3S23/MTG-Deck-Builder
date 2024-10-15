import { ICard } from "./interfaces";

export const baseURL = "https://api.scryfall.com";

// "https://api.scryfall.com/cards/random/"
// https://scryfall.com/cards/search?q="mox opal"
// https://api.scryfall.com/cards/named?exact=mox+opal

export async function parseCardName(cardName: string) {
	// todo 241015: OLD
	// TO BE REPLACED by fetchCard()

	// returns formatted card name if card exists, otherwise returns empty string
	let okSoFar = true;
	let retVal: string = "";

	try {
		let searchStr = cardName.replace(" ", "+");
		// Send fetch request
		const resp = await fetch(`${baseURL}/cards/named?exact=${searchStr}`);
		let data = await resp.json();
		// retVal = await data;

		if ((await data.object) === "error") {
			console.log(`Card "${cardName}" does not exist!`);
			retVal = "";
			okSoFar = false;
		} else if ((await data.object) === "card") {
			console.log(`Card "${cardName}" found!`);
			retVal = capitalizeWords(data.name); // "mox opal" -> "Mox Opal"
		}
	} catch (e) {
		okSoFar = false;
		// console.error(e);
	}
	if (!okSoFar) {
		return "";
	} else {
		console.log("retVal:", retVal);
	}
	return retVal;
}

export async function fetchCard(cardName: string) {
	// takes a card name like "Mox Opal" and returns the card info as an ICard object if the card exists. Otherwise returns null.
	console.log(`Fetching card "${cardName}"...`);
	let okSoFar = true;
	let retVal: ICard | null = null;

	try {
		let searchStr = cardName.replace(" ", "+");
		// Send fetch request
		const resp = await fetch(`${baseURL}/cards/named?exact=${searchStr}`);
		let data = await resp.json();
		// retVal = await data;

		if ((await data.object) === "error") {
			console.log(`Card "${cardName}" does not exist!`);
			// retVal = null;
			okSoFar = false;
		} else if ((await data.object) === "card") {
			console.log(`Card "${cardName}" found!`);
			retVal = data; // ICard Object
		}
	} catch (e) {
		okSoFar = false;
		// console.error(e);
	}
	return okSoFar ? retVal : null; // always returning retVal might be fine. TODO: test this!
}

export const arrowFetchCard = async (cardName: string): Promise<ICard | null> => {
	// todo 241015: replace fetchCard with this.
	// to run multiple fetches in parallell (instead of one at a time), use :
	// const cardNames = ["Mox Opal", "Black Lotus", "Sol Ring"];
	// const data = await Promise.all(cardNames.map(arrowFetchCard));

	console.log(`Fetching card "${cardName}"...`);
	let okSoFar = true;
	let retVal: ICard | null = null;

	try {
		let searchStr = cardName.replace(" ", "+");
		const resp = await fetch(`${baseURL}/cards/named?exact=${searchStr}`);
		let data = await resp.json();

		if (data.object === "error") {
			console.log(`Card "${cardName}" does not exist!`);
			okSoFar = false;
		} else if (data.object === "card") {
			console.log(`Card "${cardName}" found!`);
			retVal = data; // ICard Object
		}
	} catch (e) {
		okSoFar = false;
		return null;
		// console.error(e);
	}

	return okSoFar ? retVal : null; // always returning retVal might be fine. TODO: test this!
};

async function fetchMultipleCards(cardNames: string[]) {
	// batch run multiple instances of arrowFetchCard in parallell to reduce waiting time.
	// input: list of card names: ["Mox Opal", ...]
	// output: list of ICard[]

	// example usage
	// fetchMultipleCards(cardNames).then((results) => {
	//	console.log(results);
	// });

	const results = await Promise.all(cardNames.map(arrowFetchCard));
	return results;
}

export function capitalizeWords(str: string) {
	// takes a string of words and capitalizes the first char of each word.
	// example input: "hello WORLD"
	// example output: "Hello World"

	// split string into array of lowercase words:
	const wordsLowerCase: string[] = str.toLowerCase().split(" ");

	// capitalize each word:
	let wordsCapitalized: string[] = [];
	for (const word of wordsLowerCase) {
		const wordCapitalized = word.charAt(0).toUpperCase() + word.slice(1);
		wordsCapitalized.push(wordCapitalized);
	}

	// re-join words back into a single string:
	const stringCapitalized: string = wordsCapitalized.join(" ");

	return stringCapitalized;
}
