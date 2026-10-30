import type { ReactElement } from "react";
import { formatLabel } from "@gunkin/uiify/core/format-label";
import { cn } from "../../core/class-names.js";
import { resolveRepeatedSlotProps } from "../../core/slot-props.js";
import { carouselFragment, carouselSlideId, normalizeCarouselProps } from "./carousel-markup.js";
import type { CarouselClientProps, CarouselMarkupProps } from "./types.js";

export function CarouselMarkup({
  base: rawBase,
  rootRef,
  presentation,
}: CarouselMarkupProps): ReactElement | null {
  const base = normalizeCarouselProps(rawBase);
  const { items, labels, slotProps } = base;
  const {
    items: _items,
    labels: _labels,
    slotProps: _slotProps,
    axis: _axis,
    locale: _locale,
    icons: _icons,
    navigation: _navigation,
    pagination: _pagination,
    autoplay: _autoplay,
    afterChange: _afterChange,
    beforeChange: _beforeChange,
    defaultValue: _defaultValue,
    mouseDrag: _mouseDrag,
    onSelect: _onSelect,
    onSwipe: _onSwipe,
    rewind: _rewind,
    swipe: _swipe,
    value: _value,
    ...rootProps
  } = base as typeof base & Partial<CarouselClientProps> & { readonly swipe?: boolean };
  const hasControls = items.length > 1;

  if (items.length === 0) return null;

  const enhanced = presentation?.snapshot.ready === true;
  // Pagination claims a current slide as soon as the client has mounted, even before
  // the controller reports `ready` — SSR/pre-hydration markup still claims nothing.
  const showActiveDot = enhanced || presentation?.mounted === true;
  const activeIndex = presentation?.snapshot.index;
  const announcedIndex = presentation?.snapshot.settledIndex;
  const fade = enhanced && presentation.mode === "fade";
  const presentedIndex = fade ? (presentation.snapshot.requestedIndex ?? activeIndex) : activeIndex;
  const dotIndices =
    enhanced && !presentation.preserveFallbackFocus
      ? presentation.snapshot.pages.map((page) => page.index)
      : items.map((_, index) => index);

  return (
    <section
      aria-roledescription="carousel"
      data-uiify-carousel=""
      data-axis={base.axis}
      {...(presentation ? { "data-mode": presentation.mode } : {})}
      {...(enhanced ? { "data-enhanced": "" } : {})}
      {...rootProps}
      ref={rootRef}
    >
      {presentation && hasControls && presentation.autoplay ? (
        <button
          type="button"
          data-part="controls"
          data-carousel-action="rotation"
          data-uiify-button=""
          data-variant="outline"
          hidden={!enhanced}
          {...resolveRepeatedSlotProps(slotProps?.rotationControl, "rotation")}
        >
          {presentation.autoplay.requested ? labels.stop : labels.start}
        </button>
      ) : null}

      <div
        id={`${base.id}--viewport`}
        tabIndex={0}
        role="group"
        aria-label={base["aria-label"]}
        data-part="viewport"
        {...slotProps?.viewport}
      >
        {items.map((item, index) => {
          const slideId = carouselSlideId(base.id, item.id);
          const slideProps = resolveRepeatedSlotProps(slotProps?.slide, item.id);
          const slideContentProps = resolveRepeatedSlotProps(slotProps?.slideContent, item.id);
          return (
            <div
              key={item.id}
              id={slideId}
              role="group"
              aria-roledescription="slide"
              aria-label={formatLabel(
                labels.slide,
                {
                  label: item.label,
                  index: base.locale === undefined ? String(index + 1) : index + 1,
                  count: base.locale === undefined ? String(items.length) : items.length,
                },
                base.locale,
              )}
              data-part="slide"
              data-carousel-index={index}
              {...(enhanced
                ? { "data-state": index === presentedIndex ? "active" : "inactive" }
                : {})}
              {...(fade && index !== presentedIndex ? { inert: true, "aria-hidden": true } : {})}
              {...slideProps}
              className={cn(item.className, slideProps.className)}
            >
              <div data-part="slide-content" {...slideContentProps}>
                {item.children}
              </div>
            </div>
          );
        })}
      </div>

      {presentation && hasControls && base.navigation ? (
        <button
          type="button"
          aria-label={labels.previous}
          data-part="controls"
          data-carousel-action="previous"
          data-size="icon"
          data-uiify-button=""
          data-variant="outline"
          hidden={!enhanced}
          disabled={enhanced ? presentation.snapshot.atStart : undefined}
          {...resolveRepeatedSlotProps(slotProps?.previousControl, "previous")}
        >
          {base.icons?.previous}
        </button>
      ) : null}

      {base.pagination && hasControls ? (
        <nav aria-label={labels.navigation} data-part="dots" {...slotProps?.dots}>
          {dotIndices.map((itemIndex) => {
            const item = items[itemIndex];
            if (!item) return null;
            return (
              <a
                key={item.id}
                href={carouselFragment(carouselSlideId(base.id, item.id))}
                aria-label={formatLabel(labels.goToSlide, { label: item.label }, base.locale)}
                aria-current={showActiveDot && itemIndex === activeIndex ? "true" : undefined}
                data-part="dot"
                data-carousel-index={itemIndex}
                {...resolveRepeatedSlotProps(slotProps?.dot, item.id)}
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
          aria-label={labels.next}
          data-part="controls"
          data-carousel-action="next"
          data-size="icon"
          data-uiify-button=""
          data-variant="outline"
          hidden={!enhanced}
          disabled={enhanced ? presentation.snapshot.atEnd : undefined}
          {...resolveRepeatedSlotProps(slotProps?.nextControl, "next")}
        >
          {base.icons?.next}
        </button>
      ) : null}

      {presentation ? (
        <div
          aria-live={presentation.autoplay?.playing ? "off" : "polite"}
          aria-atomic="true"
          data-part="status"
          {...slotProps?.status}
        >
          {enhanced && announcedIndex !== undefined
            ? formatLabel(
                labels.slide,
                {
                  label: items[announcedIndex]?.label ?? "",
                  index:
                    base.locale === undefined ? String(announcedIndex + 1) : announcedIndex + 1,
                  count: base.locale === undefined ? String(items.length) : items.length,
                },
                base.locale,
              )
            : null}
        </div>
      ) : null}
    </section>
  );
}
CarouselMarkup.displayName = "CarouselMarkup";
