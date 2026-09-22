import { Link } from "react-router-dom";
import "./portfolio.css";

/* Add image paths here to render the hero collage.
   Accepts 1 to 4 entries; an empty array renders nothing. */
const heroImages = [];

const impactItems = [
	{
		title: "Protection",
		text: "Proper footwear helps protect children from injuries, infections, and harsh walking conditions within schools, homes, and community spaces.",
	},
	{
		title: "Education",
		text: "With safe and comfortable shoes, children are better able to attend school regularly, participate confidently, and focus on learning.",
	},
	{
		title: "Health & Well-Being",
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
		text: "Collaborate with AUVD to strengthen the implementation, outreach, and long-term sustainability of the Shoes Distribution Program.",
	},
	{
		title: "Support Distribution Activities",
		text: "Help expand logistics, transportation, community outreach, and shoe distribution efforts across Kakuma Refugee Camp.",
	},
	{
		title: "Volunteer in Community Outreach",
		text: "Contribute your time, skills, and experience to support community engagement and outreach activities.",
	},
	{
		title: "Donate for Impact",
		text: "Your support helps provide dignity, safety, comfort, and hope to vulnerable children and families through access to proper footwear.",
	},
];

function Portfolio() {
	const galleryImages = heroImages.slice(0, 4);
	const hasGallery = galleryImages.length > 0;

	const summary = (
		<div className="portfolio-summary">
			<dl className="portfolio-summary__list">
				<div className="portfolio-summary__row">
					<dt className="portfolio-summary__term">Focus</dt>
					<dd className="portfolio-summary__detail">
						Protection, dignity, and school participation
					</dd>
				</div>
				<div className="portfolio-summary__row">
					<dt className="portfolio-summary__term">Approach</dt>
					<dd className="portfolio-summary__detail">
						Distribution, outreach, and community partnership
					</dd>
				</div>
			</dl>

			<div className="portfolio-summary__metrics">
				<p className="portfolio-summary__metric">
					Safe footwear for children and families most at risk.
				</p>
				<p className="portfolio-summary__metric">
					Improved school attendance, health, and daily confidence.
				</p>
			</div>
		</div>
	);

	return (
		<main className="portfolio-page">
			<section className="portfolio-section">
				<p className="portfolio-label">Outreach Program</p>
				<div className="portfolio-body">
					<div className="portfolio-column portfolio-column--aside">
						{hasGallery && (
							<div className="portfolio-gallery">
								{galleryImages.map((image, index) => (
									<figure
										key={image.src}
										className={`portfolio-gallery__frame portfolio-gallery__frame--${index + 1}`}
									>
										<img className="portfolio-gallery__image" src={image.src} alt={image.alt} />
									</figure>
								))}
							</div>
						)}

						{!hasGallery && summary}
					</div>

					<div className="portfolio-column">
						<p className="portfolio-eyebrow">
							AUVD <span className="portfolio-divider">|</span> Kakuma Refugee Camp
						</p>
						<h1 className="portfolio-title portfolio-title--hero">
							Shoes Distribution Program
						</h1>
						<p className="portfolio-paragraph">
							At AUVD, we believe every child deserves to walk safely, attend school with confidence,
							and live with dignity. Through our Shoes Distribution Program, we provide safe and proper
							footwear to vulnerable children and families in Kakuma Refugee Camp, helping improve
							protection, school attendance, health, and overall well-being.
						</p>
						<p className="portfolio-paragraph">
							Your support helps AUVD coordinate shoe distribution activities, outreach,
							transportation, and logistics to ensure shoes reach vulnerable children and families
							safely and effectively.
						</p>
						<Link to="/donate" className="portfolio-link">
							Donate<span className="portfolio-link__arrow">&rsaquo;</span>
						</Link>
						{hasGallery && summary}
					</div>
				</div>
			</section>

			<section className="portfolio-section">
				<p className="portfolio-label">Core impact</p>

				<div className="portfolio-body">
					<div className="portfolio-column portfolio-column--aside">
						<h2 className="portfolio-title">Designed around what children need most</h2>
					</div>

					<div className="portfolio-column">
						<ul className="portfolio-list">
							{impactItems.map(({ title, text }) => (
								<li className="portfolio-list__item" key={title}>
									<article className="portfolio-list__entry">
										<h3 className="portfolio-list__title">{title}</h3>
										<p className="portfolio-paragraph">{text}</p>
									</article>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>
			

			<section className="portfolio-section">
				<p className="portfolio-label">Why This Program Matters</p>

				<div className="portfolio-body">
					<div className="portfolio-column portfolio-column--aside">
						<h2 className="portfolio-title">Restoring dignity through practical support</h2>
					</div>

					<div className="portfolio-column">
						<p className="portfolio-paragraph">
							We partner with Because International, with AUVD serving as a distributor in Kakuma Refugee Camp.
							Because International donates Shoes That Grow, and together we support children and families who
							lack proper footwear, helping improve safety, dignity, and access to education.
						</p>
						<p className="portfolio-paragraph">
							Many children in Kakuma walk long distances every day without shoes, exposing them to
							injuries, health risks, and challenges attending school comfortably. Through this program,
							AUVD seeks to restore confidence, protection, and hope while supporting children to live
							healthier and safer lives.
						</p>

						<ul className="portfolio-list">
							<li className="portfolio-list__item">
								<article className="portfolio-list__entry">
									<h3 className="portfolio-list__title">Partnership &amp; Community Collaboration</h3>
									<p className="portfolio-paragraph">
										Because International donates Shoes That Grow, while AUVD helps distribute them to vulnerable
										children and families in Kakuma Refugee Camp alongside other supporting partners.
									</p>
									<p className="portfolio-paragraph">
										Through partnership, we strengthen outreach efforts, improve distribution capacity, and
										increase support for vulnerable children and families.
									</p>
								</article>
							</li>
							<li className="portfolio-list__item">
								<article className="portfolio-list__entry">
									<h3 className="portfolio-list__title">Partnership value</h3>
									<p className="portfolio-paragraph">
										Stronger logistics, better coordination, and wider support for families who need help most.
									</p>
								</article>
							</li>
						</ul>
					</div>
				</div>
			</section>

			<section className="portfolio-section">
				<p className="portfolio-label">The program supports</p>

				<div className="portfolio-body">
					<div className="portfolio-column portfolio-column--aside">
						<h2 className="portfolio-title">
							Support that reaches both children and the wider community
						</h2>
					</div>

					<div className="portfolio-column">
						<ul className="portfolio-list">
							{supportItems.map(({ title, text }) => (
								<li className="portfolio-list__item" key={title}>
									<article className="portfolio-list__entry">
										<h3 className="portfolio-list__title">{title}</h3>
										<p className="portfolio-paragraph">{text}</p>
									</article>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			<section className="portfolio-section">
				<p className="portfolio-label">Get Involved</p>

				<div className="portfolio-body">
					<div className="portfolio-column portfolio-column--aside">
						<h2 className="portfolio-title">There are practical ways to create lasting impact</h2>
						<p className="portfolio-paragraph">
							There are many ways individuals, organizations, and partners can support this program and
							create lasting impact in the community.
						</p>
					</div>

					<div className="portfolio-column">
						<ul className="portfolio-list">
							{involvementItems.map(({ title, text }) => (
								<li className="portfolio-list__item" key={title}>
									<article className="portfolio-list__entry">
										<h3 className="portfolio-list__title">{title}</h3>
										<p className="portfolio-paragraph">{text}</p>
									</article>
								</li>
							))}
						</ul>

						<article className="portfolio-volunteer">
							<p className="portfolio-volunteer__label">Volunteer With Us</p>
							<h3 className="portfolio-volunteer__title">
								If you want to volunteer with us, send an expression of interest by email.
							</h3>
							<p className="portfolio-paragraph">
								Email us at{" "}
								<a
									className="portfolio-inline-link"
									href="mailto:artandunityforvulnerable.org@gmail.com"
								>
									artandunityforvulnerable.org@gmail.com
								</a>{" "}
								and one of our team members will get back to you within four days.
							</p>
							<a
								className="portfolio-link"
								href="mailto:artandunityforvulnerable.org@gmail.com"
							>
								Send expression of interest<span className="portfolio-link__arrow">&rsaquo;</span>
							</a>
						</article>
					</div>
				</div>
			</section>
		</main>
	);
}

export default Portfolio;
