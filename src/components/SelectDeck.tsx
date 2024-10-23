import { useContext, useEffect, useState } from "react";
import { IDeck } from "../interfaces";
import { deleteDeckInLS, getCardCounts, getDeckFromLSByID, getDecksFromLS } from "../utils";
import { DecksContext } from "../context";

interface SelectDeckProps {
	// decks: IDeck[];
	onLoadButton: (inputDeck: IDeck) => void;
	onDeleteButton: (inputID: string) => void;
	triggerUpdate: boolean;
}
interface IOption {
	value: string; // deck ID
	label: string; // deck name
}
// export function SelectDeck({ decks, onLoadButton }: SelectDeckProps): ReactElement {
export const SelectDeck: React.FC<SelectDeckProps> = ({ onLoadButton, onDeleteButton, triggerUpdate }) => {
	// displays a list of saved decks and buttons to load, delete and rename.

	// const {targetID, setTargetID} = useState<string>;
	const [targetDeck, setTargetDeck] = useState<IDeck | null>(null); // contains the deck that is currently selected in the <select> element
	const [options, setOptions] = useState<IOption[]>([]); // contais the list elements for <select>.
	const [selectedOption, setSelectedOption] = useState<string>(""); // contains the value field for the selected <option> under <select>

	const [cardCounts, setCardCounts] = useState<{ main: number; sideboard: number }>({ main: 0, sideboard: 0 }); // contains the number of cards in maindeck and sideboard of targetDeck.

	// const deckContext = useContext(DeckContext);

	const decksContext = useContext(DecksContext);

	useEffect(() => {
		console.log("In useEffect([decksContext])");

		const decks = decksContext?.storedDecks;
		// const decks = getDecksFromLS();

		let deckOptions: IOption[] = [];
		// convert list of decks into list of IOptions
		if (decks) {
			deckOptions = decks.map((deck: IDeck) => ({
				value: deck.id,
				label: `${deck.name || "(No Name)"} - ID:${deck.id}`,
			}));
		}

		setOptions(deckOptions);
	}, [decksContext]); // runs on mount and when requested by parent component.
	// useEffect(() => {
	// 	const decks = getDecksFromLS();

	// 	// convert list of decks into list of IOptions
	// 	const deckOptions = decks.map((deck: IDeck) => ({
	// 		value: deck.id,
	// 		label: `${deck.name || "(No Name)"} - ID:${deck.id}`,
	// 	}));

	// 	setOptions(deckOptions);
	// }, [triggerUpdate]); // runs on mount and when requested by parent component.

	useEffect(() => {
		// update cardCounts when a new deck is clicked in the list.
		if (selectedOption) {
			setTargetDeck(getDeckFromLSByID(selectedOption));
		}
	}, [selectedOption]);
	// useEffect(() => {
	// 	// update cardCounts when a new deck is clicked in the list.
	// 	if (selectedOption) {
	// 		setTargetDeck(getDeckFromLSByID(selectedOption));
	// 	}
	// }, [selectedOption]);

	useEffect(() => {
		// update cardCounts when a new deck is clicked in the list.
		if (targetDeck) {
			setCardCounts(getCardCounts(targetDeck));
		} else {
			setCardCounts({ main: 0, sideboard: 0 });
		}
	}, [targetDeck]);

	// useEffect(() => {
	// 	if (targetDeck) {
	// 		setTargetDeck(getDeckFromLSByID(targetDeck.id));
	// 	}
	// }, [triggerUpdate]); // Re-run when triggerUpdate changes (sent by parent component)

	const handleEditButton = () => {
		console.log("targetDeck: ", targetDeck);

		if (targetDeck) {
			onLoadButton(targetDeck); // Pass the selected deck up to the parent component
		}
	};

	const handleDeleteButton = () => {
		// 1. delete targetDeck from LS
		// 2. set targetDeck = null
		// 3. update options (the entries in <select>)

		if (targetDeck) {
			deleteDeckInLS(targetDeck.id);
			setTargetDeck(null);

			const decks = getDecksFromLS();
			// convert list of decks into list of IOptions
			const deckOptions = decks.map((deck: IDeck) => ({
				value: deck.id,
				label: `${deck.name || "(No Name)"} - ID:${deck.id}`,
			}));
			setOptions(deckOptions);
		} else {
			console.log("No deck selected, nothing to delete.");
		}
		// triggerUpdate = !triggerUpdate;
	};

	const handleTestButton = () => {
		const msg = getDeckFromLSByID("1729505197787");

		console.log(msg);
	};

	return (
		//
		<>
			<section className="selectDeck">
				<div className="selectDeckWrapper">
					<select name="deckPicker" id="deckPicker" size={20} onChange={(e) => setSelectedOption(e.target.value)}>
						{/* {decks.map((deck, index) => (
							<option key={index} value={deck.id}>
								{deck.name} - ID: {deck.id}
							</option>
						))} */}
						{options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>

					<div className="flex-horizontal">
						<button onClick={handleEditButton} className="btn" id="editDeckBtn" value="Edit">
							Edit
						</button>
						<button onClick={handleDeleteButton} className="btn" id="deleteDeckBtn" value="Delete">
							Delete
						</button>
						{/* <button onClick={handleRenameButton} className="btn" id="deleteDeckBtn" value="Rename">
							Rename
						</button> */}
					</div>
				</div>
				<div className="deckDetails">
					{targetDeck ? (
						<div>
							<h2>{targetDeck.name}</h2>
							<h3>ID: {targetDeck.id}</h3>
							<h2>Main: {cardCounts.main} cards</h2>
							{targetDeck.main.map((card, index) => (
								<p key={index}>
									{!card.is_real ? (
										<span>
											<a className="decklist-entry-warning" title="⚠Error: invalid/unverified card name. If spelling is correct, try saving this deck again to retrigger verification.">
												{<span className="warning-emoji">⚠</span>}
											</a>
										</span>
									) : (
										"✔"
									)}
									{card.count}{" "}
									<a target="_blank" href={card.is_real ? card.card_info?.scryfall_uri : "#"}>
										{card.name}
									</a>
								</p>
							))}
							<h2>Sideboard: {cardCounts.sideboard} cards</h2>
							{targetDeck.sideboard.map((card, index) => (
								// <p key={index}>
								// 	{card.count} {card.name}
								// </p>
								<p key={index}>
									{!card.is_real ? (
										<span>
											<a className="decklist-entry-warning" title="⚠Error: invalid/unverified card name. If spelling is correct, try saving this deck again to retrigger verification." target="_blank">
												{<span className="warning-emoji">⚠</span>}
											</a>
										</span>
									) : (
										"✔"
									)}
									{card.count}{" "}
									<a target="_blank" href={card.is_real ? card.card_info?.scryfall_uri : "#"}>
										{card.name}
									</a>
								</p>
							))}
						</div>
					) : (
						<p>Select a deck to display details here.</p>
					)}
				</div>
			</section>
		</>
	);
};
