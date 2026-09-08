import "./JaggedBanner.css";

function JaggedBanner() {
  return (
    <div className="ss-banner-wrapper">
      <svg
        className="ss-banner-divider"
        viewBox="0 0 1280 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon
          points="0,28 90,28 150,20 220,25 300,8 380,23 460,14 540,27 620,5 700,21 790,12 860,28 940,16 1020,24 1100,6 1180,20 1280,10 1280,40 0,40"
          fill="#ff6600" /* ← change this hex to adjust the TOP zigzag color */
        />
      </svg>

      <div className="ss-banner-purple">
        <p>[TOGETHER, WE CREATE OPPORTUNITIES, EMPOWER COMMUNITIES, AND TRANSFORM LIVES THROUGH CREATIVITY, EDUCATION, INCLUSION, AND INNOVATION.
]</p>
      </div>

      <svg
        className="ss-banner-divider"
        viewBox="0 0 1280 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon
          points="0,8 80,18 160,5 240,24 330,12 410,30 500,10 590,22 680,4 760,27 850,14 930,31 1020,9 1110,23 1200,6 1280,18 1280,0 0,0"
          fill="#ff6600" /* ← change this hex to adjust the BOTTOM zigzag color */
        />
      </svg>
    </div>
  );
}

export default JaggedBanner;