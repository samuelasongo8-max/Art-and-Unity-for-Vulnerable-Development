import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
	FaHandHoldingHeart,
	FaHandsHoldingCircle,
	FaPeopleCarryBox,
	FaPeopleGroup,
	FaSchool,
	FaShieldHeart,
	FaShoePrints,
	FaTruckFast,
} from "react-icons/fa6";
import "./portfolio.css";

const impactItems = [
	{
		title: "Protection",
		icon: <FaShoePrints />,
		text: "Proper footwear helps protect children from injuries, infections, and harsh walking conditions within schools, homes, and community spaces.",
	},
	{
		title: "Education",
		icon: <FaSchool />,
		text: "With safe and comfortable shoes, children are better able to attend school regularly, participate confidently, and focus on learning.",
	},
	{
		title: "Health & Well-Being",
		icon: <FaShieldHeart />,
		text: "The program contributes to child protection, personal dignity, health, and daily well-being for children and youth across the camp.",
	},
];

const supportItems = [
	{
		title: "Vulnerable Children & Families",
		text: "The program prioritizes children and households most in need of safe and proper footwear support.",
	},
	{
		title: "School Attendance & Participation",
		text: "Children are better able to attend school comfortably, move confidently, and participate fully in daily activities.",
	},
	{
		title: "Health, Protection & Dignity",
		text: "Proper footwear strengthens protection, reduces health risks, and promotes dignity and well-being among children and youth.",
	},
	{
		title: "Community Empowerment",
		text: "The initiative encourages collaboration, trust, and community participation in supporting vulnerable families.",
	},
];

const involvementItems = [
	{
		title: "Partner with AUVD",
		icon: <FaHandsHoldingCircle />,
		text: "Collaborate with AUVD to strengthen the implementation, outreach, and long-term sustainability of the Shoes Distribution Program.",
	},
	{
		title: "Support Distribution Activities",
		icon: <FaTruckFast />,
		text: "Help expand logistics, transportation, community outreach, and shoe distribution efforts across Kakuma Refugee Camp.",
	},
	{
		title: "Volunteer in Community Outreach",
		icon: <FaPeopleCarryBox />,
		text: "Contribute your time, skills, and experience to support community engagement and outreach activities.",
	},
	{
		title: "Donate for Impact",
		icon: <FaHandHoldingHeart />,
		text: "Your support helps provide dignity, safety, comfort, and hope to vulnerable children and families through access to proper footwear.",
	},
];

function Portfolio() {
	useEffect(() => {
		const revealedElements = Array.from(document.querySelectorAll("[data-reveal]"));

		if (revealedElements.length === 0) {
			return undefined;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) {
						return;
					}

					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				});
			},
			{
				threshold: 0.18,
				rootMargin: "0px 0px -8% 0px",
			}
		);

		revealedElements.forEach((element) => observer.observe(element));

		return () => observer.disconnect();
	}, []);

	return (
		<main className="portfolio-page">
			<section className="portfolio-hero">
				<div className="portfolio-shell portfolio-hero-grid">
					<div className="portfolio-hero-copy portfolio-reveal portfolio-reveal-up is-visible" data-reveal>
						<p className="portfolio-eyebrow">Outreach Program</p>
						<h1>Shoes Distribution Program</h1>
						<p className="portfolio-lead">
							At AUVD, we believe every child deserves to walk safely, attend school with confidence,
							and live with dignity. Through our Shoes Distribution Program, we provide safe and proper
							footwear to vulnerable children and families in Kakuma Refugee Camp, helping improve
							protection, school attendance, health, and overall well-being.
						</p>

						<div className="portfolio-hero-actions">
							<Link to="/donate" className="portfolio-primary-link">Donate</Link>
							<p className="portfolio-support-note">
								Your support helps AUVD coordinate shoe distribution activities, outreach,
								transportation, and logistics to ensure shoes reach vulnerable children and families
								safely and effectively.
							</p>
						</div>
					</div>

					<aside className="portfolio-hero-panel portfolio-reveal portfolio-reveal-right is-visible" aria-label="Program summary" data-reveal>
						<div className="portfolio-panel-row">
							<span className="portfolio-panel-label">Focus</span>
							<strong>Protection, dignity, and school participation</strong>
						</div>
						<div className="portfolio-panel-row">
							<span className="portfolio-panel-label">Approach</span>
							<strong>Distribution, outreach, and community partnership</strong>
						</div>
						<div className="portfolio-panel-metrics">
							<article>
						 
								<p>Safe footwear for children and families most at risk.</p>
							</article>
							<article>
							 
								<p>Improved school attendance, health, and daily confidence.</p>
							</article>
						</div>
					</aside>
				</div>
			</section>

			<section className="portfolio-shell portfolio-section portfolio-reveal portfolio-reveal-up" data-reveal>
				<div className="portfolio-section-heading">
					<p className="portfolio-section-kicker">Core impact</p>
					<h2>Designed around what children need most</h2>
				</div>
          
				<div className="portfolio-impact-grid">
					{impactItems.map(({ title, icon, text }, index) => (
						<article
							key={title}
							className="portfolio-card portfolio-impact-card portfolio-reveal portfolio-reveal-up"
							data-reveal
							style={{ transitionDelay: `${index * 110}ms` }}
						>
							<span className="portfolio-icon-wrap">{icon}</span>
							<h3>{title}</h3>
							<p>{text}</p>
						</article>
					))}
				</div>
			</section>

			<section className="portfolio-shell portfolio-section portfolio-story-grid">
				<div className="portfolio-story-copy portfolio-card portfolio-card-dark portfolio-reveal portfolio-reveal-left" data-reveal>
					<p className="portfolio-section-kicker">Why This Program Matters</p>
					<h2>Restoring dignity through practical support</h2>
					<p>
						We partner with Because International, with AUVD serving as a distributor in Kakuma Refugee Camp.
						Because International donates Shoes That Grow, and together we support children and families who
						lack proper footwear, helping improve safety, dignity, and access to education.
					</p>
					<p>
						Many children in Kakuma walk long distances every day without shoes, exposing them to
						injuries, health risks, and challenges attending school comfortably. Through this program,
						AUVD seeks to restore confidence, protection, and hope while supporting children to live
						healthier and safer lives.
					</p>
				</div>

				<div className="portfolio-story-side">
					<article className="portfolio-card portfolio-story-highlight portfolio-reveal portfolio-reveal-right" data-reveal>
						<span className="portfolio-icon-wrap portfolio-icon-wrap-alt">
							<FaHandsHoldingCircle />
						</span>
						<h3>Partnership & Community Collaboration</h3>
						<p>
							Because International donates Shoes That Grow, while AUVD helps distribute them to vulnerable
							children and families in Kakuma Refugee Camp alongside other supporting partners.
						</p>
						<p>
							Through partnership, we strengthen outreach efforts, improve distribution capacity, and
							increase support for vulnerable children and families.
						</p>
					</article>

					<article className="portfolio-card portfolio-mini-card portfolio-reveal portfolio-reveal-up" data-reveal>
						<p className="portfolio-mini-label">Partnership value</p>
						<p>
							Stronger logistics, better coordination, and wider support for families who need help most.
						</p>
					</article>
				</div>
			</section>

			<section className="portfolio-shell portfolio-section portfolio-reveal portfolio-reveal-up" data-reveal>
				<div className="portfolio-section-heading">
					<p className="portfolio-section-kicker">The program supports</p>
					<h2>Support that reaches both children and the wider community</h2>
				</div>

				<div className="portfolio-support-grid">
					{supportItems.map(({ title, text }, index) => (
						<article
							key={title}
							className="portfolio-card portfolio-support-card portfolio-reveal portfolio-reveal-up"
							data-reveal
							style={{ transitionDelay: `${index * 90}ms` }}
						>
							<h3>{title}</h3>
							<p>{text}</p>
						</article>
					))}
				</div>



			</section>

			<section className="portfolio-shell portfolio-section portfolio-get-involved portfolio-reveal portfolio-reveal-up" data-reveal>
				<div className="portfolio-section-heading portfolio-section-heading-wide">
					<p className="portfolio-section-kicker">Get Involved</p>
					<h2>There are practical ways to create lasting impact</h2>
					<p>
						There are many ways individuals, organizations, and partners can support this program and
						create lasting impact in the community.
					</p>
				</div>

             

				<div className="portfolio-involvement-grid">
					{involvementItems.map(({ title, icon, text }, index) => (
						<article
							key={title}
							className="portfolio-card portfolio-involvement-card portfolio-reveal portfolio-reveal-up"
							data-reveal
							style={{ transitionDelay: `${index * 100}ms` }}
						>
							<span className="portfolio-icon-wrap">{icon}</span>
							<h3>{title}</h3>
							<p>{text}</p>
						</article>
					))}
				</div>

				<div className="portfolio-cta-strip portfolio-reveal portfolio-reveal-up" data-reveal>
					<div>
						<p className="portfolio-mini-label">Volunteer With Us</p>
						<h3>If you want to volunteer with us, send an expression of interest by email.</h3>
						<p>
							Email us at <a className="portfolio-email-link" href="mailto:artandunityforvulnerable.org@gmail.com">artandunityforvulnerable.org@gmail.com</a>
						  and one of our team members will get back to you within four days.
						</p>
					</div>
					<a className="portfolio-secondary-link" href="mailto:artandunityforvulnerable.org@gmail.com">Send expression of interest</a>
				</div>
			</section>
		</main>
	);
}

export default Portfolio;
 