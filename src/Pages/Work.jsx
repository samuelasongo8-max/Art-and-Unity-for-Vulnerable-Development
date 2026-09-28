import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ImpactHero from "../components/ImpactHero";
import "./Work.css";

const womenLivelihoodImages = ["/women.png", "/tailoring.jpg", "/Cooking.webp"];
const outreachImages = ["/Shoes.png", "/shoes2.webp"];

/* ==========================================================================
   The five program pillars.

   Only routes, images and TRANSLATION KEYS live here. Every visible string is
   resolved with t() while rendering, so switching language updates the whole
   page immediately with no reload. The ids double as the anchor targets the
   hero pills and #livelihoods-women deep link rely on, so they are unchanged.
   ========================================================================== */
const programPillars = [
	{
		id: "arts-healing",
		titleKey: "work.programs.pillars.arts-healing.title",
		introKey: "work.programs.pillars.arts-healing.intro",
		image: "/drawing2.jpg",
		actions: [
			{ to: "/Music", labelKey: "work.programs.pillars.arts-healing.actions_one" },
			{ to: "/dance", labelKey: "work.programs.pillars.arts-healing.actions_two" },
		],
		programs: [
			"work.programs.pillars.arts-healing.programs_one",
			"work.programs.pillars.arts-healing.programs_two",
		],
		focus: [
			"work.programs.pillars.arts-healing.focus_one",
			"work.programs.pillars.arts-healing.focus_two",
			"work.programs.pillars.arts-healing.focus_three",
			"work.programs.pillars.arts-healing.focus_four",
		],
	},
	{
		id: "education-youth",
		titleKey: "work.programs.pillars.education-youth.title",
		introKey: "work.programs.pillars.education-youth.intro",
		image: "/Education2.jpg",
		action: { to: "/pricing", labelKey: "work.programs.pillars.education-youth.action" },
		programs: [
			"work.programs.pillars.education-youth.programs_one",
			"work.programs.pillars.education-youth.programs_two",
		],
		focus: [
			"work.programs.pillars.education-youth.focus_one",
			"work.programs.pillars.education-youth.focus_two",
			"work.programs.pillars.education-youth.focus_three",
			"work.programs.pillars.education-youth.focus_four",
		],
	},
	{
		id: "livelihoods-women",
		titleKey: "work.programs.pillars.livelihoods-women.title",
		introKey: "work.programs.pillars.livelihoods-women.intro",
		rotatingImages: womenLivelihoodImages,
		programs: [
			"work.programs.pillars.livelihoods-women.programs_one",
			"work.programs.pillars.livelihoods-women.programs_two",
		],
		focus: [
			"work.programs.pillars.livelihoods-women.focus_one",
			"work.programs.pillars.livelihoods-women.focus_two",
			"work.programs.pillars.livelihoods-women.focus_three",
			"work.programs.pillars.livelihoods-women.focus_four",
		],
	},
	{
		id: "peacebuilding",
		titleKey: "work.programs.pillars.peacebuilding.title",
		introKey: "work.programs.pillars.peacebuilding.intro",
		image: "/Unity.webp",
		programs: [
			"work.programs.pillars.peacebuilding.programs_one",
			"work.programs.pillars.peacebuilding.programs_two",
		],
		focus: [
			"work.programs.pillars.peacebuilding.focus_one",
			"work.programs.pillars.peacebuilding.focus_two",
			"work.programs.pillars.peacebuilding.focus_three",
			"work.programs.pillars.peacebuilding.focus_four",
		],
	},
	{
		id: "outreach-basic-needs",
		titleKey: "work.programs.pillars.outreach-basic-needs.title",
		introKey: "work.programs.pillars.outreach-basic-needs.intro",
		rotatingImages: outreachImages,
		action: { to: "/portfolio", labelKey: "work.programs.pillars.outreach-basic-needs.action" },
		programs: ["work.programs.pillars.outreach-basic-needs.programs_one"],
		focus: [
			"work.programs.pillars.outreach-basic-needs.focus_one",
			"work.programs.pillars.outreach-basic-needs.focus_two",
			"work.programs.pillars.outreach-basic-needs.focus_three",
			"work.programs.pillars.outreach-basic-needs.focus_four",
		],
	},
];

function Work() {
	const { t } = useTranslation();
	const location = useLocation();
	const programsHeadingRef = useRef(null);
	const programCardRefs = useRef([]);
	/* Existing in-hero anchor pills: same three destinations the old Work hero
	   showed, mapped onto ImpactHero's links slot. */
	const impactHighlights = [
		{ labelKey: "work.hero.links.one", targetId: "arts-healing" },
		{ labelKey: "work.hero.links.two", targetId: "education-youth" },
		{ labelKey: "work.hero.links.three", targetId: "peacebuilding" },
	];

	useEffect(() => {
		const animatedElements = [
			programsHeadingRef.current,
			...programCardRefs.current.filter(Boolean),
		];

		const observers = animatedElements.map((element) => {
			const observer = new IntersectionObserver(
				([entry]) => {
					if (!entry.isIntersecting) {
						return;
					}

					element.classList.add("work-scroll-entered");
					observer.unobserve(element);
				},
				{
					threshold: 0.35,
				}
			);

			observer.observe(element);
			return observer;
		});

		return () => observers.forEach((observer) => observer.disconnect());
	}, []);

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

	/* Every image a pillar carries still renders — as the collage column.
	   Pillars with a single image get one large frame; the pillars that used
	   to swap between several images now show all of them side by side. */
	const resolveImages = (pillar) => {
		if (pillar.rotatingImages) {
			return pillar.rotatingImages;
		}

		return pillar.image ? [pillar.image] : [];
	};

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

			<section className="work-programs-section">
				{/* Section band: this page's existing kicker is the label, its
				    existing heading is promoted to the section title. */}
				<section ref={programsHeadingRef} className="work-section-heading work-scroll-panel">
					<p className="work-programs-kicker"> {t("work.programs.kicker")}</p>
					<h2 className="work-section-title">{t("work.programs.title")}</h2>
				</section>

				<div className="work-programs-grid">
					{programPillars.map((pillar, index) => {
						const images = resolveImages(pillar);
						const isReversed = index % 2 === 1;

						return (
							<section
								ref={(element) => {
									programCardRefs.current[index] = element;
								}}
								className={`work-pillar work-scroll-panel${isReversed ? " work-pillar--flip" : ""}`}
								id={pillar.id}
								key={pillar.id}
							>
								{/* Same text the pillar heading already carried; it
								    now sits above the body as the section label. */}
								<p className="work-pillar-label">{t(pillar.titleKey)}</p>

								<div className="work-pillar-body">
									<div className={`work-collage work-collage--${images.length}`}>
										{images.map((source, imageIndex) => (
											<img
												alt={
									imageIndex === 0
										? t(pillar.titleKey)
										: t("work.programs.pillars." + pillar.id + ".additionalPhoto", { count: imageIndex + 1 })
									}
												className={`work-collage-item work-collage-item--${imageIndex + 1}`}
												key={source}
												src={source}
											/>
										))}
									</div>

									<div className="work-pillar-text">
										<h2 className="work-pillar-title">{t(pillar.titleKey)}</h2>
										<p className="work-pillar-intro">{t(pillar.introKey)}</p>

										<div className="work-program-block">
											<h4>{t("work.programs.programsHeading")}</h4>
											<ul>
												{pillar.programs.map((item) => (
													<li key={item}>{t(item)}</li>
												))}
											</ul>
										</div>

										<div className="work-program-block">
											<h4>{t("work.programs.focusHeading")}</h4>
											<ul className="work-focus-list">
												{pillar.focus.map((item) => (
													<li key={item}>{item}</li>
												))}
											</ul>
										</div>

										{(pillar.actions || (pillar.action ? [pillar.action] : [])).length > 0 ? (
											<div className="work-program-actions">
												{(pillar.actions || [pillar.action]).map((action) => (
													<Link className="work-program-button" key={`${pillar.id}-${action.to}`} to={action.to}>
														{t(action.labelKey)}
													</Link>
												))}
											</div>
										) : null}
									</div>
								</div>
							</section>
						);
					})}
				</div>
			</section>
		</main>
	);
}

export default Work;
 
 

