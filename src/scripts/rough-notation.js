/**
 *
 * DEPENDENCIES
 * npm install gsap rough-notation
 *
 * Web Component that applies Rough Notation annotations to its child element,
 * triggering the animation when the component scrolls into view.
 *
 * Attributes:
 * - `data-type`: Type of annotation (e.g., 'underline', 'circle', 'highlight'). Default is 'underline'.
 * - `data-color`: Stroke color of the annotation. Accepts any CSS color value. Default is 'currentcolor'.
 * - `data-stroke-width`: Width of the annotation stroke. Default is 3.
 * - `data-multiline`: Whether the annotation should wrap across multiple lines. Default is true.
 * - `data-iterations`: Number of drawing iterations for the annotation. Default is 3.
 * - `data-duration`: Duration of the GSAP animation in seconds. Default is 1.5.
 * - `data-on-scroll`: Whether to trigger the annotation on scroll. Default is true.
 * - `data-on-hover`: Whether to trigger the annotation on hover. Default is false.
 * - `data-padding`: Padding around the annotation. Must be an array of 4 integers. Default is [5, 5, 5, 5].
 *
 * Example usage:
 * ```html
 * <rough-notation data-type="circle" data-color="red" data-duration="2" data-padding="[10, 10, 10, 10]">
 *   <span>Important Text</span>
 * </rough-notation>
 * ```
 *
 * The component wraps its first child element and applies the annotation effect,
 * ensuring the target element is positioned above the annotation.
 */

import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { annotate } from "rough-notation";

gsap.registerPlugin(ScrollTrigger);

class RoughNotationElement extends HTMLElement {
  constructor() {
    super();
    this.annotation = null;
    this.scrollTrigger = null;
    this.setupAnnotation = this.setupAnnotation.bind(this);
  }

  disconnectedCallback() {
    // Clean up the scroll trigger when component is disconnected
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.scrollTrigger = null;
    }

    // Also clean up the annotation if it exists
    if (this.annotation) {
      this.annotation = null;
    }
  }

  setupAnnotation() {
    this.style.display = "inline";

    const target = this.firstElementChild;
    if (!target) return;

    // place target on top of underline
    target.style.position = "relative";
    target.style.zIndex = "1";

    // Read attributes for customization
    const type = this.getAttribute("data-type") || "underline";
    const color = this.getAttribute("data-color") || "currentcolor";
    const strokeWidth = parseFloat(this.getAttribute("data-stroke-width")) || 2.5;
    const multiline =
      this.hasAttribute("data-multiline") ? this.getAttribute("data-multiline") !== "false" : true;
    const iterations = parseInt(this.getAttribute("data-iterations")) || 2;
    const duration = parseFloat(this.getAttribute("data-duration")) || 1000;

    // Properly parse boolean attributes
    const onScroll =
      this.hasAttribute("data-on-scroll") ?
        this.getAttribute("data-on-scroll").toLowerCase() !== "false"
      : true;

    const onHover =
      this.hasAttribute("data-on-hover") ?
        this.getAttribute("data-on-hover").toLowerCase() === "true"
      : false;

    // New attribute for parent hover selector
    const parentHoverSelector = this.getAttribute("data-on-parent-hover");

    const padding =
      this.hasAttribute("data-padding") ?
        JSON.parse(this.getAttribute("data-padding"))
      : [5, 5, 5, 5];

    // Validate padding
    if (!Array.isArray(padding) || padding.length !== 4 || !padding.every(Number.isInteger)) {
      console.error("Invalid data-padding attribute. It must be an array of 4 integers.");
      return;
    }

    // Create annotation
    this.annotation = annotate(target, {
      type,
      color,
      strokeWidth,
      multiline,
      iterations,
      padding,
      animationDuration: duration,
      animate: true,
      brackets: ["left", "right"],
    });

    // Create new ScrollTrigger
    if (onScroll) {
      this.scrollTrigger = ScrollTrigger.create({
        trigger: this,
        start: "top 80%",
        onEnter: () => {
          this.annotation.show();
        },
      });
    }

    // Element hover behavior
    if (onHover) {
      target.addEventListener("mouseenter", () => {
        if (this.annotation) {
          this.annotation.hide();
          this.annotation.show();
        }
      });

      target.addEventListener("mouseleave", () => {
        if (this.annotation) {
          this.annotation.hide();
        }
      });
    }

    // Parent hover behavior
    if (parentHoverSelector) {
      try {
        // Find the closest ancestor that matches the selector
        const parentElement = this.closest(parentHoverSelector);

        if (parentElement) {
          parentElement.addEventListener("mouseenter", () => {
            if (this.annotation) {
              this.annotation.hide();
              this.annotation.show();
            }
          });

          parentElement.addEventListener("mouseleave", () => {
            if (this.annotation) {
              this.annotation.hide();
            }
          });
        } else {
          console.warn(`No parent element found matching selector: ${parentHoverSelector}`);
        }
      } catch (error) {
        console.error(`Invalid parent selector: ${parentHoverSelector}`, error);
      }
    }
  }

  connectedCallback() {
    this.setupAnnotation();

    // Listen for Astro page transitions and re-setup when they occur
    // document.addEventListener('astro:page-load', this.setupAnnotation)
  }
}

customElements.define("rough-notation", RoughNotationElement);
