import { impacts } from "../OurImpact";
import ImpactGrid from "./ImpactGrid";

/* /our-impact/news — News entries only.

   Just the News heading and the shared ImpactGrid, exactly as this page was
   before the Moments section was added and later moved to its own page at
   /our-impact/post. */
const News = () => <ImpactGrid category="News" items={impacts} />;

export default News;
