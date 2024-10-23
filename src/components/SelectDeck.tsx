import { useContext, useEffect, useState } from "react";
import { IDeck } from "../interfaces";
import { getCardCounts } from "../utils";
import { DeckContext, DecksContext } from "../context";

interface SelectDeckProps {
	onEditButton: (inputDeck: IDeck) => void;
	// setIDStr?: React.Dispatch<React.SetStateAction<string>>;
	// setNameStr?: React.Dispatch<React.SetStateAction<string>>;
	// setMainStr?: React.Dispatch<React.SetStateAction<string>>;
	// setSideboardStr?: React.Dispatch<React.SetStateAction<string>>;
}
interface IOption {
	value: string; // deck ID
	label: string; // deck name
}
// export function SelectDeck({ decks, onEditButton }: SelectDeckProps): ReactElement {
export const SelectDeck: React.FC<SelectDeckProps> = ({ onEditButton /* setIDStr, setNameStr, setMainStr, setSideboardStr */ }) => {
	// displays a list of saved decks and buttons to load, delete and rename.

	const [targetDeck, setTargetDeck] = useState<IDeck | null>(null); // contains the deck that is currently selected in the <select> element
	const [options, setOptions] = useState<IOption[]>([]); // contais the list elements for <select>.
	const [selectedOption, setSelectedOption] = useState<string>(""); // contains the value field (a deck ID) for the selected <option> under <select>

	const [cardCounts, setCardCounts] = useState<{ main: number; sideboard: number }>({ main: 0, sideboard: 0 }); // contains the number of cards in maindeck and sideboard of targetDeck.

	const deckContext = useContext(DeckContext);

	const decksContext = useContext(DecksContext);

	useEffect(() => {
		const decks = decksContext?.storedDecks;

		let deckOptions: IOption[] = [];
		// convert list of decks into list of IOptions
		if (decks) {
			deckOptions = decks.map((deck: IDeck) => ({
				value: deck.id,
				label: `${deck.name || "(No Name)"} - ID:${deck.id}`,
			}));
		}
		setOptions(deckOptions);
	}, [decksContext]);

	useEffect(() => {
		// set targetDeck when a new deck is selected from the list.
		if (selectedOption) {
			if (decksContext?.storedDecks) {
				const newTargetDeck = decksContext?.readDeck(selectedOption);
				setTargetDeck(newTargetDeck);
			}
		}
	}, [selectedOption]);

	useEffect(() => {
		// update cardCounts when a new deck is clicked in the list.
		if (targetDeck) {
			setCardCounts(getCardCounts(targetDeck));
		} else {
			setCardCounts({ main: 0, sideboard: 0 });
		}
	}, [targetDeck]);

	const handleEditButton = () => {
		if (targetDeck) {
			console.log("targetDeck: ", targetDeck);
			onEditButton(targetDeck); // Pass the selected deck up to the parent component
		}
	};

	const handleDeleteButton = () => {
		if (targetDeck) {
			decksContext?.deleteDeck(targetDeck.id);
			setTargetDeck(null);
		} else {
			console.log("No deck selected, nothing to delete.");
		}
	};
	const handleSetActiveButton = () => {
		if (targetDeck) {
			deckContext?.setDeck(targetDeck);
			localStorage.setItem("deckActive", JSON.stringify(targetDeck));
		}
	};

	return (
		<>
			<section className="selectDeck">
				<div className="selectDeckWrapper">
					<select name="deckPicker" id="deckPicker" size={20} onChange={(e) => setSelectedOption(e.target.value)}>
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
						<button onClick={handleSetActiveButton} className="btn" id="setActiveDeckBtn" value="SetActive">
							Set Active deck
						</button>
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
