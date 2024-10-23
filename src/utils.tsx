import { ICard, IDeck, IDecklistEntry, IDeckStrings } from "./interfaces";

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
];

export const arrowFetchCard = async (cardName: string): Promise<ICard | null> => {
	// to run multiple fetches in parallell (instead of one at a time), use :
	// const cardNames = ["Mox Opal", "Black Lotus", "Sol Ring"];
	// const data = await Promise.all(cardNames.map(arrowFetchCard));

	// console.log(`In arrowFetchCard(). Fetching card "${cardName}"...`);
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
		console.error(e);
		return null;
	}

	return okSoFar ? retVal : null; // always returning retVal might be fine. TODO: test this!
};

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
		id: "",
		name: "",
		main: [],
		sideboard: [],
	};
};

export function sortDeck(deckToSort: IDeck): IDeck {
	// sorts deck by card type.

	// helper function to pick which card type to sort by.
	function getMainCardType(types: string[]): string {
		// takes an array of card types like ["Enchantment", "Creature"] and returns whichever type appears earliest in typePrioOrder[], in this example Creature.
		// returns "Unknown" if no match was found

		// TODO: handle split cards I.E ("Creature // Land").

		if (types.length == 0) {
			return "Unknown";
		}
		if (types.length === 1) {
			return capitalizeWords(types[0]);
			// return types[0].toLowerCase();
		}

		// ensure types are all capitalized correctly (1st letter upper case) for the comparison ("Creature"):

		const typeSet = new Set(types);

		// todo: discard subtypes (for "Artifact Creature - Golem", only look at "Artifact Creature")

		// todo: discard the backside on double-faced cards (for "Legendary Creature - Demon // Legendary Land", only look at "Legendary Creature")

		const typePrioOrder = [
			// special types: (higher priority for this purpuuse)
			"Dungeon", // non-trad
			"Emblem", // token, planeswalker
			"Hero", // non-tournament
			"Vanguard", // non-tournament, 1997
			"Conspiracy", // Commander, Conspiracy
			"Scheme", // Commander, Archenemy
			"Phenomenon", // Commander, Planechase
			"Plane", // Commander, Planechase
			"Bounty", // Commander
			// normal types:
			"Land",
			"Battle", // sort of normal
			"Planeswalker",
			"Creature",
			"Artifact",
			"Enchantment",
			"Sorcery",
			"Instant",
		];

		for (const type of typePrioOrder) {
			// "loop through prio order list"
			if (typeSet.has(type)) {
				// first match = ignore the rest and return it. (returning "creature" for an artifact creature.)
				return type;
			}
		}

		return "Unknown"; // this should never
	}

	// helper function to get the sorting index based on card type
	const getSortIndex = (typeLine: string): number => {
		const types: string[] = typeLine.split(" ");

		console.log("types: ", types);

		const mainType: string = getMainCardType(types);
		console.log("mainType: ", mainType);

		// Get the sort order index or a high value (sort alphabetically after known types)
		const index = sortOrder.indexOf(mainType);

		return index === -1 ? sortOrder.length + mainType.charCodeAt(0) : index;
		/* equivalent to the line above:
		if (index === -1) {
			return sortOrder.length + mainType.charCodeAt(0);
		} else {§
			return index;
		} */
	};

	console.log("in sortDeck() before sort. incoming deck:", deckToSort);

	const sortOrder = [
		"Creature",
		"Artifact",
		"Enchantment",
		"Sorcery",
		"Instant",
		"Planeswalker",
		"Battle",
		"Dungeon", // non-trad
		"Emblem", // token, planeswalker
		"Hero", // non-tournament
		"Vanguard", // non-tournament, 1997
		"Conspiracy", // Commander, Conspiracy
		"Scheme", // Commander, Archenemy
		"Phenomenon", // Commander, Planechase
		"Plane", // Commander, Planechase
		"Bounty",
		"Land",
		"Unknown",
	];

	// sort the main deck
	const sortedMain = [...deckToSort.main].sort((a, b) => {
		return getSortIndex(a.card_info?.type_line || "") - getSortIndex(b.card_info?.type_line || "");
	});
	console.log("in sortDeck(). Sorted maindeck:", sortedMain);

	// sort the sideboard
	const sortedSideboard = [...deckToSort.sideboard].sort((a, b) => {
		return getSortIndex(a.card_info?.type_line || "") - getSortIndex(b.card_info?.type_line || "");
	});
	console.log("in sortDeck(). Sorted sideboard:", sortedSideboard);

	// the sorted deck
	const retVal = {
		...deckToSort,
		main: sortedMain,
		sideboard: sortedSideboard,
	};
	console.log("in sortDeck(). returning sorted deck:", retVal);
	return retVal;
}

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

export function getRelevantTypes(types: string[]) {
	// takes a list representing the individual words of a card's card types, returns all words occurring before the first instance of "//" or "-".
	// example input: ["Legendary", "Creature", "//", "Legendary", "Land"].
	//example output: ["Legendary", "Creature"]
	// const types = ["Legendary", "Creature", "//", "Legendary", "Land"];

	const separatorIndex = types.indexOf("//") !== -1 ? types.indexOf("//") : types.indexOf("-");
	return separatorIndex !== -1 ? types.slice(0, separatorIndex) : types;
}

export function getFrontFace(card: ICard) {
	// TODO: WIP 241020
	//for helping with fetching properties correctly.
	// takes a card and returns it unchanged if card_faces doesn't exist.
	// if card_faces does exist,  returns it with some properties replaced with ones found on the front face.
	let retVal: ICard = card;
	if (card.card_faces) {
		if (card.layout == "flip") {
			// "flip": 1 image face, 2 "mechanical faces"
			const front = card.card_faces[0];
			retVal = {
				...retVal,
				type_line: front.type_line,
				mana_cost: front.mana_cost,
			};
		} else if (card.layout == "split" || card.layout == "transform" || card.layout == "modal_dfc") {
			// "transform"/"modal_dfc"/"split": 2 image faces, 2 "mechanical faces"
			const front = card.card_faces[0];
			retVal = {
				...retVal,
				type_line: front.type_line,
				mana_cost: front.mana_cost,
				image_uris: front.image_uris!,
			};
		} else {
			// TODO 241020: other card types might also have card faces. this is a minefield until furhter researchedand of low prio for now
			const front = card.card_faces[0];
			retVal = {
				...retVal,
				type_line: front.type_line,
				mana_cost: front.mana_cost,
			};
		}

		// transform card example: https://api.scryfall.com/cards/named?exact=arlinn-kord-arlinn-embraced-by-the-moon
		// flip card example: https://api.scryfall.com/cards/named?exact=kitsune-mystic-autumn-tail-kitsune-sage
		// modal_dfc card example: https://api.scryfall.com/cards/named?exact=a-alrund-god-of-the-cosmos-a-hakka-whispering-raven
		// split card example: https://api.scryfall.com/cards/named?exact=alive-well
	}
	return retVal;
}

export const generateUniqueID = (prefix: string = "deck") => {
	// usage: let id = generateUniqueID() 			// "1729156346783"
	// usage: let id = generateUniqueID("deck")		// "deck-1729156346783"

	return `${prefix}${prefix ? "-" : ""}${Date.now()}`;
};

export function getDecksFromLS(): IDeck[] {
	// fetches decks from localStorage and returns as an array of deck objects.
	const resp = localStorage.getItem("decks");
	return resp ? JSON.parse(resp) : [];
}

export function getDeckFromLSByID(id: string): IDeck | null {
	// fetches deck with the provided ID from localStorage and returns it as an IDeck. returns null if no match was found.
	let decksFromLS: IDeck[] = getDecksFromLS();

	let foundDeck: IDeck | undefined = undefined;
	foundDeck = decksFromLS.find((deck) => deck.id == id);

	if (foundDeck) {
		console.log(`Fetching deck with ID:(${id} from localStorage:`, foundDeck);
	} else {
		console.warn(`Couldn't load deck with ID:(${id})`);
	}

	return foundDeck || null;
}

export function saveDeckToLS(deckToSave: IDeck) {
	let decksFromLS: IDeck[] = [];
	decksFromLS = getDecksFromLS(); // fetches all saved decks

	let foundAMatch: boolean = false;
	for (let i = 0; i < decksFromLS.length; i++) {
		const deckFromLS = decksFromLS[i];
		if (deckFromLS.id === deckToSave.id) {
			// (if same id, overwrite. )
			foundAMatch = true;
			decksFromLS[i] = deckToSave; // overwrite stored deck with new.
		}
	}

	if (!foundAMatch) {
		// if no matching id was found, saving deck as a new entry.
		decksFromLS.push(deckToSave);
	}

	localStorage.setItem("decks", JSON.stringify(decksFromLS));
}

export function deleteDeckInLS(idToDelete: string) {
	//deletes deck in LS with the provided ID.
	let decksFromLS: IDeck[] = [];
	decksFromLS = getDecksFromLS(); // fetches all saved decks

	for (const deckFromLS of decksFromLS) {
		if (deckFromLS.id === idToDelete) {
			decksFromLS.splice(decksFromLS.indexOf(deckFromLS), 1);
		}
	}

	localStorage.setItem("decks", JSON.stringify(decksFromLS));
}

export function getCardCounts(deck: IDeck) {
	// takes a deck and returns the number of cards in main and in sideboard as an object.
	// console.log("in getCardCounts()");

	let mainCount: number = 0;
	let sideboardCount: number = 0;

	for (let i = 0; i < deck.main.length; i++) {
		const entry = deck.main[i];
		if (entry.is_real) {
			mainCount += entry.count;
			// console.log(`Found ${entry.count}x ${entry.name}. Total count so far: ${mainCount}`);
		} else {
			console.warn(`No card found with name "${entry.name}".`);
		}
	}

	for (let i = 0; i < deck.sideboard.length; i++) {
		const entry = deck.sideboard[i];
		if (entry.is_real) {
			sideboardCount += entry.count;
			// console.log(`Found ${entry.count}x ${entry.name}. Total count so far: ${sideboardCount}`);
		} else {
			console.warn(`No card found with name "${entry.name}".`);
		}
	}

	// for (let i = 0; i < deck.sideboard.length; i++) {
	// 	const entry = deck.sideboard[i];
	// 	sideboardCount += entry.count;
	// 	console.log(`Found ${entry.count}x ${entry.name}. Total count so far: ${sideboardCount}`);
	// }

	return { main: mainCount, sideboard: sideboardCount };
}

export function areAllCardsVerified(inputDeck: IDeck | null): boolean {
	// checks if all cards in deck have been verified.
	if (!inputDeck) return false;
	let soFarSoGood: boolean = true;

	for (const card of [...inputDeck.main, ...inputDeck.sideboard]) {
		if (!card.is_real) {
			soFarSoGood = false;
			break;
		}
	}
	return soFarSoGood;
}

export function createStringsFromDeck(input: IDeck): IDeckStrings {
	console.log("in createStringsFromDeck...");
	console.log("input.ID", input.id);
	console.log("input.name", input.name);
	console.log("input.main", input.main);
	console.log("input.sideboard", input.sideboard);

	// input: an IDeck object.
	// output: object with 4 strings formatted as intended for the 4 decklist form textboxes.
	// example input:
	/*
		{
			name: "Hello deck!",
			main: [
				{name: "Mox opal", count: 4},
				{name: "Mox lotus", count: 4}
			],
			sideboard: [
				{name: "Mox opal", count: 4},
				{name: "Mox lotus", count: 4}
			]
		}
		*/
	// example output:
	/* 
		[
			"Hello deck!",
			"4 Mox opal\n4 Mox lotus",
			"4 Mox opal\n4 Mox lotus",
		]
		*/

	const idStrOutput = input.id ? input.id : generateUniqueID();
	const nameStrOutput = input.name;
	let mainStrOutput = "";
	let sideboardStrOutput = "";

	for (const entry of input.main) {
		mainStrOutput = `${mainStrOutput}\n${entry.count} ${entry.name}`;
	}

	for (const entry of input.sideboard) {
		sideboardStrOutput = `${sideboardStrOutput}\n${entry.count} ${entry.name}`;
	}

	console.log("idStrOutput trim:", idStrOutput);
	console.log("nameStrOutput trim:", nameStrOutput);
	console.log("mainStrOutput trim:", mainStrOutput);
	console.log("sideboardStrOutput trim:", sideboardStrOutput);

	return {
		idStr: idStrOutput.trim(),
		nameStr: nameStrOutput.trim(),
		mainStr: mainStrOutput.trim(),
		sideboardStr: sideboardStrOutput.trim(),
	};
}

export function createDeckFromStrings(inputID: string, inputName: string, inputMain: string, inputSB: string): IDeck {
	// 241014 TODO
	// 1. turn strings into arrays of lines
	// 2. for main: turn each line into decklistEntry
	// 3. for sb: turn each line into decklistEntry
	// 4. combine name, main, sb into IDeck object.
	// 5. return IDeck object

	if (!inputID) {
		inputID = generateUniqueID();
	}

	// 1. turn strings into arrays of lines
	let linesMain: string[] = inputMain.split("\n");
	let linesSB: string[] = inputSB.split("\n");

	// 2. for main: turn each line into decklistEntry
	let deckMain: IDecklistEntry[] = [];
	for (const line of linesMain) {
		let entry: IDecklistEntry | null = toDecklistEntry(line);
		console.log("Maindeck entry:", entry);
		//add entry to list if entry is a valid decklistEntry (not null)
		if (entry !== null) {
			deckMain.push(entry);
		}
	}

	// 3. for sb: turn each line into decklistEntry
	let deckSB: IDecklistEntry[] = [];
	for (const line of linesSB) {
		let entry: IDecklistEntry | null = toDecklistEntry(line);
		console.log("SB entry:", entry);
		//add entry to list if entry is a valid decklistEntry (not null)
		if (entry !== null) {
			deckSB.push(entry);
		}
	}

	console.log("deck ID: ", inputID);
	console.log("deck Name: ", inputName);
	console.log("deck Main: ", deckMain);
	console.log("deck SB: ", deckSB);

	return {
		id: inputID,
		name: inputName,
		main: deckMain,
		sideboard: deckSB,
	};
}

export function toDecklistEntry(input: string): IDecklistEntry | null {
	// example input: "4 mox opal"
	// exmple output: {name: "mox opal", count: 4}

	if (input.length === 0) {
		//data validation
		return null;
	}

	// ...extract name and count:
	const cardCountStr = input.split(" ", 1)[0]; // '4 mox opal' -> '4'
	const cardNameStr = input.slice(cardCountStr.length + 1); // '4 mox opal' -> 'mox opal'
	const decklistEntry = {
		name: cardNameStr,
		count: parseInt(cardCountStr),
	};
	// console.log("decklistEntry", decklistEntry);

	if (
		// more data validation (for culling invalid decklist entries)
		decklistEntry.name.length == 0 ||
		decklistEntry.count == 0 ||
		Number.isNaN(decklistEntry.count)
	) {
		return null;
	}
	return decklistEntry; // format: {name: "Mox Opal", count: 4}
}
