interface ICardImageUris {
	small: string;
	normal: string;
	large: string;
	png: string;
	art_crop: string;
	border_crop: string;
}

export interface ICard {
	// metadata
	object: string;
	id: string;
	released_at: Date;
	uri: string;
	scryfall_uri: string;
	image_uris: ICardImageUris;

	// card info (gameplay-relevant properties)
	name: string;
	mana_cost: string;
	cmc: number;
	type_line: string;
	oracle_text: string;
	colors: [string];
	color_identity: string[];

	// misc
	set: string;
	rarity: string;
	legalities: {
		standard: string;
		modern: string;
		legacy: string;
		vintage: string;
		pioneer: string;
		historic: string;
		commander: string;

		[key: string]: string; // catch-all for any additional formats. (any other field under 'legalities' will be typed as a string)
	};
	[key: string]: unknown; //  catch-all
}

export interface IScryfallCard {
	//unlike ICard, IScryfallCard is a *complete* interface for "card" objects returned from Scryfall's API.
	object: string;
	id: string;
	oracle_id: string;
	multiverse_ids: number[];
	arena_id: number;
	tcgplayer_id: number;
	cardmarket_id: number;
	name: string;
	lang: string;
	released_at: string; // Date string in format "YYYY-MM-DD"
	uri: string;
	scryfall_uri: string;
	layout: string;
	highres_image: boolean;
	image_status: string;
	image_uris: {
		small: string;
		normal: string;
		large: string;
		png: string;
		art_crop: string;
		border_crop: string;
	};
	mana_cost: string;
	cmc: number;
	type_line: string;
	oracle_text: string;
	colors: string[];
	color_identity: string[];
	keywords: string[];
	legalities: {
		standard: string;
		modern: string;
		legacy: string;
		vintage: string;
		pioneer: string;
		historic: string;
		commander: string;

		[key: string]: string; // catch-all for any additional formats. (any other field under 'legalities' will be typed as a string)
	};
	games: string[];
	reserved: boolean;
	foil: boolean;
	nonfoil: boolean;
	finishes: string[];
	oversized: boolean;
	promo: boolean;
	reprint: boolean;
	variation: boolean;
	set_id: string;
	set: string;
	set_name: string;
	set_type: string;
	set_uri: string;
	set_search_uri: string;
	scryfall_set_uri: string;
	rulings_uri: string;
	prints_search_uri: string;
	collector_number: string;
	digital: boolean;
	rarity: string;
	flavor_text: string;
	card_back_id: string;
	artist: string;
	artist_ids: string[];
	illustration_id: string;
	border_color: string;
	frame: string;
	full_art: boolean;
	textless: boolean;
	booster: boolean;
	story_spotlight: boolean;
	edhrec_rank: number;
	penny_rank: number;
	prices: { [key: string]: string | null }; // Object with string keys and string or null values
	related_uris: { [key: string]: string }; // Object with string keys and string values
	purchase_uris: { [key: string]: string }; // Object with string keys and string values
}

export interface IDecklistEntry {
	//  used for single cards in a decklist. each line "4 Mox Opal" turns into {"Mox Opal", 4}
	name: string;
	count: number;
	is_real?: boolean;
	card_info?: ICard;
}

export interface IDeck {
	//represents an mtg decklist.
	// todo 241016: checkDeckLegalityLocally() function to loop through all cards in deck for their format legalities, then return resulting deck legalities. (if all cards are legal in standard, deck is legal in standard, etc)
	name: string;
	main: IDecklistEntry[];
	sideboard: IDecklistEntry[];
}
export interface IDecklistEntryFull {
	// like IDecklistEntry, but with card data and 'exists'
	// todo 241016: merge IDecklistEntry & IDecklistEntryFull
	name: string;
	count: number;
	is_real?: boolean;
	card_info?: ICard;
}

export interface IDeckFull {
	name: string;
	main: IDecklistEntryFull[];
	sideboard: IDecklistEntryFull[];
	// is_real?: boolean;
	// get legalities(): { [key: string]: string }; // define legalities as a getter
	// legalities: {
	// 	standard: string;
	// 	modern: string;
	// 	legacy: string;
	// 	vintage: string;
	// 	pioneer: string;
	// 	historic: string;
	// 	commander: string;
	// 	[key: string]: string; // catch-all for any additional formats. (any other field under 'legalities' will be typed as a string)
	// };
}

export interface ICardNameReport {
	name: string;
	is_real: boolean;
}
