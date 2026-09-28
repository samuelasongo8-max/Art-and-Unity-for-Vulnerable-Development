import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./portfolio.css";

/* Add image paths here to render the hero collage.
   Accepts 1 to 4 entries; an empty array renders nothing. */
const heroImages = [];

const impactItems = [
  { titleKey: "portfolio.coreImpact.items.one.title", textKey: "portfolio.coreImpact.items.one.text" },
  { titleKey: "portfolio.coreImpact.items.two.title", textKey: "portfolio.coreImpact.items.two.text" },
  { titleKey: "portfolio.coreImpact.items.three.title", textKey: "portfolio.coreImpact.items.three.text" },
];

const supportItems = [
  { titleKey: "portfolio.support.items.one.title", textKey: "portfolio.support.items.one.text" },
  { titleKey: "portfolio.support.items.two.title", textKey: "portfolio.support.items.two.text" },
  { titleKey: "portfolio.support.items.three.title", textKey: "portfolio.support.items.three.text" },
  { titleKey: "portfolio.support.items.four.title", textKey: "portfolio.support.items.four.text" },
];

const involvementItems = [
  { titleKey: "portfolio.getInvolved.items.one.title", textKey: "portfolio.getInvolved.items.one.text" },
  { titleKey: "portfolio.getInvolved.items.two.title", textKey: "portfolio.getInvolved.items.two.text" },
  { titleKey: "portfolio.getInvolved.items.three.title", textKey: "portfolio.getInvolved.items.three.text" },
  { titleKey: "portfolio.getInvolved.items.four.title", textKey: "portfolio.getInvolved.items.four.text" },
];

function Portfolio() {
	const { t } = useTranslation();
	const galleryImages = heroImages.slice(0, 4);
	const hasGallery = galleryImages.length > 0;

	const summary = (
		<div className="portfolio-summary">
			<dl className="portfolio-summary__list">
				<div className="portfolio-summary__row">
					<dt className="portfolio-summary__term">{t("portfolio.hero.summaryFocus")}</dt>
					<dd className="portfolio-summary__detail">
						{t("portfolio.hero.summaryFocusValue")}
					</dd>
				</div>
				<div className="portfolio-summary__row">
					<dt className="portfolio-summary__term">{t("portfolio.hero.summaryApproach")}</dt>
					<dd className="portfolio-summary__detail">
						{t("portfolio.hero.summaryApproachValue")}
					</dd>
				</div>
			</dl>

			<div className="portfolio-summary__metrics">
				<p className="portfolio-summary__metric">
					{t("portfolio.hero.metricOne")}
				</p>
				<p className="portfolio-summary__metric">
					{t("portfolio.hero.metricTwo")}
				</p>
			</div>
		</div>
	);

	return (
		<main className="portfolio-page">
			<section className="portfolio-section">
				<p className="portfolio-label">{t("portfolio.hero.label")}</p>
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
							{t("portfolio.hero.eyebrowBefore")} <span className="portfolio-divider">|</span> {t("portfolio.hero.eyebrowAfter")}
						</p>
						<h1 className="portfolio-title portfolio-title--hero">
							{t("portfolio.hero.title")}
						</h1>
						<p className="portfolio-paragraph">
							{t("portfolio.hero.p1")}
						</p>
						<p className="portfolio-paragraph">
							{t("portfolio.hero.p2")}
						</p>
						<Link to="/donate" className="portfolio-link">
							{t("portfolio.hero.donate")}<span className="portfolio-link__arrow">&rsaquo;</span>
						</Link>
						{hasGallery && summary}
					</div>
				</div>
			</section>

			<section className="portfolio-section">
				<p className="portfolio-label">{t("portfolio.coreImpact.label")}</p>

				<div className="portfolio-body">
					<div className="portfolio-column portfolio-column--aside">
						<h2 className="portfolio-title">{t("portfolio.coreImpact.title")}</h2>
					</div>

					<div className="portfolio-column">
						<ul className="portfolio-list">
							{impactItems.map(({ titleKey, textKey }) => (
								<li className="portfolio-list__item" key={titleKey}>
									<article className="portfolio-list__entry">
										<h3 className="portfolio-list__title">{t(titleKey)}</h3>
										<p className="portfolio-paragraph">{t(textKey)}</p>
									</article>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>
			

			<section className="portfolio-section">
				<p className="portfolio-label">{t("portfolio.whyMatters.label")}</p>

				<div className="portfolio-body">
					<div className="portfolio-column portfolio-column--aside">
						<h2 className="portfolio-title">{t("portfolio.whyMatters.title")}</h2>
					</div>

					<div className="portfolio-column">
						<p className="portfolio-paragraph">
							{t("portfolio.whyMatters.p1")}
						</p>
						<p className="portfolio-paragraph">
							{t("portfolio.whyMatters.p2")}
						</p>

						<ul className="portfolio-list">
							<li className="portfolio-list__item">
								<article className="portfolio-list__entry">
									<h3 className="portfolio-list__title">{t("portfolio.whyMatters.listOneTitle")}</h3>
									<p className="portfolio-paragraph">
										{t("portfolio.whyMatters.listOneP1")}
									</p>
									<p className="portfolio-paragraph">
										{t("portfolio.whyMatters.listOneP2")}
									</p>
								</article>
							</li>
							<li className="portfolio-list__item">
								<article className="portfolio-list__entry">
									<h3 className="portfolio-list__title">{t("portfolio.whyMatters.listTwoTitle")}</h3>
									<p className="portfolio-paragraph">
										{t("portfolio.whyMatters.listTwoP1")}
									</p>
								</article>
							</li>
						</ul>
					</div>
				</div>
			</section>

			<section className="portfolio-section">
				<p className="portfolio-label">{t("portfolio.support.label")}</p>

				<div className="portfolio-body">
					<div className="portfolio-column portfolio-column--aside">
						<h2 className="portfolio-title">
							{t("portfolio.support.title")}
						</h2>
					</div>

					<div className="portfolio-column">
						<ul className="portfolio-list">
							{supportItems.map(({ titleKey, textKey }) => (
								<li className="portfolio-list__item" key={titleKey}>
									<article className="portfolio-list__entry">
										<h3 className="portfolio-list__title">{t(titleKey)}</h3>
										<p className="portfolio-paragraph">{t(textKey)}</p>
									</article>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			<section className="portfolio-section">
				<p className="portfolio-label">{t("portfolio.getInvolved.label")}</p>

				<div className="portfolio-body">
					<div className="portfolio-column portfolio-column--aside">
						<h2 className="portfolio-title">{t("portfolio.getInvolved.title")}</h2>
						<p className="portfolio-paragraph">
							{t("portfolio.getInvolved.intro")}
						</p>
					</div>

					<div className="portfolio-column">
						<ul className="portfolio-list">
							{involvementItems.map(({ titleKey, textKey }) => (
								<li className="portfolio-list__item" key={titleKey}>
									<article className="portfolio-list__entry">
										<h3 className="portfolio-list__title">{t(titleKey)}</h3>
										<p className="portfolio-paragraph">{t(textKey)}</p>
									</article>
								</li>
							))}
						</ul>

						<article className="portfolio-volunteer">
							<p className="portfolio-volunteer__label">{t("portfolio.getInvolved.volunteerLabel")}</p>
							<h3 className="portfolio-volunteer__title">
								{t("portfolio.getInvolved.volunteerTitle")}
							</h3>
							<p className="portfolio-paragraph">
								{t("portfolio.getInvolved.volunteerTextBefore")} {" "}
								<a
									className="portfolio-inline-link"
									href="mailto:artandunityforvulnerable.org@gmail.com"
								>
									artandunityforvulnerable.org@gmail.com
								</a>{" "}
								{t("portfolio.getInvolved.volunteerTextAfter")}
							</p>
							<a
								className="portfolio-link"
								href="mailto:artandunityforvulnerable.org@gmail.com"
							>
								{t("portfolio.getInvolved.sendExpression")}<span className="portfolio-link__arrow">&rsaquo;</span>
							</a>
						</article>
					</div>
				</div>
			</section>
		</main>
	);
}

export default Portfolio;
