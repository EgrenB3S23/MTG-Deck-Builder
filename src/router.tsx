import { createBrowserRouter } from "react-router-dom";
import { DeckBuilder, LandingPage, ViewDeck } from "./pages";
import { App } from "./components";
// import { cocktailInfoLoader, randomCocktailLoader, ingredientLoader } from "./loaders";

import { randomCardLoader, viewDeckLoader } from "./loaders";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				index: true,
				element: <LandingPage />,
				loader: randomCardLoader,
			},
			{
				path: "/deckbuilder",
				element: <DeckBuilder />,
			},
			{
				path: "/viewdeck",
				// path: "/viewdeck/:id", // for
				element: <ViewDeck />,
				loader: viewDeckLoader,
			},
			// {
			// 	path: "/search",
			// 	element: <SearchPage />,
			// },
			// {
			// 	path: "*",
			// 	element: <NotFound />,
			// },
		],
	},
]);
