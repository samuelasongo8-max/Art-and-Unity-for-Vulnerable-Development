import { useState } from "react";

export default function SafeImage({
  src,
  alt = "",
  className = "",
  fallbackLabel = "Image unavailable",
  ...imageProps
}) {
  const [imageState, setImageState] = useState(() => ({
    src,
    loaded: false,
    failed: !src,
  }));
  const currentState = imageState.src === src
    ? imageState
    : { src, loaded: false, failed: !src };

  const classes = `${className}${currentState.loaded ? " safe-image-loaded" : " safe-image-loading"}`;

  if (currentState.failed) {
    return (
      <div className={`${className} safe-image-fallback`} role="img" aria-label={alt || fallbackLabel}>
        <span aria-hidden="true">▧</span>
        <span>{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      {...imageProps}
      className={classes}
      src={src}
      alt={alt}
      loading={imageProps.loading || "lazy"}
      decoding={imageProps.decoding || "async"}
      onLoad={() => setImageState({ src, loaded: true, failed: false })}
      onError={() => setImageState({ src, loaded: false, failed: true })}
    />
  );
}
