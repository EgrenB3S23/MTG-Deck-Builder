import { ICard, IDeck } from "./interfaces";

export const baseURL = "https://api.scryfall.com";

// "https://api.scryfall.com/cards/random/"
// https://scryfall.com/cards/search?q="mox opal"
// https://api.scryfall.com/cards/named?exact=mox+opal

// todo: remove this (testing purposes)

export let dummyDeck = {
	name: "colortest",
	main: [
		{
			name: "Black Lotus",
			count: 1,
		},
		{
			name: "Lotus Petal",
			count: 1,
		},
		{
			name: "Lotus Bloom",
			count: 1,
		},
		{
			name: "Mox Opal",
			count: 1,
		},
		{
			name: "Chrome Mox",
			count: 1,
		},
		{
			name: "Savannah Lions",
			count: 1,
		},
		{
			name: "Snapcaster Mage",
			count: 1,
		},
		{
			name: "Mogg Fanatic",
			count: 1,
		},
		{
			name: "Dark Confidant",
			count: 1,
		},
		{
			name: "Tarmogoyf",
			count: 1,
		},
		{
			name: "Progenitus",
			count: 1,
		},
		{
			name: "City of Brass",
			count: 1,
		},
	],
	sideboard: [
		{
			name: "Island",
			count: 1,
		},
	],
};
export let dummyMain = [
	{
		name: "black lotus",
		count: 4,
	},
	{
		name: "lotus petal",
		count: 4,
	},
	{
		name: "lotus bloom",
		count: 4,
	},
	// {
	// 	name: "3",
	// 	count: 3,
	// },
	// {
	// 	name: "a",
	// 	count: 2,
	// },
];

/* 
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
			console.log(`Card "${data.name}" found!`);
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
 */

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

	console.log(`In arrowFetchCard(). Fetching card "${cardName}"...`);
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

export function capitalizeWords(str: string): string {
	// todo: maybe swap to:
	// export const capitalizeWords = (str: string): string => {

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

export const emptyDeck = (): IDeck => {
	return {
		// id: "",
		name: "",
		main: [],
		sideboard: [],
	};
};

export function sortDeck(deckToSort: IDeck): IDeck {
	// sorts deck by card type,
	// todo: allow sorting by different parameters.
	const sortOrder = ["creature", "enchantment", "sorcery", "instant", "artifact", "planeswalker", "battle", "land"];

	// Helper function to get the sorting index based on card type
	const getSortIndex = (typeLine: string): number => {
		// Find the first word (main card type) in type_line, convert to lowercase for case-insensitive comparison
		const mainType = typeLine.split(" ")[0].toLowerCase();

		// Get the sort order index or a high value (sort alphabetically after known types)
		const index = sortOrder.indexOf(mainType);
		return index === -1 ? sortOrder.length + mainType.charCodeAt(0) : index;
	};

	// Sort the main deck
	const sortedMain = [...deckToSort.main].sort((a, b) => {
		return getSortIndex(a.card_info?.type_line || "") - getSortIndex(b.card_info?.type_line || "");
	});

	// Sort the sideboard in the same way
	const sortedSideboard = [...deckToSort.sideboard].sort((a, b) => {
		return getSortIndex(a.card_info?.type_line || "") - getSortIndex(b.card_info?.type_line || "");
	});

	// Return the sorted deck
	return {
		...deckToSort,
		main: sortedMain,
		sideboard: sortedSideboard,
	};
}

// for (let i = 0; i < deckSorted.main.length; i++) {
// 	let entry = deckSorted.main[i];
// }

export function getCSSColorFromMTG(colors: string[] | undefined): string {
	// takes a card's colors[] property and returns a CSS color as a string.
	if (!colors) {
		return "white"; // Default to white if colors are not provided
	}

	switch (colors.length) {
		case 0: //colorless
			return "#BBB";
		case 1: //monocolored, follow-up switch to determine which below
			switch (colors[0]) {
				case "W":
					return "rgb(245, 245, 220)";
				case "U":
					return "#22a";
					return "darkblue";
				case "B":
					return "rgb(60, 60, 60)";
				case "R":
					return "darkred";
				case "G":
					return "darkgreen";
				default:
					return "lightgrey"; //
			}
		default: // multicolored
			return "gold";
	}
}
