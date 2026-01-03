import { WidgetUI } from "../core";

export const slideWidget = new WidgetUI("SlideFrame", {
    X: 100,
    Y: 200
});

slideWidget.resizeable = true
slideWidget.widget = HTMLDivElement
slideWidget.widget.style = "overflow: auto;"