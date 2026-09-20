import type { ReactElement } from "react";
import {
  carouselFragment,
  carouselSlideId,
  joinClassNames,
  normalizeCarouselProps,
} from "./carousel-markup.js";
import type { CarouselMarkupProps } from "./types.js";

export function CarouselMarkup({
  base: rawBase,
  rootRef,
  presentation,
}: CarouselMarkupProps): ReactElement | null {
  const base = normalizeCarouselProps(rawBase);
  const { items, classNames, labels } = base;
  const hasControls = items.length > 1;

  if (items.length === 0) return null;

  const enhanced = presentation?.snapshot.ready === true;
  // Pagination claims a current slide as soon as the client has mounted, even before
  // the controller reports `ready` — SSR/pre-hydration markup still claims nothing.
  const showActiveDot = enhanced || presentation?.mounted === true;
  const activeIndex = presentation?.snapshot.index;
  const fade = enhanced && presentation.mode === "fade";
  const presentedIndex = fade ? (presentation.snapshot.requestedIndex ?? activeIndex) : activeIndex;
  const dotIndices =
    enhanced && !presentation.preserveFallbackFocus
      ? presentation.snapshot.pages.map((page) => page.index)
      : items.map((_, index) => index);

  return (
    <section
      ref={rootRef}
      id={base.id}
      aria-label={base["aria-label"]}
      aria-roledescription="carousel"
      data-uiify-carousel=""
      data-axis={base.axis}
      {...(presentation ? { "data-mode": presentation.mode } : {})}
      {...(enhanced ? { "data-enhanced": "" } : {})}
      {...(base.dir ? { dir: base.dir } : {})}
      {...(base.className ? { className: base.className } : {})}
      {...(base.style ? { style: base.style } : {})}
    >
      {presentation && hasControls && presentation.autoplay ? (
        <button
          type="button"
          className={joinClassNames(classNames?.controls, classNames?.rotation)}
          data-uiify-carousel-controls=""
          data-carousel-action="rotation"
          hidden={!enhanced}
        >
          {presentation.autoplay.requested ? labels.stop : labels.start}
        </button>
      ) : null}

      <div
        id={`${base.id}--viewport`}
        tabIndex={0}
        role="group"
        aria-label={base["aria-label"]}
        className={classNames?.viewport}
        data-uiify-carousel-viewport=""
      >
        {items.map((item, index) => {
          const slideId = carouselSlideId(base.id, item.id);
          return (
            <div
              key={item.id}
              id={slideId}
              role="group"
              aria-roledescription="slide"
              aria-label={`${item.label}, ${index + 1} ${labels.of} ${items.length}`}
              className={joinClassNames(classNames?.slide, item.className)}
              data-uiify-carousel-slide=""
              data-carousel-index={index}
              {...(enhanced
                ? { "data-state": index === presentedIndex ? "active" : "inactive" }
                : {})}
              {...(fade && index !== presentedIndex ? { inert: true, "aria-hidden": true } : {})}
            >
              <div className={classNames?.slideContent} data-uiify-carousel-content="">
                {item.children}
              </div>
            </div>
          );
        })}
      </div>

      {presentation && hasControls && base.navigation ? (
        <button
          type="button"
          className={joinClassNames(classNames?.controls, classNames?.previous)}
          aria-label={labels.previous}
          data-uiify-carousel-controls=""
          data-carousel-action="previous"
          hidden={!enhanced}
          disabled={enhanced ? presentation.snapshot.atStart : undefined}
        >
          {base.icons?.previous}
        </button>
      ) : null}

      {base.pagination && hasControls ? (
        <nav
          aria-label={labels.navigation}
          className={classNames?.dots}
          data-uiify-carousel-dots=""
        >
          {dotIndices.map((itemIndex) => {
            const item = items[itemIndex];
            if (!item) return null;
            return (
              <a
                key={item.id}
                href={carouselFragment(carouselSlideId(base.id, item.id))}
                aria-label={`${labels.goTo} ${item.label}`}
                aria-current={showActiveDot && itemIndex === activeIndex ? "true" : undefined}
                className={classNames?.dot}
                data-uiify-carousel-dot=""
                data-carousel-index={itemIndex}
              >
                {itemIndex + 1}
              </a>
            );
          })}
        </nav>
      ) : null}

      {presentation && hasControls && base.navigation ? (
        <button
          type="button"
          className={joinClassNames(classNames?.controls, classNames?.next)}
          aria-label={labels.next}
          data-uiify-carousel-controls=""
          data-carousel-action="next"
          hidden={!enhanced}
          disabled={enhanced ? presentation.snapshot.atEnd : undefined}
        >
          {base.icons?.next}
        </button>
      ) : null}

      {presentation ? (
        <div
          className={classNames?.status}
          aria-live={presentation.autoplay?.playing ? "off" : "polite"}
          aria-atomic="true"
          data-uiify-carousel-status=""
        >
          {enhanced && activeIndex !== undefined
            ? `${items[activeIndex]?.label ?? ""}, ${activeIndex + 1} ${labels.of} ${items.length}`
            : null}
        </div>
      ) : null}
    </section>
  );
}
CarouselMarkup.displayName = "CarouselMarkup";
