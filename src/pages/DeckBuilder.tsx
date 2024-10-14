import { FormEvent, ReactElement, useState } from "react";
import { IDeck, IDecklistEntry } from "../interfaces";
import { parseCardName } from "../utils";
import { DecklistForm } from "../components/DecklistForm";
export function DeckBuilder(): ReactElement {
	// raw textbox data:
	const [rawDeckName, setRawDeckName] = useState("");
	const [rawDeckMain, setRawDeckMain] = useState("");
	const [rawDeckSB, setRawDeckSB] = useState("");

	// deck state:
	const [deck, setDeck] = useState<IDeck | null>(null);

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

	// load deck from localStorage
	const loadDeck = () => {
		const deckfromLocalStorage = localStorage.getItem("deckUnchecked");

		if (deckfromLocalStorage) {
			const deckToLoad = JSON.parse(deckfromLocalStorage);
			return deckToLoad;
		} else return null;
	};

	// lists of decklist entry objects (one entry: one name and one number)
	// const [deckName, setDeckName] = useState<string>("");
	// const [deckMain, setDeckMain] = useState<IDecklistEntry[]>([]);
	// const [deckSB, setDeckSB] = useState<IDecklistEntry[]>([]);
	// const [deck, setDeck] = useState<IDeck>({
	// 	name: deckName,
	// 	main: deckMain,
	// 	sideboard: deckSB,
	// });

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

	function toRawDecklistEntry(input: IDecklistEntry | null): string | null {
		// exmple input: {name: "mox opal", count: 4}
		// example output: "4 mox opal"
		// returns null if error

		let countStr: string = ""; // example: "4"
		let nameStr: string = ""; // example: "mox opal"
		let retVal: string | null = null; // example: "4 mox opal"

		// data validation
		if (input !== null) {
			countStr = input.count.toString(); // "4"
			nameStr = input.name.toString(); // "mox opal"
		} else return null;
		if (countStr) retVal = `${countStr} ${nameStr}`;

		return retVal;
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

	// const handleSaveDeckOld = async (e: FormEvent<HTMLFormElement>): Promise<IDecklistEntry | void> => {
	// 	e.preventDefault();

	// 	console.log("");
	// 	console.log("### in handleSaveDeck...");

	// 	// create arrays from form data
	// 	let deckMainArrDirty = rawDeckMain.split("\n");
	// 	let deckSBArrDirty = rawDeckSB.split("\n");

	// 	// current format:
	// 	// [
	// 	// "4 Mox Opal",
	// 	// "4 Island",
	// 	// ]

	// 	let deckMainArr: IDecklistEntry[] = [];
	// 	let deckSBArr: IDecklistEntry[] = [];

	// 	// maindeck:
	// 	// convert each text line into an IDecklistEntry.
	// 	// "4 Mox Opal" -> {name:"Mox Opal", count:4}
	// 	for (const textLine of deckMainArrDirty) {
	// 		if (textLine.length == 0) {
	// 			// skip empty lines.
	// 			continue;
	// 		}
	// 		let newEntry: IDecklistEntry | null = await toDecklistEntry(textLine);
	// 		// data validation
	// 		if (newEntry !== null) {
	// 			// don't push entry if it is = null instead of being of type IDecklistEntry).
	// 			if (
	// 				newEntry.name.length !== 0 && // name must not be empty string
	// 				!Number.isNaN(newEntry.count) && // count must be a number...
	// 				newEntry.count >= 1 // ...that is greater than 0
	// 			) {
	// 				deckMainArr.push(newEntry); // decklist entry successfully added to decklist.
	// 			}
	// 		}
	// 	}

	// 	console.log("deckMainArr", deckMainArr);

	// 	// sideboard:
	// 	// convert each text line into an IDecklistEntry.
	// 	// "4 Mox Opal" -> {name:"Mox Opal", count:4}
	// 	for (const textLine of deckSBArrDirty) {
	// 		if (textLine.length == 0) {
	// 			// skip empty lines.
	// 			continue;
	// 		}
	// 		let newEntry: IDecklistEntry | null = await toDecklistEntry(textLine);
	// 		// data validation
	// 		if (newEntry !== null) {
	// 			// don't push entry if it is = null instead of being of type IDecklistEntry).
	// 			if (
	// 				newEntry.name.length !== 0 && // name must not be empty string
	// 				!Number.isNaN(newEntry.count) && // count must be a number...
	// 				newEntry.count >= 1 // ...that is greater than 0
	// 			) {
	// 				deckSBArr.push(newEntry); // decklist entry successfully added to decklist.
	// 			}
	// 		}
	// 	}
	// 	console.log("deckSBArr", deckSBArr);

	// 	// decklist arrays completed!
	// 	setDeckName(rawDeckName);
	// 	setDeckMain(deckMainArr);
	// 	setDeckSB(deckSBArr);
	// 	setDeck({
	// 		name: rawDeckName,
	// 		main: deckMain,
	// 		sideboard: deckSB,
	// 	});

	// 	// create decklist array with ICard objects ()
	// 	// ...TODO

	// 	// deckbuilding rules (>=60 cards. <=4 of a kind)
	// 	// ...TODO

	// 	// save deck to LocalStorage
	// 	// ...
	// 	console.log("deck:", deck);

	// 	// localStorage.setItem("deck", await JSON.stringify(deck));
	// 	localStorage.setItem("deck", JSON.stringify(deck));
	// };

	const handleLookup = async (cname: string) => {
		const resp = await parseCardName(cname);
		console.log("cname length", cname.length);
		console.log("resp length", resp.length);
	};

	const handleLoadDeck = () => {
		// todo 241014
		// 1. grab deck obj from LocalStorage.

		console.log("handleLoadDeck(): ");
		const deckToLoad = loadDeck();
		console.log("deckToLoad: ", deckToLoad);
		if (deckToLoad !== null) {
			const nameToSet: string = deckToLoad.name;
			const mainToSet: string = deckToLoad.main;
			const sideboardToSet: string = deckToLoad.sideboard;
			setDeck({
				name: deckToLoad.name,
				main: deckToLoad.main,
				sideboard: deckToLoad.sideboard,
			});
			// setDeck({
			// 	name: nameToSet,
			// 	main: mainToSet,
			// 	sideboard: deckToLoad.sideboard,
			// });
			setRawDeckName(deckToLoad.name);
			setRawDeckMain(deckToLoad.main.join("\n"));
			setRawDeckSB(deckToLoad.sideboard);
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
			</section>
		</>
	);
}
