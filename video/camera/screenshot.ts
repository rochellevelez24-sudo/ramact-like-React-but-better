
export class Camera {
  private stream?: MediaStream;
  readonly video: HTMLVideoElement;
  readonly canvas: HTMLCanvasElement;
  constructor() {
    this.video = document.createElement("video");
    this.video.playsInline = true;
    this.video.autoplay = true;
    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "none";
  }
  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    this.video.srcObject = this.stream;
    await this.video.play();
  }
  stop() {
    this.stream?.getTracks().forEach(t => t.stop());
    this.video.srcObject = null;
  }
  screenshot(type: "image/png" | "image/jpeg" = "image/png", quality?: number): string {
    const w = this.video.videoWidth || 640;
    const h = this.video.videoHeight || 480;
    this.canvas.width = w; this.canvas.height = h;
    const ctx = this.canvas.getContext("2d")!;
    ctx.drawImage(this.video, 0, 0, w, h);
    return this.canvas.toDataURL(type, quality);
  }
  mount(parent: HTMLElement) { parent.appendChild(this.video); }
}
