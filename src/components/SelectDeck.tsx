import { ReactElement, useEffect, useState } from "react";
import { IDeck } from "../interfaces";
import { deleteDeckInLS, getCardCounts, getDeckFromLSByID, getDecksFromLS } from "../utils";

interface SelectDeckProps {
	decks: IDeck[];
	onLoadButton: (inputDeck: IDeck) => void;
	onDeleteButton: (inputID: string) => void;
	triggerUpdate: boolean;
	// onDeleteButton: Function;
	// onRenameButton: Function;
}
interface IOption {
	value: string; // deck ID
	label: string; // deck name
}
// export function SelectDeck({ decks, onLoadButton }: SelectDeckProps): ReactElement {
export const SelectDeck: React.FC<SelectDeckProps> = ({ decks, onLoadButton, onDeleteButton, triggerUpdate }) => {
	// displays a list of saved decks and buttons to load, delete and rename.

	// const {targetID, setTargetID} = useState<string>;
	const [targetDeck, setTargetDeck] = useState<IDeck | null>(null); // contains the deck that is currently selected in the <select> element

	const [options, setOptions] = useState<IOption[]>([]);
	const [selectedOption, setSelectedOption] = useState<string>("");

	const [cardCounts, setCardCounts] = useState<{ main: number; sideboard: number }>({ main: 0, sideboard: 0 });

	useEffect(() => {
		const decks = getDecksFromLS();

		// convert list of decks into list of IOptions
		const deckOptions = decks.map((deck: IDeck) => ({
			value: deck.id,
			label: `${deck.name || "(No Name)"} - ID:${deck.id}`,
		}));

		setOptions(deckOptions);
	}, [, triggerUpdate]); // run on mount

	useEffect(() => {
		// update cardCounts when a new deck is clicked in the list.
		setTargetDeck(getDeckFromLSByID(selectedOption));
	}, [selectedOption]);

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

	const handleLoadButton = () => {
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

	const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		// whenever a new deck is selected from the list, set it as "targetDeck"
		const selectedDeckID: string = event.target.value;
		const deck = getDeckFromLSByID(selectedDeckID); // TODO: change to passable function (the aim is to not use localStorage at all inside this component)
		setTargetDeck(deck);
		// setTargetDeck(deck); // Update state with the selected deck
	};

	const handleSelectChangeNew = (e: React.ChangeEvent<HTMLSelectElement>) => {
		//
		setSelectedOption(e.target.value);
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
					<button onClick={handleTestButton} className="btn" id="testBtn" value="test">
						TEST
					</button>

					{/* <select name="deckPicker" id="deckPicker" size={20} onChange={handleSelectChange}>
						{decks.map((deck, index) => (
							<option key={index} value={deck.id}>
								{deck.name} - ID: {deck.id}
							</option>
						))}
					</select> */}

					{/* <select name="deckPickerNew" id="deckPickerNew" size={20} value={selectedOption} onChange={handleSelectChangeNew}> */}
					{/* <select name="deckPickerNew" id="deckPickerNew" size={20} value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}> */}
					<select name="deckPickerNew" id="deckPickerNew" size={20} onChange={(e) => setSelectedOption(e.target.value)}>
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
						<button onClick={handleLoadButton} className="btn" id="loadDeckBtn" value="Load">
							Load
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
