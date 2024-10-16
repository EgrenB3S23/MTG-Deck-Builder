import { FormEvent, ReactElement, useState, useContext } from "react";
import { IDeck, IDecklistEntry, IDecklistEntryFull } from "../interfaces";
import { arrowFetchCard, baseURL, dummyDeck, dummyMain, parseCardName } from "../utils";
import { DeckContext } from "../context";

export function DeckBuilder(): ReactElement {
	// raw textbox data:
	const [rawDeckName, setRawDeckName] = useState("");
	const [rawDeckMain, setRawDeckMain] = useState("");
	const [rawDeckSB, setRawDeckSB] = useState("");

	// deck state:
	const [deck, setDeck] = useState<IDeck | null>(null);
	const deckContext = useContext(DeckContext);
	// load deck from localStorage on mount:
	// useEffect(() => {
	// 	const storedDeck = localStorage.getItem("deckUnchecked");
	// 	if (storedDeck) {
	// 		setDeck(JSON.parse(storedDeck));
	// 	}
	// }, []);

	// Save deck to state and localStorage
	const saveDeck = (newDeck: IDeck) => {
		setDeck(newDeck);
		localStorage.setItem("deckUnckecked", JSON.stringify(newDeck));
	};

	// load deck from localStorage return deck as IDeck object.
	const loadDeck = () => {
		const deckfromLocalStorage = localStorage.getItem("deckUnchecked");

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

	/* 
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

	async function batchCheck(input: IDecklistEntry[]) {
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

	async function batchCheckNew(input: IDecklistEntry[]) {
		// todo 241015: replace batchCheck with this.
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

		// let elapsed = new Date().getTime() - start; // end timer
		// console.log(`batchCheckNew() attempted ${data.length} card fetches. Time elapsed: ${elapsed} ms.`);

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

	async function deckCheck() {
		//todo241016: replace with dechCheckNew

		console.log(`in deckCheck()`);
		const start = new Date().getTime(); // start timer to measure function performance

		if (deck) {
			// todo: combine
			const checkedMain = await batchCheck(deck.main);
			const checkedSideboard = await batchCheck(deck.sideboard);
			// spara till context
			deckContext?.setDeckMain(checkedMain);
			deckContext?.setDeckSideboard(checkedSideboard);
		}

		let elapsed = new Date().getTime() - start; // end timer
		console.log(`deckCheck() finished. Time elapsed: ${elapsed} ms.`);
	}

	async function deckCheckNew(deck: IDeck) {
		// todo 241016: replace deckCheck with this when finished
		// NOT DONE

		console.log(`in deckCheck()`);
		const start = new Date().getTime(); // start timer to measure function performance

		if (deck) {
			const checkedMain = await batchCheckNew(deck.main); // todo 241016: batchCheckNew isn't finished
			const checkedSideboard = await batchCheckNew(deck.sideboard);
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
		// >>		deckCheckNew(deck: IDeck)						return format: IDeck
		// >>>			batchCheckNew(maindeck: IDecklistEntry[])	return format: IDecklistEntry[] w/ card_info
		// >>>			batchCheckNew(sideboard: IDecklistEntry[])	return format: IDecklistEntry[] w/ card_info
		// >>>>				arrowFetchCard(card name: string)		done. return format: <ICard | null>

		e.preventDefault();

		console.log("");
		console.log("### in handleSaveDeck...");
		// get a complete deck object from textbox strings:
		let deckUnchecked: IDeck = createDeckFromStrings(rawDeckName, rawDeckMain, rawDeckSB);
		console.log("deckUnchecked: ", deckUnchecked);
		setDeck({
			//
			name: deckUnchecked.name,
			main: deckUnchecked.main,
			sideboard: deckUnchecked.sideboard,
		});
		localStorage.setItem("deckUnchecked", JSON.stringify(deckUnchecked));
	};

	const handleLookup = async (cname: string) => {
		const resp = await parseCardName(cname);
		console.log("cname length", cname.length);
		console.log("resp length", resp.length);
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

		// 2. save the IDeckobject with setDeck()
		if (deckToLoad !== null) {
			setDeck({
				// save deck object to state
				name: deckToLoad.name,
				main: deckToLoad.main,
				sideboard: deckToLoad.sideboard,
			});

			// 3. set raws
			const [rawNameStr, rawMainStr, rawSideboardStr] = createStringsFromDeck(deckToLoad);
			setRawDeckName(rawNameStr);
			setRawDeckMain(rawMainStr);
			setRawDeckSB(rawSideboardStr);
			console.log("rawNameStr: ", rawNameStr);
			console.log("rawMainStr: ", rawMainStr);
			console.log("rawSideboardStr: ", rawSideboardStr);
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
				<button onClick={deckCheck}>parse cards</button>
				<button onClick={() => batchCheckNew(deck!.main)}>{`test batchCheckNew()`}</button> {/* sloppy NNA, but its for testing */}
				<button onClick={() => deckCheckNew(deck!)}>{`test deckCheckNew()`}</button> {/* sloppy NNA, but its for testing */}
			</section>
		</>
	);
}
