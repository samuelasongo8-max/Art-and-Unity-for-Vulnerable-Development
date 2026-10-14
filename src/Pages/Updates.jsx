import CommunityUpdates from "../components/CommunityUpdates";

/**
 * /updates — Community Updates & Stories as a full page.
 * Reuses the Home section component (and its CSS) so both views stay
 * identical; `variant="page"` swaps the carousel track for a grid and
 * drops the carousel-only controls.
 */
export default function Updates() {
  return <CommunityUpdates variant="page" />;
}
