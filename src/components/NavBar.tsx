import { ReactElement } from "react";
import { NavLink } from "react-router-dom";

export function NavBar(): ReactElement {
	return (
		<nav id="navbar">
			<ul>
				<li>
					<NavLink to="/">
						<h2>Home</h2>
					</NavLink>
				</li>
				<li>
					<NavLink to="/search">
						<h2>Search</h2>
					</NavLink>
				</li>
				<li>
					<NavLink to="/deckbuilder">
						<h2>Deck Builder</h2>
					</NavLink>
				</li>
				<li>
					<NavLink to="/viewdeck">
						<h2>View Deck</h2>
					</NavLink>
				</li>
			</ul>
		</nav>
	);
}
