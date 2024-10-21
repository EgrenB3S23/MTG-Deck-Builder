import { ReactElement, useState } from "react";
import { IDeck } from "../interfaces";
import { getCardCounts, getDeckFromLSByID } from "../utils";

interface SelectDeckProps {
	decks: IDeck[];
	onLoadButton: (inputDeck: IDeck) => void;
	// onDeleteButton: Function;
	// onRenameButton: Function;
}

// export function SelectDeck({ decks, onLoadButton }: SelectDeckProps): ReactElement {
export const SelectDeck: React.FC<SelectDeckProps> = ({ decks, onLoadButton }) => {
	// displays a list of saved decks and buttons to load, delete and rename.

	// const [decksArray, setDecksArray] = useState<IDeck[]>(decks);
	// console.log(decks);

	const [targetDeck, setTargetDeck] = useState<IDeck | null>(null); // contains the deck that is currently selected in the <select> element

	// const handleLoadButton = () => {};
	const handleLoadButton = () => {
		console.log("targetDeck: ", targetDeck);

		if (targetDeck) {
			onLoadButton(targetDeck); // Pass the selected deck up to the parent component
		}
	};
	const handleDeleteButton = () => {};
	const handleRenameButton = () => {};

	const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		// whenever a new deck is selected from the list, set it as "targetDeck"
		const selectedDeckId = event.target.value;
		const deck = getDeckFromLSByID(selectedDeckId); // TODO: change to passable function (the aim is to not use localStorage at all inside this component)
		setTargetDeck(deck); // Update state with the selected deck
	};

	const handleTestButton = () => {
		const msg = getDeckFromLSByID("1729505197787");

		console.log(msg);
	};

	return (
		//
		<>
			<section className="selectDeck">
				{/* <div id="taskFormWrapper">
					<article>
						<h1>To do list</h1>
						<p>Like task manager, but for people.</p>
					</article>
					<form onSubmit={handleSubmit} className="task-form" id="taskForm">
						<div className="flex-vertical">
							<input type="text" name="taskTitle" id="taskTitle" placeholder="Task title" className="textbox" value={title} onChange={(e) => setTitle(e.target.value)} />
							<textarea name="taskText" id="taskText" rows={12} placeholder="Task text" className="textbox" value={description} onChange={(e) => setDescription(e.target.value)} />
						</div>

						<div className="flex-horizontal">
							<input type="submit" value="Submit" id="submitTaskBtn" className="btn" />
							<div className="input-with-label">
								<label htmlFor="taskIsDoneChkBox">Task done:</label>
								<input onChange={(e) => setIsDone(e.target.checked)} type="checkbox" name="taskIsDone" id="taskIsDoneChkBox" className="checkbox" checked={isDone} value="isDone" />
							</div>
						</div>
					</form>
				</div> */}

				<div className="selectDeckWrapper">
					<button onClick={handleTestButton} className="btn" id="testBtn" value="test">
						TEST
					</button>
					<select name="deckPicker" id="deckPicker" size={20} onChange={handleSelectChange}>
						{decks.map((deck, index) => (
							<option key={index} value={deck.id}>
								{deck.name} - ID: {deck.id}
							</option>
						))}
					</select>

					<div className="flex-horizontal">
						{/* <button onClick={handleToggleDone} className="btn" id="toggleDoneBtn" value="toggleDone" title="Mark deck as done / not done.">
							{"✔️|➖"}
						</button> */}

						<button onClick={handleLoadButton} className="btn" id="loadDeckBtn" value="Load">
							Load
						</button>
						<button onClick={handleDeleteButton} className="btn" id="deleteDeckBtn" value="Delete">
							Delete
						</button>
						<button onClick={handleRenameButton} className="btn" id="deleteDeckBtn" value="Rename">
							Rename
						</button>
					</div>
				</div>
				<div className="deckDetails">
					{targetDeck ? (
						<div>
							<h2>{targetDeck.name}</h2>
							<h3>ID: {targetDeck.id}</h3>
							<h2>Main: {targetDeck.main.length} cards</h2>
							<h2>Main: {getCardCounts(targetDeck).main} cards</h2>
							{targetDeck.main.map((card, index) => (
								<p key={index}>
									{card.count} <a>{card.name}</a>
									{!card.is_real ? (
										<span>
											<a className="decklist-entry-warning" title="⚠Error: invalid/unverified card name. If spelling is correct, try saving this deck again to retrigger verification.">
												{<span className="warning-emoji">⚠</span>}
											</a>
										</span>
									) : (
										""
									)}
								</p>
							))}
							<h2>Sideboard: {getCardCounts(targetDeck).sideboard} cards</h2>
							{/* <h3>Sideboard: {targetDeck.sideboard.length} cards</h3> */}
							{targetDeck.sideboard.map((card, index) => (
								<p key={index}>
									{card.count} {card.name}
								</p>
							))}

							{/* Add more details as needed */}
						</div>
					) : (
						<p>Select a deck to display details here.</p>
					)}
				</div>
			</section>
		</>
	);
};
