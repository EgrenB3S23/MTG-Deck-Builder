import { FormEvent, ReactElement, useState, useContext, useEffect } from "react";
import { IDeck, IDecklistEntry, IDeckStrings } from "../interfaces";
import { areAllCardsVerified, arrowFetchCard, createDeckFromStrings, createStringsFromDeck, generateUniqueID } from "../utils";
import { DecksContext } from "../context";
import { SelectDeck } from "../components/SelectDeck";

export function DeckBuilder(): ReactElement {
	// raw textbox data:
	const [rawDeckID, setRawDeckID] = useState<string>("");
	const [rawDeckName, setRawDeckName] = useState<string>("");
	const [rawDeckMain, setRawDeckMain] = useState<string>("");
	const [rawDeckSB, setRawDeckSB] = useState<string>("");

	// const [deckStrings, setDeckStrings] = useState<[id: string, name: string, main: string, sideboard: string]>(["", "", "", ""]);

	// const [formStrings, setFormStrings] = useState<IDeckStrings>({ idStr: "", nameStr: "", mainStr: "", sideboardStr: "" });

	// deck shows up here when user wants to save a deck.
	const [deckToVerify, setDeckToVerify] = useState<IDeck | null>(null);

	// deck shows up here after successful verification.
	const [deckToStore, setDeckToStore] = useState<IDeck | null>(null);

	// mirror/replacement for localStorage:
	const decksContext = useContext(DecksContext);

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

	async function batchCheck(input: IDecklistEntry[]) {
		// todo 241015: replace batchCheckOld with this.
		// 1. takes a list of decklist entries,
		// 2. fetches card data for each card in list
		// 3. responses will be a mix of <ICard | null>
		// 4. for each returned card object:
		// 4.1. add card info
		// 4.2. add "is_real" flag
		// 4.3. replace name with corrected name ("moxopal"-> "Mox Opal")
		// 5. return cards with the new data added.

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
		}

		return deckOut;
	}

	const handleGenerateID = () => {
		// const newID = generateUniqueID();
		setRawDeckID(generateUniqueID());
	};

	const handleSaveDeck = (e: FormEvent<HTMLFormElement>) => {
		// take raws -> deck Object.
		// setDeckToVerify(deck);
		// ...triggering useEffect([deckToVerify])
		// (this triggers verification, and if verified,)
		e.preventDefault();
		console.log("");
		console.log("### in handleSaveDeck...");

		const deckBeforeCheck: IDeck = createDeckFromStrings(rawDeckID, rawDeckName, rawDeckMain, rawDeckSB);

		setDeckToVerify(deckBeforeCheck);
	};

	const handleLoadDeckForProps = (inputDeck: IDeck) => {
		console.log("In handleLoadDeckForProps()...");
		console.log("Received the following deck: ", inputDeck);

		const deckStr: IDeckStrings = createStringsFromDeck(inputDeck);

		setRawDeckID(deckStr.idStr);
		setRawDeckName(deckStr.nameStr);
		setRawDeckMain(deckStr.mainStr);
		setRawDeckSB(deckStr.sideboardStr);
	};

	return (
		<>
			<section id="deckBuilder">
				<button onClick={handleGenerateID}>New ID</button>
				<form id="decklist-form" onSubmit={handleSaveDeck}>
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
			</section>
			<section>
				<SelectDeck onEditButton={handleLoadDeckForProps} /* setIDStr={setRawDeckID} setNameStr={setRawDeckName} setMainStr={setRawDeckMain} setSideboardStr={setRawDeckSB} */ />
			</section>
		</>
	);
}
