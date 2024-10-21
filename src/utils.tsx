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

// export async function fetchCard(cardName: string) {
// 	// takes a card name like "Mox Opal" and returns the card info as an ICard object if the card exists. Otherwise returns null.
// 	// console.log(`Fetching card "${cardName}"...`);
// 	let okSoFar = true;
// 	let retVal: ICard | null = null;

// 	try {
// 		let searchStr = cardName.replace(" ", "+");
// 		// Send fetch request
// 		const resp = await fetch(`${baseURL}/cards/named?exact=${searchStr}`);
// 		let data = await resp.json();
// 		// retVal = await data;

// 		if ((await data.object) === "error") {
// 			console.log(`Card "${cardName}" does not exist!`);
// 			// retVal = null;
// 			okSoFar = false;
// 		} else if ((await data.object) === "card") {
// 			console.log(`Card "${cardName}" found!`);
// 			retVal = data; // ICard Object
// 		}
// 	} catch (e) {
// 		okSoFar = false;
// 		// console.error(e);
// 	}
// 	return okSoFar ? retVal : null; // always returning retVal might be fine. TODO: test this!
// }

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
		// for (let i = 0; i < types.length; i++) {
		// 	types[i] = capitalizeWords(types[i]);
		// }

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

		return "Unknown"; // this never runs
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
	};

	console.log("in sortDeck() before sort. incoming deck:", deckToSort);

	const sortOrder = ["Creature", "Artifact", "Enchantment", "Sorcery", "Instant", "Planeswalker", "Battle", "Land", "Unknown"];

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

// export const getDecksFromLS = () => {
export function getDecksFromLS() {
	const LSKey: string = "decks";

	const dataFromLS: string | null = localStorage.getItem(LSKey);
	let decksFromLS: IDeck[] = [];
	try {
		if (dataFromLS) {
			decksFromLS = JSON.parse(dataFromLS);
			return decksFromLS;
		}
	} catch (error) {
		console.log("Couldn't load saved decks", error);
	}
	return decksFromLS;
}

export function getDeckFromLSByID(id: string) {
	// TODO: WIP 241021
	let decksFromLS: IDeck[] = [];

	let foundDeck: IDeck | undefined = undefined;
	try {
		decksFromLS = getDecksFromLS();
		foundDeck = decksFromLS.find((deck) => deck.id == id);
	} catch (error) {
		console.log(`Couldn't load deck with ID ${id}, e`);
	}

	return foundDeck ? foundDeck : null;
}

export function getCardCounts(deck: IDeck) {
	// takes a deck and returns the number of cards in main and in sideboard as an object.
	console.log("in getCardCounts()");

	let mainCount: number = 0;
	let sideboardCount: number = 0;

	for (let i = 0; i < deck.main.length; i++) {
		const entry = deck.main[i];
		if (entry.is_real) {
			mainCount += entry.count;
			console.log(`Fount ${entry.count}x ${entry.name}. Total count so far: ${mainCount}`);
		} else {
			console.log(`No card found with name "${entry.name}". Total count so far: ${mainCount}`);
		}
	}

	for (let i = 0; i < deck.sideboard.length; i++) {
		const entry = deck.sideboard[i];
		sideboardCount += entry.count;
		console.log(`Fount ${entry.count}x ${entry.name}. Total count so far: ${sideboardCount}`);
	}

	return { main: mainCount, sideboard: sideboardCount };
}

export function exampleTransformCard() {
	return {
		name: "Arguel's Blood Fast // Temple of Aclazotz",
		count: 1,
		card_info: {
			object: "card",
			id: "c4ac7570-e74e-4081-ac53-cf41e695b7eb",
			oracle_id: "be2a4bc4-8af6-48c5-9421-32d26272e71a",
			multiverse_ids: [435243, 435244],
			mtgo_id: 65194,
			mtgo_foil_id: 65195,
			arena_id: 66143,
			tcgplayer_id: 145261,
			cardmarket_id: 301387,
			name: "Arguel's Blood Fast // Temple of Aclazotz",
			lang: "en",
			released_at: "2017-09-29",
			uri: "https://api.scryfall.com/cards/c4ac7570-e74e-4081-ac53-cf41e695b7eb",
			scryfall_uri: "https://scryfall.com/card/xln/90/arguels-blood-fast-temple-of-aclazotz?utm_source=api",
			layout: "transform",
			highres_image: true,
			image_status: "highres_scan",
			cmc: 2,
			type_line: "Legendary Enchantment // Legendary Land",
			color_identity: ["B"],
			keywords: ["Transform"],
			produced_mana: ["B"],
			card_faces: [
				{
					object: "card_face",
					name: "Arguel's Blood Fast",
					mana_cost: "{1}{B}",
					type_line: "Legendary Enchantment",
					oracle_text: "{1}{B}, Pay 2 life: Draw a card.\nAt the beginning of your upkeep, if you have 5 or less life, you may transform Arguel's Blood Fast.",
					colors: ["B"],
					flavor_text: "Arguel's vision led him into the jungles of Ixalan . . .",
					artist: "Daarken",
					artist_id: "e607a0d4-fc12-4c01-9e3f-501f5269b9cb",
					illustration_id: "a1e9f54d-adde-4c8a-acd0-5c63c2fece55",
					image_uris: {
						small: "https://cards.scryfall.io/small/front/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598",
						normal: "https://cards.scryfall.io/normal/front/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598",
						large: "https://cards.scryfall.io/large/front/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598",
						png: "https://cards.scryfall.io/png/front/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.png?1562563598",
						art_crop: "https://cards.scryfall.io/art_crop/front/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598",
						border_crop: "https://cards.scryfall.io/border_crop/front/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598",
					},
				},
				{
					object: "card_face",
					name: "Temple of Aclazotz",
					mana_cost: "",
					type_line: "Legendary Land",
					oracle_text: "(Transforms from Arguel's Blood Fast.)\n{T}: Add {B}.\n{T}, Sacrifice a creature: You gain life equal to the sacrificed creature's toughness.",
					colors: [],
					flavor_text: ". . . to the lost temple of a bat-god of night, eternal enemy to the Threefold Sun.",
					artist: "Daarken",
					artist_id: "e607a0d4-fc12-4c01-9e3f-501f5269b9cb",
					illustration_id: "872bd01d-10b1-4050-84e8-bf128e624b6d",
					image_uris: {
						small: "https://cards.scryfall.io/small/back/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598",
						normal: "https://cards.scryfall.io/normal/back/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598",
						large: "https://cards.scryfall.io/large/back/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598",
						png: "https://cards.scryfall.io/png/back/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.png?1562563598",
						art_crop: "https://cards.scryfall.io/art_crop/back/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598",
						border_crop: "https://cards.scryfall.io/border_crop/back/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598",
					},
				},
			],
			all_parts: [
				{
					object: "related_card",
					id: "4a8b3030-5495-404b-938c-8c4a387a1341",
					component: "combo_piece",
					name: "Ixalan Checklist",
					type_line: "Card",
					uri: "https://api.scryfall.com/cards/4a8b3030-5495-404b-938c-8c4a387a1341",
				},
				{
					object: "related_card",
					id: "c4ac7570-e74e-4081-ac53-cf41e695b7eb",
					component: "combo_piece",
					name: "Arguel's Blood Fast // Temple of Aclazotz",
					type_line: "Legendary Enchantment // Legendary Land",
					uri: "https://api.scryfall.com/cards/c4ac7570-e74e-4081-ac53-cf41e695b7eb",
				},
				{
					object: "related_card",
					id: "31d2e591-6df4-4445-a16c-c7a576ff3e20",
					component: "combo_piece",
					name: "High Marshal Arguel",
					type_line: "Legendary Creature — Vampire Knight",
					uri: "https://api.scryfall.com/cards/31d2e591-6df4-4445-a16c-c7a576ff3e20",
				},
			],
			legalities: {
				standard: "not_legal",
				future: "not_legal",
				historic: "legal",
				timeless: "legal",
				gladiator: "legal",
				pioneer: "legal",
				explorer: "legal",
				modern: "legal",
				legacy: "legal",
				pauper: "not_legal",
				vintage: "legal",
				penny: "legal",
				commander: "legal",
				oathbreaker: "legal",
				standardbrawl: "not_legal",
				brawl: "legal",
				alchemy: "not_legal",
				paupercommander: "not_legal",
				duel: "legal",
				oldschool: "not_legal",
				premodern: "not_legal",
				predh: "not_legal",
			},
			games: ["arena", "paper", "mtgo"],
			reserved: false,
			foil: true,
			nonfoil: true,
			finishes: ["nonfoil", "foil"],
			oversized: false,
			promo: false,
			reprint: false,
			variation: false,
			set_id: "fe0dad85-54bc-4151-9200-d68da84dd0f2",
			set: "xln",
			set_name: "Ixalan",
			set_type: "expansion",
			set_uri: "https://api.scryfall.com/sets/fe0dad85-54bc-4151-9200-d68da84dd0f2",
			set_search_uri: "https://api.scryfall.com/cards/search?order=set&q=e%3Axln&unique=prints",
			scryfall_set_uri: "https://scryfall.com/sets/xln?utm_source=api",
			rulings_uri: "https://api.scryfall.com/cards/c4ac7570-e74e-4081-ac53-cf41e695b7eb/rulings",
			prints_search_uri: "https://api.scryfall.com/cards/search?order=released&q=oracleid%3Abe2a4bc4-8af6-48c5-9421-32d26272e71a&unique=prints",
			collector_number: "90",
			digital: false,
			rarity: "rare",
			artist: "Daarken",
			artist_ids: ["e607a0d4-fc12-4c01-9e3f-501f5269b9cb"],
			border_color: "black",
			frame: "2015",
			frame_effects: ["compasslanddfc"],
			security_stamp: "oval",
			full_art: false,
			textless: false,
			booster: true,
			story_spotlight: false,
			edhrec_rank: 6205,
			penny_rank: 2764,
			prices: {
				usd: "0.26",
				usd_foil: "0.67",
				usd_etched: null,
				eur: "0.33",
				eur_foil: "0.75",
				tix: "0.02",
			},
			related_uris: {
				gatherer: "https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=435243&printed=false",
				tcgplayer_infinite_articles:
					"https://tcgplayer.pxf.io/c/4931599/1830156/21018?subId1=api&trafcat=infinite&u=https%3A%2F%2Finfinite.tcgplayer.com%2Fsearch%3FcontentMode%3Darticle%26game%3Dmagic%26partner%3Dscryfall%26q%3DArguel%2527s%2BBlood%2BFast%2B%252F%252F%2BTemple%2Bof%2BAclazotz",
				tcgplayer_infinite_decks:
					"https://tcgplayer.pxf.io/c/4931599/1830156/21018?subId1=api&trafcat=infinite&u=https%3A%2F%2Finfinite.tcgplayer.com%2Fsearch%3FcontentMode%3Ddeck%26game%3Dmagic%26partner%3Dscryfall%26q%3DArguel%2527s%2BBlood%2BFast%2B%252F%252F%2BTemple%2Bof%2BAclazotz",
				edhrec: "https://edhrec.com/route/?cc=Arguel%27s+Blood+Fast",
			},
			purchase_uris: {
				tcgplayer: "https://tcgplayer.pxf.io/c/4931599/1830156/21018?subId1=api&u=https%3A%2F%2Fwww.tcgplayer.com%2Fproduct%2F145261%3Fpage%3D1",
				cardmarket: "https://www.cardmarket.com/en/Magic/Products/Singles/Ixalan/Arguels-Blood-Fast-Temple-of-Aclazotz?referrer=scryfall&utm_campaign=card_prices&utm_medium=text&utm_source=scryfall",
				cardhoarder: "https://www.cardhoarder.com/cards/65194?affiliate_id=scryfall&ref=card-profile&utm_campaign=affiliate&utm_medium=card&utm_source=scryfall",
			},
		},
		is_real: true,
	};
}
