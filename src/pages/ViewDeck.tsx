import { ReactElement, useContext, useState } from "react";
import { DeckContext } from "../context";
import { useLoaderData } from "react-router-dom";
import { IDeck } from "../interfaces";
import { DecklistDisplay } from "../components";
// displays decklist sorted by card type, showing various stats and other goodies.

export function ViewDeck(): ReactElement {
	const deckContext = useContext(DeckContext);
	const [loadedDeck, setloadedDeck] = useState<IDeck>(useLoaderData() as IDeck);
	return (
		<>
			<section id="viewDeck">
				<DecklistDisplay deck={loadedDeck} />
			</section>
		</>
	);
}
