import { ReactElement, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { baseURL } from "../utils";
import { ICard } from "../interfaces";
import { CardImg } from "../components";

export function LandingPage(): ReactElement {
	const [randomCard, setRandomCard] = useState<ICard>(useLoaderData() as ICard);
	console.log("randomCard", randomCard);
	const randomCardVar = randomCard;
	console.log("randomCardVar: ", randomCardVar);

	// Fetches a new random card from API
	async function handleButton(): Promise<void> {
		try {
			// Send fetch request
			const resp = await fetch(`${baseURL}/cards/random`);
			setRandomCard(await resp.json());
		} catch (e) {
			console.error(e);
		}
	}

	return (
		<section id="landingPage">
			{}
			<h2>Random card:</h2>
			<img></img>
			{/*  */}
			{}
			{/* <CardImg imgUrl={randomCard.image_uris.png} alt={randomCard.name} caption={randomCard.name}></CardImg> */}
			<CardImg card={randomCard}></CardImg>
			<button onClick={handleButton}>new card</button>
		</section>
	);
}
