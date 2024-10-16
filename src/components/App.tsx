import { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import "../css/App.css";
import { Footer, Header } from ".";
import { DeckProvider } from "../context";
import { DecksProvider } from "../context/DecksContext";

export function App(): ReactElement {
	return (
		<>
			<DecksProvider>
				<DeckProvider>
					<Header />
					<main>
						<Outlet />
					</main>
					<Footer />
				</DeckProvider>
			</DecksProvider>
		</>
	);
}
