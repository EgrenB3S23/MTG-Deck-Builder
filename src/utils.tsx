export const baseURL = "https://api.scryfall.com";

// "https://api.scryfall.com/cards/random/"
// https://scryfall.com/cards/search?q="mox opal"
// https://api.scryfall.com/cards/named?exact=mox+opal

export async function parseCardName(cardName: string) {
	// reurns formatted card name if card exists, otherwise returns empty string
	let okSoFar = true;
	let retVal: string = "";

	try {
		let searchStr = cardName.replace(" ", "+");
		// Send fetch request
		const resp = await fetch(`${baseURL}/cards/named?exact=${searchStr}`);
		let data = await resp.json();
		// retVal = await data;

		console.log("we got here");
		if ((await data.object) === "error") {
			console.log("is error. returning empty string");
			retVal = "";
			okSoFar = false;
		} else if ((await data.object) === "card") {
			console.log("is card returning true");
			retVal = capitalizeWords(data.name); // "mox opal" -> "Mox Opal"
		}
		console.log("we got here too");
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
