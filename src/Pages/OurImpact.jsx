import ImpactGrid from "./our-impact/ImpactGrid";
import "./OurImpact.css";

/* ==========================================================================
   Impact content — replace the placeholder card with real AUVD content.
   The four News cards below are copies of the posts in Blogs.jsx.
   ========================================================================== */
// TODO: Replace the "Sample news title" card with real AUVD news content and a
// real image from the public folder (e.g. image: "/your-real-photo.jpg").
// TODO: When the report is published, add entries with category 'Report'.
// Only News entries live here right now. Blogs are rendered by Blogs.jsx on
// /our-impact/blogs and are intentionally NOT part of this array, so they never
// appear in the All or News grids. News.jsx and Report.jsx reuse this array,
// which is why it is exported from the page that owns it.
//
// Entry shape rendered by the shared ImpactGrid:
//   id         unique key
//   title      card title (shown unless buttonLink is set)
//   buttonLink optional route path — when set, a "Learn more" <Link> button
//              is shown in place of the title and navigates client-side
//   category   "News" (or "Report" once reports are published)
//   metaLabel  optional text next to the calendar icon in the meta row
//   date       optional ISO date — the card shows how many WEEKS ago it was
//   excerpt    optional 3-line summary under the title
//   tag        optional small uppercase label above the title
//   image      optional image path
//   alt        optional image alt text (defaults to the title)
//   imageFit   optional "contain" (default: "cover")
// eslint-disable-next-line react-refresh/only-export-components
export const impacts = [
  {
    id: 1,
    category: "News",
    metaLabel: "13 August 2026",
    date: "2026-08-13",
    image: "/Foundation_Logo_Lockup.png",
    alt: "Foundation logo",
    imageFit: "contain",
    buttonLink: "/news/daddario-community-music-grant",
  },
  {
    id: 2,
    title:
      "Youth Peace Week workshops used music to build peace, healing, and opportunity.",
    category: "News",
    metaLabel: "October 2025 · 4 min read",
    // TODO: Set the real publication date for this post.
    date: "2025-10-01",
    excerpt:
      "The workshops used music and creative arts to promote peacebuilding, mental well-being, education, and community empowerment among refugee and host community youth. Each event focused on a distinct global day, giving young people space to learn, perform, reflect, and connect through music. By blending music, conversation, and collective participation, the workshops created an environment where young people could engage deeply with peacebuilding themes while also growing in confidence and expression.",
    image: "/Youth peace week.jpg",
  },
  {
    id: 3,
    title:
      "Receiving music instruments through international partnership and support.",
    category: "News",
    metaLabel: "2025 Milestone · 3 min read",
    // TODO: Set the real publication date for this post.
    date: "2025-01-01",
    excerpt:
      "AUVD received music instruments through the support of the Transylvanian Symphony Foundation, helping expand access to music education for young artists in Kakuma. This support strengthened AUVD's music education work by placing real instruments into the hands of children and youth who were eager to learn, practice, and grow through creative expression. The initiative was also supported by Hungry for Music, whose mission of putting quality musical instruments into young hands aligns closely with AUVD's goal of building opportunity, confidence, and hope through music.",
    image: "/donation.jpg",
  },
  {
    id: 4,
    // Blogs.jsx gives this post only the category "Community" (used as the tag
    // below) and no date, so no weeks-ago text is shown.
    tag: "Community",
    title: "Music Reaches Every Corner",
    category: "News",
    excerpt:
      "Dozens of children and youth gathered with their new instruments, from violins to keyboards, ready to start learning together.",
    image: "/violin.jpg",
  },
  {
    id: 5,
    // Blogs.jsx gives this post only the category "First Notes" (used as the tag
    // below) and no date, so no weeks-ago text is shown.
    tag: "First Notes",
    title: "A New Ukulele, A New Start",
    category: "News",
    excerpt:
      "For many children, this was the first instrument they had ever held. Small moments like this build confidence and joy.",
    image: "/donation-2.jpg",
  },
];

/* ==========================================================================
   /our-impact — "All" view: every entry in the impacts array.
   The shared ImpactGrid does the filtering and renders the cards.
   ========================================================================== */
const OurImpact = () => <ImpactGrid category="All" items={impacts} />;

export default OurImpact;
