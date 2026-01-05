# Ramact Ecosystem Documentation

Ramact is a modular, plugin‑driven developer environment designed for extensibility, clarity, and maintainability.  
It provides a core runtime (`Ramact`), a set of tools (`RamactInputex`, `RamactPrompt`, `RamactFeedbackex`, etc.), and widgets (`RamactAnimationEditorWidget`, `RamactImageEditorWidget`, `RamactPositionEditorWidget`) that can be composed into a complete system.

---

## ✨ Features

- Core runtime (`Ramact`) for orchestrating widgets and tools
- Widget system for editors and UI extensions
- Tool registry for input, prompts, animations, and feedback
- Interface‑driven design (no classes, no constants in contracts)
- Auto‑wired registries for easy extension
- HTTP‑style feedback collection via `RamactFeedbackex`

---

## 📂 Project Structure

core/
core.ts
tools/
animationex.ts
ramact_inputex.ts
ramact_prompt.ts
ramact_feedbackex.ts
widgets/
RamactAnimationEditor.ts
RamactImageEditor.ts
RamactPositionEditor.ts
RamactSystem.ts
README.md
API.md

---

# API Reference

## 📦 Core

### `Ramact`

```ts
interface Ramact {
  init(): void;
  attachWidget(widget: WidgetUI): void;
  detachWidget(widget: WidgetUI): void;
  destroy(): void;
}
```

WidgetUI

```ts
interface WidgetUI {
  name: string;
  render(): void;
  destroy(): void;
}
```

🛠️ Tools

# Animation

```ts
interface Animation {
  play(): void;
  pause(): void;
  stop(): void;
  setDuration(ms: number): void;
  setEasing(type: string): void;
}
```

# RamactInputex

```ts
interface RamactInputex {
  listen(): void;
  stop(): void;
  getValue(): string;
}
```

# RamactPrompt

```ts
interface RamactPrompt {
  type: "Alert" | "Confirm" | "Dialog";
  title: string;
  render(): void;
  close(): void;
}
```

# RamactFeedbackex

```ts
interface FeedbackEntry {
  id: string;
  message: string;
  type: "bug" | "feature" | "general";
  timestamp: number;
}

interface RamactFeedbackex {
  entries: FeedbackEntry[];


  collect(message: string, type?: FeedbackEntry["type"]): Promise<FeedbackEntry>;
  list(): FeedbackEntry[];
  clear(): void;
  exportJSON(): string;
}

```

🎨 Widgets

# RamactAnimationEditorWidget

```ts
interface RamactAnimationEditorWidget extends WidgetUI {
  configureAnimation(animation: Animation): void;
}

```

RamactImageEditorWidget

```ts
interface RamactImageEditorWidget extends WidgetUI {
  loadImage(src: string): void;
  applyFilter(filter: string): void;
}
```

# RamactPositionEditorWidget

```ts
interface RamactPositionEditorWidget extends WidgetUI {
  setPosition(x: number, y: number): void;
  getPosition(): { x: number; y: number };
}
```

🔧 System Interface

# RamactWidgetRegistry
```ts
interface RamactWidgetRegistry {
  AnimationEditor: typeof RamactAnimationEditorWidget;
  ImageEditor: typeof RamactImageEditorWidget;
  PositionEditor: typeof RamactPositionEditorWidget;
  [key: string]: WidgetUI;
}
```
# RamactToolRegistry
```ts
interface RamactToolRegistry {
  animation: Animation;
  inputex: RamactInputex;
  prompt: RamactPrompt;
  feedbackex: RamactFeedbackex;
  [key: string]: unknown;
}
```
# RamactSystemInterface

```ts
interface RamactSystemInterface {
  core: Ramact;
  widgets: RamactWidgetRegistry;
  tools: RamactToolRegistry;


  registerWidget(name: string, widget: WidgetUI): void;
  addAnimation(animation: Animation): void;
  runAnimations(): void;
  showPrompt(): void;
  initInput(): void;
  collectFeedback(): void;
  bootstrap(): void;
}
```

# 🚀 Usage Examples

## Core + Widgets

```ts
import { createRamact } from "./core/core";
import { RamactAnimationEditorWidget } from "./core/widgets/RamactAnimationEditor";


const core = createRamact();
core.init();
core.attachWidget(RamactAnimationEditorWidget);
core.destroy();

```

## Feedback System

```ts
import { createFeedbackex } from "./core/tools/ramact_feedbackex";


const feedback = createFeedbackex();


await feedback.collect("UI feels sluggish", "bug");
await feedback.collect("Add dark mode", "feature");


console.log(feedback.list());
console.log(feedback.exportJSON());

```

# 🔮 Philosophy

Interfaces first → contracts define the architectureNo classes → functional, registry‑based designExtensible → easy to plug in new tools and widgetsMaintainable → clear APIs, JSDoc documentation, type safety

# 📜 License

MIT License — free to use, modify, and distribute.
