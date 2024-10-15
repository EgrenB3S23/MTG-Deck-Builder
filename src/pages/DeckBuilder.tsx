import { FormEvent, ReactElement, useState, useContext } from "react";
import { IDeck, IDecklistEntry, parsedCard } from "../interfaces";
import { parseCardName } from "../utils";
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
			// more data validation
			decklistEntry.name.length === 0 ||
			decklistEntry.count === 0
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

	async function batchCheck(input: IDecklistEntry[]) {
		const cards: parsedCard[] = [];
		for (const entry of input) {
			const nameToCheck: string = entry.name;
			const card: parsedCard = {
				name: entry.name,
				is_found: false,
				count: entry.count,
			};
			let parsedName = await parseCardName(nameToCheck);

			if (parsedName.length === 0) {
				// if length = 0, card name is invalid
				card.is_found = false;
			} else {
				card.is_found = true;
			}
			cards.push(card);
		}
		console.log("Parsed cards: ", cards);
		return cards;
	}

	async function deckCheck() {
		if (deck) {
			const checkedMain = await batchCheck(deck.main);
			const checkedSideboard = await batchCheck(deck.sideboard);
			// spara till context
			deckContext?.setDeckMain(checkedMain);
			deckContext?.setDeckSideboard(checkedSideboard);
		}
	}

	const handleSaveDeck = (e: FormEvent<HTMLFormElement>) => {
		// todo 241014

		// 1. convert textbox data into deck (IDeck) object.
		// 2. save deck object to Local Storage

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
			</section>
		</>
	);
}
