import { ReactElement, useState } from "react";
import { IDeck } from "../interfaces";
import { getCardCounts, getDeckFromLSByID } from "../utils";

interface SelectDeckProps {
	decks: IDeck[];
}

export function SelectDeck({ decks }: SelectDeckProps): ReactElement {
	// displays a list of saved decks and buttons to load, delete and rename.

	const [decksArray, setDecksArray] = useState<IDeck[]>(decks);
	const [selectedDeck, setSelectedDeck] = useState<IDeck | null>(null);

	const handleLoadButton = () => {};
	const handleDeleteButton = () => {};
	const handleRenameButton = () => {};

	const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedDeckId = event.target.value;
		const deck = getDeckFromLSByID(selectedDeckId);
		setSelectedDeck(deck); // Update state with the selected deck
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
					{selectedDeck ? (
						<div>
							<h2>{selectedDeck.name}</h2>
							<h3>ID: {selectedDeck.id}</h3>
							<h2>Main: {selectedDeck.main.length} cards</h2>
							<h2>Main: {getCardCounts(selectedDeck).main} cards</h2>
							{selectedDeck.main.map((card, index) => (
								<p key={index}>
									{!card.is_real ? (
										<span>
											<a className="decklist-entry-warning" title="invalid/unverified card name">
												{"⚠"}
											</a>
										</span>
									) : (
										""
									)}
									{card.count} <a>{card.name}</a>
								</p>
							))}
							<h2>Sideboard: {getCardCounts(selectedDeck).sideboard} cards</h2>
							{/* <h3>Sideboard: {selectedDeck.sideboard.length} cards</h3> */}
							{selectedDeck.sideboard.map((card, index) => (
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
}
