export const DecklistReport = () => {
	// displays errors and other messages after attenpting to save, such as misspelled card names, too few cards in deck, deck not legal in any format (todo: allow user to bypass this)

	return (
		<>
			<section id="decklistReportRoot">
				<div id="selectDeckWrapper">
					<select name="selectDeck" id="selectDeck" size={20}>
						{DecksContext.map((deck, i) => (
							<option key={i} value={deck.key}>
								{/* {task.key} - {task.title} */}
								{deck.isDone ? "✔️" : "➖"} {deck.title}
							</option>
						))}
					</select>

					<div className="flex-horizontal">
						<button onClick={handleToggleDone} className="btn" id="toggleDoneBtn" value="toggleDone" title="Mark task as done / not done.">
							{"✔️|➖"}
						</button>

						<button onClick={handleLoad} className="btn" id="loadTaskBtn" value="Load">
							Load
						</button>

						<button onClick={handleDelete} className="btn" id="deleteTaskBtn" value="Delete">
							Delete
						</button>
					</div>
				</div>
			</section>
		</>
	);
};
