import { FormEvent, ReactElement, useState, useContext, useEffect } from "react";
import { IDeck, IDecklistEntry } from "../interfaces";
import { arrowFetchCard, generateUniqueID } from "../utils";
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
		localStorage.setItem("deckUnckecked", JSON.stringify(newDeck));
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

	async function batchCheck(input: IDecklistEntry[]) {
		// todo 241015: replace batchCheckOld with this.
		// 1. takes a list of decklist entries,
		// 2. fetches card data for each card in list
		// 3. responses will be a mix of <ICard | null>
		// 4. for each returned card object:
		// 4.1. add card info
		// 4.2. add "is_real" flag
		// 4.3. replace name with corrected name ("moxopal"-> "Mox Opal")

		// const [...cardNames] = input.name;
		// const data = await Promise.all(cardNames.map(arrowFetchCard));

		// const start = new Date().getTime(); // start timer to measure function performance

		const retVal = input;
		const data = await Promise.all(input.map((entry) => arrowFetchCard(entry.name))); // "for each card in list, fetch card info."

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
		return retVal;
	}

	/* commented out 241016 
	async function deckCheckOld() {
		//todo241016: replace with dechCheckNew

		console.log(`in deckCheckOld()`);
		const start = new Date().getTime(); // start timer to measure function performance

		if (deck) {
			// todo: combine
			const checkedMain = await batchCheckOld(deck.main);
			const checkedSideboard = await batchCheckOld(deck.sideboard);
			// spara till context
			deckContext?.setDeckMain(checkedMain);
			deckContext?.setDeckSideboard(checkedSideboard);
		}

		let elapsed = new Date().getTime() - start; // end timer
		console.log(`deckCheckOld() finished. Time elapsed: ${elapsed} ms.`);
	}
 */

	async function deckCheck(deck: IDeck) {
		// todo 241016: replace deckCheckOld with this when finished
		// NOT DONE

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

	const handleSaveDeck = (e: FormEvent<HTMLFormElement>) => {
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

		e.preventDefault();

		// some form data validation:
		//TODO 241017 these messages could be displayed together with t
		let errorMsg: string = "";
		if (!rawDeckName.trim()) {
			// errorMsg += "❗ You forgot to name your deck! How you would feel if your parents forgot to give you a name.\n";
			errorMsg += "🔴 You must name your deck.\n";
		}
		if (!rawDeckMain.trim()) {
			errorMsg += "🔴 Your maindeck cannot be empty.\n";
		}
		if (errorMsg) {
			alert("⚠️Save aborted!⚠️\n\n" + errorMsg);
			return;
		}

		const newDeckID = generateUniqueID("deck");

		// console.log("");
		console.log("### in handleSaveDeck...");
		// get a complete deck object from textbox strings:
		let storedDeck: IDeck = createDeckFromStrings(rawDeckName, rawDeckMain, rawDeckSB); // converts the textbox data into an IDeck object
		storedDeck.ID = rawDeckID;
		if (!storedDeck.ID) {
			// if deck doesn't already have an id, give it one.
			storedDeck.ID = newDeckID;
		}
		console.log("storedDeck: ", storedDeck);
		setDeck({
			//
			ID: newDeckID,
			name: storedDeck.name,
			main: storedDeck.main,
			sideboard: storedDeck.sideboard,
		});

		//todo: replace with ability to save multiple decks at once.
		localStorage.setItem("storedSingleDeck", JSON.stringify(storedDeck));
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
						onChange={(e) => setRawDeckName(e.target.value.trim())}
					/>
					<textarea //
						name="deckMain"
						id="deckMain"
						placeholder="Main deck"
						rows={20}
						value={rawDeckMain}
						onChange={(e) => setRawDeckMain(e.target.value.trim())}
					/>
					<textarea //
						name="deckSB"
						id="deckSB"
						placeholder="Sideboard"
						rows={8}
						value={rawDeckSB}
						onChange={(e) => setRawDeckSB(e.target.value.trim())}
					/>
					<button type="submit">Save deck</button>
				</form>
				{/* <DecklistForm /> */}
				<button onClick={handleLoadDeck}>Load deck!</button>
				<button onClick={() => batchCheck(deck!.main)}>{`test batchCheck()`}</button> {/* sloppy NNA, but its for testing */}
				<button onClick={() => deckCheck(deck!)}>{`test deckCheck()`}</button> {/* sloppy NNA, but its for testing */}
			</section>
			<SelectDeck />
		</>
	);
}
