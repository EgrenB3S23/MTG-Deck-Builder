import { useContext } from "react";
import { DecksContext } from "../context";

export const SelectDeck = () => {
	// const { decks } = useContext(DecksContext);
	// const [ decks ] = useContext(DecksContext []);
	// const [decks, setDecks] = useContext(DecksContext);
	const decksC = useContext(DecksContext);

	// todo 241017: improve no-decks-found swap-out
	if (!decksC || !Array.isArray(decksC)) {
		return (
			<>
				<div id="selectDeckWrapper" className="select-deck-wrapper empty">
					<p>You have no saved decks!</p>
				</div>
			</>
		);
	}

	return (
		<>
			<div id="selectDeckWrapper" className="select-deck-wrapper">
				<select name="selectDeck" id="selectDeck" size={20}>
					{decksC.map((deck, i) => (
						<option key={i} value={deck.key}>
							{deck.title}
						</option>
					))}
				</select>
				{/* 
				<select name="selectDeck" id="selectDeck" size={20}>
					{DecksContext.map((deck, i) => (
						<option key={i} value={deck.key}>
							{deck.title}
						</option>
					))}
				</select>
                */}
			</div>
		</>
	);
};

/*
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
*/
