import { ReactElement, useState } from "react";
import { ICard, IDeck } from "../interfaces";
import { Link } from "react-router-dom";
import "../css/DecklistDisplay.css";
import { getCSSColorFromMTG } from "../utils";

interface DecklistDisplayProps {
	deck: IDeck;
}

export function DecklistDisplay({ deck }: DecklistDisplayProps): ReactElement {
	// takes the provided deck prop and displays the cards as a list with various features.
	const [hoveredCardInfo, setHoveredCardInfo] = useState<ICard | null>(null);
	const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

	function openPopup(url: string, target: string = "_blank", features: string = "width=400,height=300") {
		const popupWindow = window.open(url, target, features);
		popupWindow?.focus();
	}

	// track cursor position
	const handleCursorMove = (event: React.MouseEvent) => {
		setCursorPos({
			x: event.pageX,
			y: event.pageY,
		});
	};

	return (
		<>
			<br />
			<br />
			<br />
			<section className="decklist-display" onMouseMove={handleCursorMove}>
				<h2 className="deck-name">{deck.name}</h2>
				<div className="card-lists">
					<ul className="card-list main">
						<h4 className="card-list-title">Maindeck:</h4>
						{deck.main.map((entry) => (
							// creates one <li/> per card
							<li
								key={entry.name}
								style={{
									//
									backgroundColor: getCSSColorFromMTG(entry.card_info?.colors),
								}}
							>
								{entry.count + " "}
								<Link
									onMouseEnter={() => setHoveredCardInfo(entry.card_info ? entry.card_info : null)}
									onMouseLeave={() => setHoveredCardInfo(null)}
									target="_blank"
									to={entry.card_info ? entry.card_info.scryfall_uri : ""}
									onClick={() => openPopup(entry.card_info ? entry.card_info.scryfall_uri : "", "_blank", "width=1024,height=768")}
								>
									{entry.name}
								</Link>
							</li>
						))}
					</ul>
					<ul className="card-list sideboard">
						<h4 className="card-list-title">Sideboard:</h4>
						{deck.sideboard.map((entry) => (
							// creates one <li/> per card
							<li
								key={entry.name}
								style={{
									//
									backgroundColor: getCSSColorFromMTG(entry.card_info?.colors),
								}}
							>
								{entry.count + " "}
								<Link
									onMouseEnter={() => setHoveredCardInfo(entry.card_info ? entry.card_info : null)}
									onMouseLeave={() => setHoveredCardInfo(null)}
									target="_blank"
									to={entry.card_info ? entry.card_info.scryfall_uri : ""}
									onClick={() => openPopup(entry.card_info ? entry.card_info.scryfall_uri : "", "_blank", "width=1024,height=768")}
								>
									{entry.name}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{hoveredCardInfo && hoveredCardInfo.image_uris && (
					<div
						className="hover-image-wrapper"
						style={{
							position: "absolute",
							top: cursorPos.y + 25,
							left: cursorPos.x + 25,
							pointerEvents: "none",
							zIndex: 1000,
						}}
					>
						<img //
							className="hover-image"
							src={hoveredCardInfo.image_uris.png}
							alt={hoveredCardInfo.name}
							style={{
								width: "300px",
								height: "auto",
							}}
						/>
					</div>
				)}
			</section>
		</>
	);
}
