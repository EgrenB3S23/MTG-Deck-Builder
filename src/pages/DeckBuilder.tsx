import { FormEvent, ReactElement, useState, useContext, useEffect } from "react";
import { IDeck, IDecklistEntry, IDeckStrings } from "../interfaces";
import { areAllCardsVerified, arrowFetchCard, deleteDeckInLS, generateUniqueID, getDecksFromLS, saveDeckToLS } from "../utils";
import { DeckContext, DecksContext } from "../context";
import { SelectDeck } from "../components/SelectDeck";

export function DeckBuilder(): ReactElement {
	// raw textbox data:
	const [rawDeckID, setRawDeckID] = useState<string>("");
	const [rawDeckName, setRawDeckName] = useState<string>("");
	const [rawDeckMain, setRawDeckMain] = useState<string>("");
	const [rawDeckSB, setRawDeckSB] = useState<string>("");

	// deck state, used to store deck before verification which is required to store it in deckContext.
	const [loadedDeck, setLoadedDeck] = useState<IDeck | null>(null);

	// deck shows up here when user wants to save a deck.
	const [deckToVerify, setDeckToVerify] = useState<IDeck | null>(null);

	// deck shows up here after successful verification.
	const [deckToStore, setDeckToStore] = useState<IDeck | null>(null);

	// store a deck for use across any future tools that needs a decklist (such as goldfishing simulator)
	const deckContext = useContext(DeckContext);

	// mirror/replacement for localStorage:
	const decksContext = useContext(DecksContext);

	// hackjob to force-refresh SelectDeck component:
	const [triggerUpdate, setTriggerUpdate] = useState(false); // Trigger state for updates

	useEffect(() => {
		// setup deckID input field on mount to have at the ready when saving deck.
		// setRawDeckID(generateUniqueID("d"));
	}, []);

	useEffect(() => {
		// setup deckID input field on mount to have at the ready when saving deck.

		if (loadedDeck) {
			console.log(`loadedDeck changed:`, loadedDeck);
			const deckStrings = createStringsFromDeckNew(loadedDeck);
			setRawDeckID(deckStrings.idStr);
			setRawDeckName(deckStrings.nameStr);
			setRawDeckMain(deckStrings.mainStr);
			setRawDeckSB(deckStrings.sideboardStr);
		} else {
			// if loadedDeck is null,
			setRawDeckID(generateUniqueID);
			setRawDeckName("");
			setRawDeckMain("");
			setRawDeckSB("");
		}
	}, [loadedDeck]);

	//
	useEffect(() => {
		console.log(`in useEffect(,[deckToVerify])`, deckToVerify);

		if (deckToVerify) {
			if (areAllCardsVerified(deckToVerify)) {
				// if here, deck is fully verified.
				setDeckToStore(deckToVerify);
				setDeckToVerify(null);
			} else {
				// if here, deck needs verifying.
				verifyAndStoreDeck(deckToVerify); // also nulls deckToVerify when done.
			}
		}
	}, [deckToVerify]);

	useEffect(() => {
		console.log(`in useEffect(,[deckToStore])`, deckToStore);

		if (deckToStore) {
			decksContext?.createOrUpdateDeck(deckToStore);
		}
		setDeckToStore(null);
	}, [deckToStore]);

	// Save deck to state and localStorage
	// const saveDeck = (newDeck: IDeck) => {
	// 	setLoadedDeck(newDeck);
	// 	localStorage.setItem("deckUnckecked", JSON.stringify(newDeck));
	// };

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

	function createStringsFromDeckNew(input: IDeck): IDeckStrings {
		console.log("in createStringsFromDeck...");
		console.log("input.ID", input.id);
		console.log("input.name", input.name);
		console.log("input.main", input.main);
		console.log("input.sideboard", input.sideboard);

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

	function createDeckFromStrings(inputID: string, inputName: string, inputMain: string, inputSB: string): IDeck {
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

		console.log("deckName: ", inputName);
		console.log("deckMain: ", deckMain);
		console.log("deckSB: ", deckSB);

		return {
			id: inputID,
			name: inputName,
			main: deckMain,
			sideboard: deckSB,
		};
	}

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
			if (data[i] && retVal[i]) {
				//if here, card exists!
				retVal[i].card_info = data[i]!; // ! : non-null assertion operator ("i hereby solemnly swear that data[i] is not null")
				if (retVal[i].card_info!.name) {
					retVal[i].name = retVal[i].card_info!.name; // replace written name (i.e. "moxlotus") with correctly spaced & capitalized name ("Mox Lotus") from card_info.
					retVal[i].is_real = true;
				} else retVal[i].is_real = false;
			} else retVal[i].is_real = false;
		}
		return retVal;
	}

	async function verifyAndStoreDeck(deckIn: IDeck) {
		// fetches cards and verifies card names.
		// then stores
		// called by useEffect(,[deckToVerify])
		console.log("in verifyAndStoreDeck()", deckIn);

		const deckChecked = await deckCheck(deckIn);
		if (areAllCardsVerified(deckChecked)) {
			setDeckToStore(deckChecked);
		} else {
			console.warn(`deck verification failed. check spelling. Deck: `, deckIn);
			// setDeckToStore(null);
		}
		setDeckToVerify(null);
	}

	async function deckCheck(deckIn: IDeck) {
		// fetches cards info for provided deck and verifies each card (sets flag is_real to true/false)

		console.log(`in deckCheck()`);

		let deckOut: IDeck = deckIn;

		if (deckIn) {
			const checkedMain = await batchCheck(deckIn.main);
			const checkedSideboard = await batchCheck(deckIn.sideboard);

			deckOut.main = checkedMain;
			deckOut.sideboard = checkedSideboard;
		}

		if (areAllCardsVerified(deckOut)) {
			console.log("All cards verified!");

			// setLoadedDeck<(deckOut);
		}

		return deckOut;
	}

	async function verifyDeck(deckIn: IDeck) {}

	const handleSaveDeckNew = (e: FormEvent<HTMLFormElement>) => {
		// take raws -> deck Object.
		// setDeckToVerify(deck);
		// ...triggering useEffect([deckToVerify])
		// (this triggers verification, and if verified,)
		e.preventDefault();
		console.log("");
		console.log("### in handleSaveDeckNew...");

		const deckBeforeCheck: IDeck = createDeckFromStrings(rawDeckID, rawDeckName, rawDeckMain, rawDeckSB);

		setDeckToVerify(deckBeforeCheck);

		// let deckChecked: IDeck = deckCheck(deckBeforeCheck);

		// if deckUnchecked
	};

	const handleLoadDeckForProps = (inputDeck: IDeck) => {
		console.log("In handleLoadDeckForProps()...");
		console.log("Received the following deck: ", inputDeck);

		setLoadedDeck(inputDeck);
		deckContext?.setDeck(inputDeck);
	};

	const handleDeleteDeckForProps = (inputID: string) => {
		console.log("in handleDeleteDeckForProps()...");
		deleteDeckInLS(inputID);
		setTriggerUpdate(!triggerUpdate);
	};

	// const handleLoadDeck = () => {
	// 	// todo 241014
	// 	// 1. load IDeck object from localStorage
	// 	// 2. save the IDeckobject with setDeck()
	// 	// 3. convert IDeck object to raw decklist strings and send those to decklist form textboxes)

	// 	console.log("handleLoadDeck(): ");

	// 	// 1. load IDeck object from localStorage
	// 	const deckToLoad = loadDeck(); // IDeck object (or null if error)
	// 	console.log("deckToLoad: ", deckToLoad);

	// 	// 2. save the IDeckobject with setDeck()
	// 	if (deckToLoad !== null) {
	// 		setLoadedDeck({
	// 			// save deck object to state
	// 			id: deckToLoad.id,
	// 			name: deckToLoad.name,
	// 			main: deckToLoad.main,
	// 			sideboard: deckToLoad.sideboard,
	// 		});

	// 		// 3. set raws

	// 		const stringsObj = createStringsFromDeckNew(deckToLoad);
	// 		const rawIDStr = stringsObj.idStr;
	// 		const rawNameStr = stringsObj.nameStr;
	// 		const rawMainStr = stringsObj.mainStr;
	// 		const rawSideboardStr = stringsObj.sideboardStr;

	// 		setRawDeckID(rawIDStr);
	// 		setRawDeckName(rawNameStr);
	// 		setRawDeckMain(rawMainStr);
	// 		setRawDeckSB(rawSideboardStr);
	// 		console.log("rawIDStr: ", rawIDStr);
	// 		console.log("rawNameStr: ", rawNameStr);
	// 		console.log("rawMainStr: ", rawMainStr);
	// 		console.log("rawSideboardStr: ", rawSideboardStr);
	// 		setTriggerUpdate(!triggerUpdate);
	// 	}
	// };

	return (
		<>
			<section id="deckBuilder">
				<br />
				{/* <input type="text" id="searchtext" /> */}
				<br />
				<form id="decklist-form" onSubmit={handleSaveDeckNew}>
					<input //
						name="deckID"
						id="deckID"
						placeholder="Deck ID"
						value={rawDeckID}
						onChange={(e) => setRawDeckID(e.target.value)}
					/>
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
				{/* <button onClick={handleLoadDeck}>(test)Load example deck</button> */}
			</section>
			<section>
				<SelectDeck onLoadButton={handleLoadDeckForProps} onDeleteButton={handleDeleteDeckForProps} triggerUpdate={triggerUpdate} />
			</section>
		</>
	);
}
