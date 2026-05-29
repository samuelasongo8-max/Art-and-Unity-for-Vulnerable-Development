import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Work.css";

const womenLivelihoodImages = ["/women.png", "/tailoring.jpg", "/Cooking.webp"];
const outreachImages = ["/Shoes.png", "/shoes2.webp"];
const heroBackgroundImages = [
	"/Education2.jpg",
	"/donation.jpg",
	"/Shoes.png",
	"/tailoring.jpg",
	"/Cooking.webp",
];
const heroBlueBackgroundImages = new Set(["/Shoes.png", "/tailoring.jpg", "/Cooking.webp"]);

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
	const [womenImageIndex, setWomenImageIndex] = useState(0);
	const [outreachImageIndex, setOutreachImageIndex] = useState(0);
	const [heroImageIndex, setHeroImageIndex] = useState(0);
	const [typedTitle, setTypedTitle] = useState("");
	const [typedLead, setTypedLead] = useState("");
	const programsHeadingRef = useRef(null);
	const programCardRefs = useRef([]);
	const impactHighlights = [
		{ label: "Healing Through Creativity", targetId: "arts-healing" },
		{ label: "Education and Skills Access", targetId: "education-youth" },
		{ label: "Community Dignity and Inclusion", targetId: "peacebuilding" },
	];
	const heroTitle = "AUVD Programs in Kakuma Refugee Camp";
	const heroLead =
		"Art and Unity for Vulnerable Development (AUVD) works in Kakuma Refugee Camp by creating safe, practical, and inclusive programs that help children, youth, women, and vulnerable families heal, learn, grow skills, and participate fully in community life. Our approach combines arts, education, livelihood support, peacebuilding, and humanitarian outreach so that people can rebuild dignity, strengthen resilience, and access real opportunities for a better future.";
	const activeHeroImage = heroBackgroundImages[heroImageIndex];
	const useBlueHeroBackground = heroBlueBackgroundImages.has(activeHeroImage);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setHeroImageIndex((previous) => (previous + 1) % heroBackgroundImages.length);
		}, 10000);

		return () => window.clearInterval(interval);
	}, []);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setWomenImageIndex((previous) => (previous + 1) % womenLivelihoodImages.length);
		}, 2800);

		return () => window.clearInterval(interval);
	}, []);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setOutreachImageIndex((previous) => (previous + 1) % outreachImages.length);
		}, 3000);

		return () => window.clearInterval(interval);
	}, []);

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

	useEffect(() => {
		let titleIndex = 0;
		let leadIndex = 0;
		let leadTimer;

		const titleTimer = window.setInterval(() => {
			titleIndex += 1;
			setTypedTitle(heroTitle.slice(0, titleIndex));

			if (titleIndex >= heroTitle.length) {
				window.clearInterval(titleTimer);

				leadTimer = window.setInterval(() => {
					leadIndex += 3;
					setTypedLead(heroLead.slice(0, leadIndex));

					if (leadIndex >= heroLead.length) {
						window.clearInterval(leadTimer);
					}
				}, 10);
			}
		}, 40);

		return () => {
			window.clearInterval(titleTimer);
			if (leadTimer) {
				window.clearInterval(leadTimer);
			}
		};
	}, []);

	const resolveImage = (pillar) => {
		if (pillar.id === "livelihoods-women") {
			return womenLivelihoodImages[womenImageIndex];
		}

		if (pillar.id === "outreach-basic-needs") {
			return outreachImages[outreachImageIndex];
		}

		return pillar.image;
	};

	return (
		<main className="work-page">
			<section className={`work-hero${useBlueHeroBackground ? " work-hero--blue" : ""}`}>
				<div className="work-hero-media" aria-hidden="true">
					{heroBackgroundImages.map((image, index) => (
						<img
							key={image}
							src={image}
							alt=""
							className={`work-hero-image${index === heroImageIndex ? " is-active" : ""}`}
						/>
					))}
				</div>
				<div className="work-hero-copy">
					<h1 className="work-type-title">{typedTitle}<span className="work-type-caret" aria-hidden="true"></span></h1>
					<p className="work-lead">
						{typedLead}
					</p>
					{!useBlueHeroBackground ? (
						<div className="work-hero-highlights">
							{impactHighlights.map((highlight) => (
								<a className="work-highlight-pill" href={`#${highlight.targetId}`} key={highlight.targetId}>
									{highlight.label}
								</a>
							))}
						</div>
					) : null}
				</div>
			</section>

			<section className="work-programs-section">
				<div ref={programsHeadingRef} className="work-section-heading work-scroll-panel">
					<p className="work-programs-kicker"> Our Programs</p>
					<h2>Five program pillars guiding AUVD’s work in Kakuma</h2>
				</div>

				<div className="work-programs-grid">
					{programPillars.map((pillar, index) => {
						const imageSource = resolveImage(pillar);
						const isReversed = index % 2 === 1;

						return (
							<article
								ref={(element) => {
									programCardRefs.current[index] = element;
								}}
								className={`work-program-card work-scroll-panel${isReversed ? " work-program-card-reverse" : ""}`}
								id={pillar.id}
								key={pillar.id}
							>
								<div className="work-program-media">
									<div className="work-program-media-shell">
									<img
										key={`${pillar.id}-${imageSource}`}
										src={imageSource}
										alt={pillar.title}
										className="work-program-image"
									/>
										<span className="work-image-glow"></span>
									</div>
								</div>

								<div className="work-program-content">
									<h3>{pillar.title}</h3>
									<p className="work-program-intro">{pillar.intro}</p>

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
							</article>
						);
					})}
				</div>
			</section>
		</main>
	);
}

export default Work;
 
 

