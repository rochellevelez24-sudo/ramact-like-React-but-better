import { WidgetUI } from "../core/core"

export function addElementListener(element: WidgetUI, name: string, callback: EventListenerOrEventListenerObject) {
    
    element.addEventListener(name, callback)
}