import React, { useState } from "react";

export const DecklistForm = () => {
	const [rawDeckName, setRawDeckName] = useState("");
	const [rawDeckMain, setRawDeckMain] = useState("");
	const [rawDeckSB, setRawDeckSB] = useState("");

	const handleSaveDeck = (e: { preventDefault: () => void }) => {
		e.preventDefault();

		const deckData = {
			name: rawDeckName,
			main: rawDeckMain.split("\n").map((card) => ({ name: card.trim(), count: card[0] })),
			sideboard: rawDeckSB.split("\n").map((card) => ({ name: card.trim(), count: card[0] })),
		};

		localStorage.setItem("storedSingleDeck", JSON.stringify(deckData));
		console.log("Deck saved:", deckData);
	};

	return (
		<form id="decklist-form" onSubmit={handleSaveDeck}>
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
			></textarea>
			<button type="submit">Save deck</button>
		</form>
	);
};
