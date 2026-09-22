import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import ImpactHero from "../components/ImpactHero";
import "./Work.css";

const womenLivelihoodImages = ["/women.png", "/tailoring.jpg", "/Cooking.webp"];
const outreachImages = ["/Shoes.png", "/shoes2.webp"];

const programPillars = [
	{
		id: "arts-healing",
		title: "Arts, Healing & Psychosocial Well-being",
		intro:
			"This program focuses on emotional healing, creativity, and mental health support through arts-based approaches.",
		image: "/drawing2.jpg",
		actions: [
			{
				to: "/Music",
				label: "Explore music",
			},
			{
				to: "/dance",
				label: "Explore dance",
			},
		],
		programs: [
			"Creative Arts & Expression Program",
			"Mental Health & Psychosocial Support (MHPSS) Program",
		],
		focus: [
			"Trauma healing through art",
			"Emotional well-being and resilience",
			"Safe spaces for expression",
			"Creative talent development",
		],
	},
	{
		id: "education-youth",
		title: "Education, Youth Development & Empowerment",
		intro:
			"This program focuses on learning, skills development, and preparing young people for the future.",
		image: "/Education2.jpg",
		action: {
			to: "/pricing",
			label: "Explore more",
		},
		programs: [
			"Youth Empowerment & Skills Development Program",
			"Inclusive Education & After-School Support Program",
		],
		focus: [
			"Life skills and leadership development",
			"Academic support for learners",
			"Digital and vocational skills",
			"Mentorship and career guidance",
		],
	},
	{
		id: "livelihoods-women",
		title: "Livelihoods & Women Economic Empowerment",
		intro:
			"This program focuses on income generation, self-reliance, and women’s economic inclusion.",
		rotatingImages: womenLivelihoodImages,
		programs: [
			"Women’s Empowerment Program",
			"Vocational Training & Livelihood Program",
		],
		focus: [
			"Entrepreneurship and small business development",
			"Skills training (tailoring, catering, crafts, beauty)",
			"Savings groups and financial literacy",
			"Women’s leadership and independence",
		],
	},
	{
		id: "peacebuilding",
		title: "Peacebuilding & Community Inclusion",
		intro:
			"This program promotes unity, coexistence, and community participation.",
		image: "/Unity.webp",
		programs: [
			"Peacebuilding & Community Dialogue Program",
			"Community Engagement & Inclusion Program",
		],
		focus: [
			"Conflict resolution and dialogue",
			"Social cohesion between refugees and host communities",
			"Community participation and awareness",
			"Volunteerism and civic engagement",
		],
	},
	{
		id: "outreach-basic-needs",
		title: "Humanitarian Outreach & Basic Needs Support",
		intro:
			"This program addresses urgent needs and supports dignity for vulnerable people.",
		rotatingImages: outreachImages,
		action: {
			to: "/portfolio",
			label: "Explore more",
		},
		programs: [
			"Outreach Program (Shoes Distribution in partnership with Because International)",
		],
		focus: [
			"Shoes distribution for children and vulnerable groups",
			"School support and dignity enhancement",
			"Emergency and basic needs assistance",
			"Community-based outreach services",
		],
	},
];

function Work() {
	const location = useLocation();
	const programsHeadingRef = useRef(null);
	const programCardRefs = useRef([]);
	/* Existing in-hero anchor pills: same three destinations the old Work hero
	   showed, mapped onto ImpactHero's links slot. */
	const impactHighlights = [
		{ label: "Healing Through Creativity", targetId: "arts-healing" },
		{ label: "Education and Skills Access", targetId: "education-youth" },
		{ label: "Community Dignity and Inclusion", targetId: "peacebuilding" },
	];
	const heroTitle = "AUVD Programs in Kakuma Refugee Camp";
	const heroLead =
		"Art and Unity for Vulnerable Development (AUVD) works in Kakuma Refugee Camp by creating safe, practical, and inclusive programs that help children, youth, women, and vulnerable families heal, learn, grow skills, and participate fully in community life. Our approach combines arts, education, livelihood support, peacebuilding, and humanitarian outreach so that people can rebuild dignity, strengthen resilience, and access real opportunities for a better future.";

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
					heading={heroTitle}
					paragraph={heroLead}
					image="/donation.jpg"
					imageAlt="AUVD community members gathered together"
					links={impactHighlights.map((highlight) => ({
						label: highlight.label,
						href: `#${highlight.targetId}`,
					}))}
				/>
			</div>

			<section className="work-programs-section">
				{/* Section band: this page's existing kicker is the label, its
				    existing heading is promoted to the section title. */}
				<section ref={programsHeadingRef} className="work-section-heading work-scroll-panel">
					<p className="work-programs-kicker"> Our Programs</p>
					<h2 className="work-section-title">Five program pillars guiding AUVD’s work in Kakuma</h2>
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
								<p className="work-pillar-label">{pillar.title}</p>

								<div className="work-pillar-body">
									<div className={`work-collage work-collage--${images.length}`}>
										{images.map((source, imageIndex) => (
											<img
												alt={imageIndex === 0 ? pillar.title : `${pillar.title} - additional photo ${imageIndex + 1}`}
												className={`work-collage-item work-collage-item--${imageIndex + 1}`}
												key={source}
												src={source}
											/>
										))}
									</div>

									<div className="work-pillar-text">
										<h2 className="work-pillar-title">{pillar.title}</h2>
										<p className="work-pillar-intro">{pillar.intro}</p>

										<div className="work-program-block">
											<h4>Programs under this pillar</h4>
											<ul>
												{pillar.programs.map((item) => (
													<li key={item}>{item}</li>
												))}
											</ul>
										</div>

										<div className="work-program-block">
											<h4>Focus</h4>
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
														{action.label}
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
 
 

