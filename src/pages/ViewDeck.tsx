import { ReactElement, /* useContext, */ useState } from "react";
// import { DeckContext } from "../context";
import { useLoaderData } from "react-router-dom";
import { IDeck } from "../interfaces";
import { DecklistDisplay } from "../components";
import { sortDeck } from "../utils";
// displays decklist sorted by card type, showing various stats and other goodies.

export function ViewDeck(): ReactElement {
	// const deckContext = useContext(DeckContext);
	const [loadedDeck, setloadedDeck] = useState<IDeck>(useLoaderData() as IDeck);

	function filterRealCards(deck: IDeck): IDeck {
		// filters out invalid cards to avoid issues with DecklistDisplay
		return {
			...deck,
			main: deck.main.filter((card) => card.is_real === true),
			sideboard: deck.sideboard.filter((card) => card.is_real === true),
		};
	}

	let filteredDeck = filterRealCards(loadedDeck); // removes invalid cads (like misspelled names)

	return (
		<>
			<section id="viewDeck">
				{/* <DecklistDisplay deck={loadedDeck} /> */}
				<DecklistDisplay deck={sortDeck(filteredDeck)} />
			</section>
		</>
	);
}
