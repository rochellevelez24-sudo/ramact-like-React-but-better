import { addElementListener } from "../../events/ElementEvent";
import { WidgetUI } from "../core";

const animatedButton = new WidgetUI("Animated", { X: 250, Y: 90 });

addElementListener(animatedButton.element, "mouseover", () => {
  console.log("Hovered over Animated button!");
  // Access the element through the params object
   animatedButton.element.style.transform = "scale(1.5)";
  // The 'this' context might also refer to the element inside the function, depending on addElementListener's implementation
});
