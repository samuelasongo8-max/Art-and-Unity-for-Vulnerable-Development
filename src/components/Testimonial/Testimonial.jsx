import React from 'react';

const Testimonial = () => {
    return (
        <div>Testimonial</div>
    )
}

export default Testimonial;
import React from "react";
import "./Testimonial.css";

function Testimonial({
  image = "/child-on-swing.jpg",
  text = "",
  authorName = "",
  authorLocation = "",
}) {
  return (
    <div className="testimonial-wrapper">
      <img
        src={image}
        alt={authorName ? `${authorName} testimonial` : "testimonial image"}
        className="testimonial-image"
      />

      <div className="testimonial-box">
        <div className="testimonial-text" dangerouslySetInnerHTML={{ __html: text }} />

        <div className="author">
          <span className="author-name">{authorName}</span>
          {authorLocation}
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
