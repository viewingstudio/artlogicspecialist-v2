import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class BlockImageReveal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Get attributes or set defaults
    this.blockColor = this.getAttribute("block-color") || "var(--color-accent)";
    this.direction = this.getAttribute("direction") || "right";
    this.duration = parseFloat(this.getAttribute("duration") || 1.2);
    this.triggerStart = this.getAttribute("trigger-start") || "top 80%";
    this.triggerEnd = this.getAttribute("trigger-end") || "top 30%";
  }

  connectedCallback() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Create the component structure
    this.render();

    // Setup the animation after a small delay to ensure DOM is ready
    setTimeout(() => this.setupAnimation(), 100);
  }

  render() {
    // Get the slotted content (typically an image)
    const styles = `
          :host {
            display: block;
            margin: 100px 0;
          }
          
          .reveal-container {
            position: relative;
            width: 100%;
            height: auto;
            overflow: hidden;
          }
          
          ::slotted(*) {
            display: block;
            width: 100%;
            height: auto;
            opacity: 0;
          }
          
          .reveal-block {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${this.blockColor};
            transform-origin: ${this.direction === "right" ? "left" : "right"};
          }
        `;

    this.shadowRoot.innerHTML = `
          <style>${styles}</style>
          <div class="reveal-container">
            <slot></slot>
            <div class="reveal-block"></div>
          </div>
        `;
  }

  setupAnimation() {
    // const container = this.shadowRoot.querySelector(".reveal-container");
    const block = this.shadowRoot.querySelector(".reveal-block");
    // Get all slotted nodes
    const slotElement = this.shadowRoot.querySelector("slot");

    const slottedNodes = slotElement.assignedNodes();

    // Find the first non-text node (or the first node that isn't just whitespace)
    let slottedContent = null;
    for (const node of slottedNodes) {
      // Skip text nodes that are just whitespace
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === "") {
        continue;
      }
      slottedContent = node;
      break;
    }

    // If no valid content is slotted, exit
    if (!slottedContent) {
      console.error("No valid content slotted into block-image-reveal");
      return;
    }

    // Create a timeline for this specific container
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this,
        start: this.triggerStart,
        end: this.triggerEnd,
        toggleActions: "play none none reverse",
        markers: false, // Set to true for debugging
      },
    });

    // Set the initial state - content visible but scaled up
    tl.set(slottedContent, {
      opacity: 1,
      scale: 1.2, // Start slightly scaled up
    });
  
    // The animation sequence - block reveal and image scale down simultaneously
    tl.to(slottedContent, {
      scale: 1, // Scale down to normal size
      duration: this.duration * 1.75,
      ease: "power4.out"
    }, 0) // The '0' means this animation starts at the beginning of the timeline
      .fromTo(
        block,
        {
          scaleX: 1,
        },
        {
          scaleX: 0,
          transformOrigin: this.direction === "right" ? "right" : "left",
          duration: this.duration,
          ease: "power4.inOut",
        },
        0 // The '0' means this animation starts at the beginning of the timeline
      );
  }

  //   // Create a timeline for this specific container
  //   const tl = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: this,
  //       start: this.triggerStart,
  //       end: this.triggerEnd,
  //       toggleActions: "play none none reverse",
  //       markers: false, // Set to true for debugging
  //     },
  //   });

  //   // The animation sequence
  //   tl.set(slottedContent, { opacity: 1 }).fromTo(
  //     block,
  //     {
  //       scaleX: 1,
  //     },
  //     {
  //       scaleX: 0,
  //       transformOrigin: this.direction === "right" ? "right" : "left",
  //       duration: this.duration,
  //       ease: "power4.inOut",
  //     }
  //   );
  // }

  // Handle attribute changes
  static get observedAttributes() {
    return ["block-color", "direction", "duration", "trigger-start", "trigger-end"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      const propertyName = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      this[propertyName] = newValue;
      if (this.shadowRoot.querySelector(".reveal-container")) {
        this.render();
        this.setupAnimation();
      }
    }
  }
}

// Register the custom element
customElements.define("block-image-reveal", BlockImageReveal);
