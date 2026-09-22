import { impacts } from "../OurImpact";
import ImpactGrid from "./ImpactGrid";

/* /our-impact/news — News entries only. */
const News = () => <ImpactGrid category="News" items={impacts} />;

export default News;
