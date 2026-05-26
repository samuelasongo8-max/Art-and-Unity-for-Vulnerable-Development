import { useEffect, useRef } from "react";

function useRevealClass(className, threshold = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        element.classList.add(className);
        observer.disconnect();
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [className, threshold]);

  return ref;
}

export default useRevealClass;