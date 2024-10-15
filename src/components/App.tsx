import { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import "../css/App.css";
import { Footer, Header } from ".";
import { DeckProvider } from "../context";

export function App(): ReactElement {
	return (
		<>
			<DeckProvider>
				<Header />
				<main>
					<Outlet />
				</main>
				<Footer />
			</DeckProvider>
		</>
	);
}
