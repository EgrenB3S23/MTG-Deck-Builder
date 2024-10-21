import { ReactElement, useState } from "react";
import { IDeck, IDecklistEntry } from "../interfaces";
import { getDecksFromLS, getDeckFromLSByID } from "../utils";

interface SelectDeckProps {
	decks: IDeck[];
}

export function SelectDeck({ decks }: SelectDeckProps): ReactElement {
	// displays a list of saved decks and buttons to load, delete and rename.

	const [decksList, setDecksList] = useState<IDeck[]>(decks);

	const handleLoadButton = () => {};
	const handleDeleteButton = () => {};
	const handleRenameButton = () => {};

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
					<select name="deckPicker" id="deckPicker" size={20}>
						{decks.map((deck, index) => (
							<option key={index} value={deck.id}>
								{deck.name}
								{" - ID: "}
								{deck.id}
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
			</section>
		</>
	);
}
