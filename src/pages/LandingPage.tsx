import { ReactElement, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { baseURL } from "../utils";
import { ICard } from "../interfaces";
import { CardImg } from "../components";
// import { DrinkCard, Spinner } from "../components";

export function LandingPage(): ReactElement {
	// const drink_old = useLoaderData() as IDrinkCard;
	// const [drink, setDrink] = useState<IDrinkCard>(drink_old);
	// const [errorMessage, setErrorMessage] = useState("");
	// const [loading, setLoading] = useState(false);
	// const randomCard = useLoaderData();
	const [randomCard, setRandomCard] = useState<ICard>(useLoaderData() as ICard);
	console.log(randomCard);

	// Fetches a new random card from API
	async function handleButton(): Promise<void> {
		// setErrorMessage("");
		// setLoading(true);

		try {
			// Send fetch request
			const resp = await fetch(`${baseURL}/cards/random`);
			setRandomCard(await resp.json());
		} catch (e) {
			console.error(e);
			// setErrorMessage("Could not retrieve another drink");
			// setLoading(false);
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
			{/* {errorMessage ? <h1 className="errorMessage">{errorMessage}</h1> : null}{" "} */}
			<button onClick={handleButton}>new card</button>
		</section>
	);
}
