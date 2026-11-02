import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ImpactHero from "../components/ImpactHero";
import "./Work.css";
import OurPrograms from '../components/OurPrograms';

function Work() {
	const { t } = useTranslation();
	const location = useLocation();
	/* Existing in-hero anchor pills: same three destinations the old Work hero
	   showed, mapped onto ImpactHero's links slot. */
	const impactHighlights = [
		{ labelKey: "work.hero.links.one", targetId: "arts-healing" },
		{ labelKey: "work.hero.links.two", targetId: "education-youth" },
		{ labelKey: "work.hero.links.three", targetId: "peacebuilding" },
	];

	useEffect(() => {
		if (!location.hash) {
			return;
		}

		const targetId = location.hash.replace("#", "");
		const scrollToTarget = () => {
			const targetElement = document.getElementById(targetId);

			if (!targetElement) {
				return false;
			}

			targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
			return true;
		};

		if (scrollToTarget()) {
			return;
		}

		const timeoutId = window.setTimeout(scrollToTarget, 120);
		return () => window.clearTimeout(timeoutId);
	}, [location.hash]);

	return (
		<main className="work-page">
			{/* Full-bleed hero — the shared ImpactHero component (same design as
			    Our Story), with this page's own heading, paragraph and anchor
			    highlights. The photo is one of the images this hero already
			    used; every other former hero image still appears in the
			    sections below. */}
			<div className="work-hero-bleed">
				<ImpactHero
					heading={t("work.hero.heading")}
					paragraph={t("work.hero.paragraph")}
					image="/donation.jpg"
					imageAlt={t("work.hero.imageAlt")}
					links={impactHighlights.map((highlight) => ({
						label: t(highlight.labelKey),
						href: `#${highlight.targetId}`,
					}))}
				/>
			</div>

			<OurPrograms />
		</main>
	);
}

export default Work;
 
 
