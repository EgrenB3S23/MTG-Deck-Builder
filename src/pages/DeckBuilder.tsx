import { FormEvent, ReactElement, useState, useContext, useEffect } from "react";
import { IDeck, IDecklistEntry } from "../interfaces";
import { arrowFetchCard, dummyDeck, emptyDeck, generateUniqueID } from "../utils";
import { DeckContext } from "../context";
import { SelectDeck } from "../components";

export function DeckBuilder(): ReactElement {
	// raw textbox data:
	const [rawDeckID, setRawDeckID] = useState("");
	const [rawDeckName, setRawDeckName] = useState("");
	const [rawDeckMain, setRawDeckMain] = useState("");
	const [rawDeckSB, setRawDeckSB] = useState("");

	// deck state.
	const [deck, setDeck] = useState<IDeck | null>(null);
	const deckContext = useContext(DeckContext);
	// load deck from localStorage on mount:
	// useEffect(() => {
	// 	const storedDeck = localStorage.getItem("storedSingleDeck");
	// 	if (storedDeck) {
	// 		setDeck(JSON.parse(storedDeck));
	// 	}
	// }, []);

	// useEffect(); //generate deck id on load
	useEffect(() => {
		// 1. on load, check if deckContext has data. if it does, load it to decklist form.
		// This code will run once on page load
		console.log("Component has mounted!");

		if (!localStorage.getItem("storedDecks")) {
			localStorage.setItem("storedDecks", JSON.stringify([]));
		}
		if (deck === null) {
			setDeck(emptyDeck);
		}

		if (deckContext?.name) {
			//essentially "if a deck has been stored in deckContext"

			//set id
			if (deckContext.ID) {
				setRawDeckID(""); // dunno why this is needed but the ID sometimes gets malformed without it
				setRawDeckID(deckContext.ID);
			} else {
				setRawDeckID("");
				setRawDeckID(generateUniqueID("deck"));
			}
		} else {
		}

		// Optional: You can return a cleanup function here if needed
		// return () => {
		// 	console.log("Component is unmounting...");
		// };
	}, []); // Empty dependency array means it only runs once when the component mounts

	// Save deck to state and localStorage
	const saveDeck = (newDeck: IDeck) => {
		// 241017 outdated
		setDeck(newDeck);
		localStorage.setItem("storedSingleDeck", JSON.stringify(newDeck));
	};

	// load deck from localStorage return deck as IDeck object.
	const loadDeck = () => {
		const deckfromLocalStorage = localStorage.getItem("storedSingleDeck");

		if (deckfromLocalStorage) {
			const deckToLoad: IDeck = JSON.parse(deckfromLocalStorage);
			return deckToLoad;
		} else return null;
	};

	function toDecklistEntry(input: string): IDecklistEntry | null {
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

	function createStringsFromDeck(input: IDeck): [string, string, string] {
		// todo 241015
		// input: an IDeck object.
		// output: array of 3 strings formatted as intended for the 3 decklist form textboxes.
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

		const nameStr = input.name;
		let mainStr = "";
		let sideboardStr = "";

		for (const entry of input.main) {
			mainStr = `${mainStr}\n${entry.count} ${entry.name}`;
		}

		for (const entry of input.sideboard) {
			sideboardStr = `${sideboardStr}\n${entry.count} ${entry.name}`;
		}

		return [nameStr.trim(), mainStr.trim(), sideboardStr.trim()];
	}

	function createDeckFromStrings(inputName: string, inputMain: string, inputSB: string): IDeck {
		// 241014 TODO
		// 1. turn strings into arrays of lines
		// 2. for main: turn each line into decklistEntry
		// 3. for sb: turn each line into decklistEntry
		// 4. combine name, main, sb into IDeck object.
		// 5. return IDeck object

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

		console.log("deckName: ", inputName);
		console.log("deckMain: ", deckMain);
		console.log("deckSB: ", deckSB);

		return {
			name: inputName,
			main: deckMain,
			sideboard: deckSB,
		};
	}

	/* commented out 241014 / 15
	async function batchFetch(cards: IDecklistEntry[]) {
		// todo 241015
		// fetches card info for multiple cards with a single API request.
		// example url: https://api.scryfall.com/cards/search?q=name:Lightning%20Bolt%20or%20name:Counterspell%20or%20name:Giant%20Growth

		const cardNamesTemp = ["Lightning Bolt", "Counterspell", "Giant Growth"]; // temp
		let url = `${baseURL}/cards/search?q=name:`;

		for (const entry of cards) {
		}

		const query = cardNamesTemp.map((name) => `name:${encodeURIComponent(name)}`).join(" or ");

		fetch(`https://api.scryfall.com/cards/search?q=${query}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				// Process the card data here
			})
			.catch((error) => {
				console.error("Error fetching card data:", error);
			});
	}
	 */

	/*	commented out 241016
	async function batchCheckOld(input: IDecklistEntry[]) {
		// deprecated
		const cards: IDecklistEntryFull[] = [];
		for (const entry of input) {
			const nameToCheck: string = entry.name;
			const card: IDecklistEntryFull = {
				name: entry.name,
				count: entry.count,
				is_real: false,
			};
			let parsedName = await parseCardName(nameToCheck); // replace parseCardname with arrowFetchCard()

			if (parsedName.length === 0) {
				// if length = 0, card name is invalid
				card.is_real = false;
			} else {
				card.is_real = true;
			}
			cards.push(card);
		}
		console.log("Parsed cards: ", cards);
		return cards;
	}
 */

	async function batchCheck(cards: IDecklistEntry[]) {
		// 1. takes a list of decklist entries,
		// 2. fetches card data for each card in list
		// 3. responses will be a mix of <ICard | null>
		// 4. for each returned card object:
		// 4.1. add card info
		// 4.2. add "is_real" flag
		// 4.3. replace name with corrected name ("moxopal"-> "Mox Opal")

		// const [...cardNames] = cards.name;
		// const data = await Promise.all(cardNames.map(arrowFetchCard));

		// example usage
		// batchCheck(cards).then((results) => {
		//	console.log(results);
		// });

		// const start = new Date().getTime(); // start timer to measure function performance

		const retVal: IDecklistEntry[] = cards;
		const data = await Promise.all(cards.map((entry) => arrowFetchCard(entry.name))); // "for each card in list, fetch card info."

		for (let i = 0; i < retVal.length; i++) {
			// if(data[i] !== null && retVal[i] !== null){
			if (data[i] && retVal[i]) {
				//if here, card exists!
				// const entry = retVal[i];
				retVal[i].card_info = data[i]!; // ! : non-null assertion operator ("i hereby solemnly swear that data[i] is not null")
				if (retVal[i].card_info!.name) {
					retVal[i].name = retVal[i].card_info!.name; // replace written name (i.e. "moxlotus") with correctly spaced & capitalized name ("Mox Lotus") from card_info.
					retVal[i].is_real = true;
				} else retVal[i].is_real = false;
			} else retVal[i].is_real = false;
		}
		return retVal; // : IDecklistEntry[]
	}

	async function deckCheck(deck: IDeck) {
		// todo 241016: replace deckCheckOld with this when finished
		// NOT DONE

		//deckCheck() calls batchCheck(). <- old method

		console.log(`in deckCheck()`);
		const start = new Date().getTime(); // start timer to measure function performance

		if (deck) {
			const checkedMain = await batchCheck(deck.main);
			const checkedSideboard = await batchCheck(deck.sideboard);
			deckContext?.setName(deck.name);
			deckContext?.setDeckMain(checkedMain);
			deckContext?.setDeckSideboard(checkedSideboard);
		}

		let elapsed = new Date().getTime() - start; // end timer
		console.log(`deckCheck() finished. Time elapsed: ${elapsed} ms.`);
	}

	// example usage
	// batchCheck(cards).then((results) => {
	//	console.log(results);
	// });

	async function batchCheckDeck(deck: IDeck): Promise<IDeck> {
		//241017
		//runs batchCheck() on both provided deck's maindeck and sideboard, adding is_real flag and card_info to each card

		console.log("in batchCheckDeck(): ", deck);

		let checkedMain = await batchCheck(deck.main);
		let checkedSideboard = await batchCheck(deck.sideboard);

		if (checkedMain) {
		}

		deck.main = checkedMain || deck.main;
		deck.sideboard = checkedSideboard || deck.sideboard;

		return deck;
	}

	const handleSaveDeck = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// todo 241014

		// 1. convert textbox data into deck (IDeck) object.
		// 2. save deck object to Local Storage
		// 3. TODO: fetch & save card info to each card in decklist (and set is_real = true | false)

		// ¤ intended process: (TODO as of 241016)
		// >	handleSaveDeck()
		// >>		deckCheck(deck: IDeck)						return format: IDeck
		// >>>			batchCheck(maindeck: IDecklistEntry[])	return format: IDecklistEntry[] w/ card_info
		// >>>			batchCheck(sideboard: IDecklistEntry[])	return format: IDecklistEntry[] w/ card_info
		// >>>>				arrowFetchCard(card name: string)		done. return format: <ICard | null>

		console.log("### in handleSaveDeck...");

		// some form data validation:
		let errorMsg: string = "";
		if (!rawDeckName.trim()) {
			errorMsg += "🔴 You must name your deck.\n";
		}
		if (!rawDeckMain.trim()) {
			errorMsg += "🔴 Your maindeck cannot be empty.\n";
		}
		if (errorMsg) {
			alert("⚠️Save aborted!⚠️\n\n" + errorMsg);
			return;
		}

		// get a complete deck object from textbox strings:
		let deckFromForm: IDeck = createDeckFromStrings(rawDeckName, rawDeckMain, rawDeckSB); // converts the textbox data into an IDeck object
		deckFromForm.ID = rawDeckID;

		// if rawDeckID was empty or otherwise invalid, generate a new deckID.
		if (!deckFromForm.ID) {
			deckFromForm.ID = generateUniqueID("deck");
		}

		console.log("deckFromForm before: ", deckFromForm);
		console.log("before setDeck(): ", deckFromForm);
		console.log("ID: ", deckFromForm.ID);
		console.log("name: ", deckFromForm.name);
		console.log("main: ", deckFromForm.main);
		console.log("sideboard: ", deckFromForm.sideboard);

		// let deck;
		//
		setDeck(deckFromForm);
		// saveDeck(deckFromForm);

		console.log("deck after setDeck(): ", deck);
		console.log("deckFromForm after setDeck(): ", deckFromForm);

		//###################################
		//#				241017				#
		//#				TODO:				#
		//#		run deckCheck on deck here	#
		//#									#
		//###################################

		// verify card names and add card_info to each correctly spelled card
		// let checkedDeck = deckCheck(deckFromForm);

		// let checkedDeckMain = deck.main ? batchCheck(deck.main) : [];
		// let checkedDeckMain: IDecklistEntry[] = [];
		// let checkedDeckSideboard: IDecklistEntry[] = [];
		// if (deck!.main) {
		// 	checkedDeckMain = batchCheck();
		// }
		// checkedDeckSideboard = batchCheck(deck.sideboard);
		// let checkedDeck = batchCheckDeck(deck!) || null;

		/*
		let checkedDeck: any = null;
		batchCheckDeck(deck!)
			.then((result) => {
				checkedDeck = result || null;
			})
			.catch((error) => {
				console.error("Error checking deck:", error);
			});
		*/

		//save deck before checking (in case check messes up) // TODO: fix this
		localStorage.setItem("storedSingleDeck", JSON.stringify(deckFromForm));

		// if (deck) {
		// 	deckCheck(deck);
		// }

		//todo: replace with ability to save multiple decks at once.
		// localStorage.setItem("storedSingleDeck", JSON.stringify(deckFromForm));
	};

	const handleLookup = async (cardName: string) => {
		//old:  const resp = await parseCardName(cname);
		const resp = await arrowFetchCard(cardName);

		console.log("cardName", cardName.length);
		if (resp) {
			if (resp.object === "card") {
				console.log("resp length", resp.length);
			}
		}
	};

	const handleLoadDeck = () => {
		// todo 241014
		// 1. load IDeck object from localStorage
		// 2. save the IDeckobject with setDeck()
		// 3. convert IDeck object to raw decklist strings and send those to decklist form textboxes)

		console.log("handleLoadDeck(): ");

		// 1. load IDeck object from localStorage
		const deckToLoad = loadDeck(); // IDeck object (or null if error)
		console.log("deckToLoad: ", deckToLoad);
		let rawIdStr: string = "";

		// 2. save the IDeckobject with setDeck()
		if (deckToLoad) {
			if (deckToLoad.ID) {
				// if loaded deck already has an ID, use that.
				const loadedID = deckToLoad.ID;
				console.log("loadedID: ", loadedID);
				rawIdStr = loadedID;
			} else {
				// ..otherwise generate a new ID.
				rawIdStr = generateUniqueID("deck");
				// since the deck from localStorage didn't have an ID, give it the one we just generated
			}
			deckToLoad.ID = rawIdStr;
			// if (deckToLoad.ID) {
			// 	= deck
			// }
			// setDeck({
			// 	// save deck object to state
			// 	ID: deckToLoad.ID,
			// 	name: deckToLoad.name,
			// 	main: deckToLoad.main,
			// 	sideboard: deckToLoad.sideboard,
			// });

			console.log("deckToLoad before setDeck(deckToLoad):", deckToLoad);
			console.log("deck state before setDeck(deckToLoad):", deckToLoad);

			setDeck(deckToLoad);

			console.log("deckToLoad after setDeck(deckToLoad):", deckToLoad);
			console.log("deck state after setDeck(deckToLoad):", deckToLoad);

			// if (deck) {
			// 	if (!deck.ID) {
			// 		const newDeckID = generateUniqueID("deck");
			// 		setDeck({
			// 			ID: newDeckID,
			// 			name: deckToLoad.name,
			// 			main: deckToLoad.main,
			// 			sideboard: deckToLoad.sideboard,
			// 		});
			// 	} else {
			// 		setDeck({
			// 			ID: deckToLoad.ID,
			// 			name: deckToLoad.name,
			// 			main: deckToLoad.main,
			// 			sideboard: deckToLoad.sideboard,
			// 		});
			// 	}
			// }

			// 3. set raws
			const [rawNameStr, rawMainStr, rawSideboardStr] = createStringsFromDeck(deckToLoad);
			setRawDeckID(rawIdStr); // todo: ensure it works
			setRawDeckName(rawNameStr);
			setRawDeckMain(rawMainStr);
			setRawDeckSB(rawSideboardStr);

			console.log("rawIdStr:\n", rawIdStr);
			console.log("rawNameStr:\n", rawNameStr);
			console.log("rawMainStr:\n", rawMainStr);
			console.log("rawSideboardStr:\n", rawSideboardStr);
		}
	};

	function saveDeckLS(deckToStore: IDeck | null) {
		console.log("in saveDeckLS()...");
		if (deckToStore == null) {
			console.log("failed to save deck. deck is null. ");
			return;
		}
		console.log("deckToStore: ", deckToStore);
		// 1. load storedDecks from LS
		// 2. add deckToStore to storedDecks
		// 3.

		// localStorage.setItem("storedDecks", JSON.stringify([dummyDeck]));
		// deckToStore = dummyDeck;

		let fromLS: string = localStorage.getItem("storedDecks") || "[]";
		// console.log("fromLS: ", fromLS);
		let storedDecks: IDeck[] = JSON.parse(fromLS);

		console.log("storedDecks: ", storedDecks);
		storedDecks.push(deckToStore);
		console.log("storedDecks: ", storedDecks);

		localStorage.setItem("storedDecks", JSON.stringify(storedDecks));
	}

	function TESTSETDECK() {
		// todo: temporary test function
		console.log("in TESTSETDECK");

		let DECKID = rawDeckID;
		let DECKNAME = rawDeckName;
		let DECKMAIN = rawDeckMain;
		let DECKSB = rawDeckSB;

		let DECKTOUSE = createDeckFromStrings(DECKNAME, DECKMAIN, DECKSB);

		DECKTOUSE.ID = DECKID;

		console.log("before setDeck. DECKTOUSE: ", DECKTOUSE);
		setDeck(
			DECKTOUSE

			// {
			// 	ID: DECKID,
			// 	name: DECKNAME,
			// 	main: DECKMAIN,

			// }
		);
		console.log("after setDeck. deck: ", deck);
		alert();
		saveDeck(DECKTOUSE);
		console.log("after saveDeck. DECKTOUSE: ", DECKTOUSE);
		console.log("after saveDeck. deck: ", deck);
	}

	return (
		<>
			<section id="deckBuilder">
				<br />
				<input type="text" id="searchtext" />
				<br />
				Buttons for testing purposes:
				<br />
				<button onClick={() => handleLookup("Mox Opal")}>"Mox Opal"</button>
				<button onClick={() => handleLookup("Mox opal")}>"Mox opal"</button>
				<button onClick={() => handleLookup("MOX OPAL")}>"MOX OPAL"</button>
				<button onClick={() => handleLookup("mox opal")}>"mox opal"</button>
				<button onClick={() => handleLookup("Moxopal")}>"Moxopal"</button>
				<button onClick={() => handleLookup("moxpal")}>"moxpal"</button>
				<form id="decklist-form" onSubmit={handleSaveDeck}>
					<input //
						name="deckID"
						id="deckID"
						placeholder="Deck ID"
						value={rawDeckID}
						onChange={(e) => setRawDeckID(e.target.value)}
					/>{" "}
					<input //
						name="deckName"
						id="deckName"
						placeholder="Deck name"
						value={rawDeckName}
						onChange={(e) => setRawDeckName(e.target.value)}
					/>
					<textarea //
						name="deckMain"
						id="deckMain"
						placeholder="Main deck"
						rows={20}
						value={rawDeckMain}
						onChange={(e) => setRawDeckMain(e.target.value)}
					/>
					<textarea //
						name="deckSB"
						id="deckSB"
						placeholder="Sideboard"
						rows={8}
						value={rawDeckSB}
						onChange={(e) => setRawDeckSB(e.target.value)}
					/>
					<button type="submit">Save deck</button>
				</form>
				{/* <DecklistForm /> */}
				<button onClick={handleLoadDeck}>Load deck!</button>
				<button onClick={() => batchCheck(deck!.main)}>{`test batchCheck()`}</button> {/* sloppy NNA, but its for testing */}
				<button onClick={() => deckCheck(deck!)}>{`test deckCheck()`}</button> {/* sloppy NNA, but its for testing */}
				<button onClick={TESTSETDECK}>{`test TESTSETDECK()`}</button> {/* sloppy NNA, but its for testing */}
				<button onClick={() => saveDeckLS(deck)}>{`test saveDeckLS()`}</button> {/* sloppy NNA, but its for testing */}
			</section>
			<SelectDeck />
		</>
	);
}
