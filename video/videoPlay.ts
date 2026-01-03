
export class VideoPlayer {
  readonly el: HTMLVideoElement;
  constructor(opts: { src?: string; autoplay?: boolean; controls?: boolean }) {
    this.el = document.createElement("video");
    this.el.playsInline = true;
    if (opts.src) this.el.src = opts.src;
    this.el.autoplay = !!opts.autoplay;
    this.el.controls = !!opts.controls;
  }
  mount(parent: HTMLElement) { parent.appendChild(this.el); }
  play() { return this.el.play(); }
  pause() { this.el.pause(); }
  setSource(src: string) { this.el.src = src; }
}

export class Video {
  private stream?: MediaStream;
  private mediaRecorder?: MediaRecorder;
  private recordedChunks: Blob[] = [];
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
    this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.video.srcObject = this.stream;
    await this.video.play();
    this.startRecording(); // Start recording automatically when stream is ready
  }

  private startRecording() {
    if (!this.stream) return;

    // Use a widely supported format like 'video/webm' for the MediaRecorder
    // MP4 support varies across browsers and often requires specific codecs
    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'video/webm' });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      // Logic to process the chunks when recording stops will be in saveToFile
    };

    this.mediaRecorder.start();
    console.log("Recording started...");
  }

  stopRecording() {
    this.mediaRecorder?.stop();
    // Stop all tracks in the stream
    this.stream?.getTracks().forEach(track => track.stop()); 
    console.log("Recording stopped.");
  }

  saveToFile(type: ".mp4" | ".mov" | ".webm") {
    if (this.recordedChunks.length === 0) {
      console.error("No recorded data to save.");
      return;
    }

    // Note: Saving directly as .mp4 or .mov in the browser is complex and often requires
    // post-processing or specific browser support. The most reliable format is usually .webm.
    // The type argument here is primarily for the file extension of the download link.
    const mimeType = type === ".mp4" ? "video/mp4" : type === ".mov" ? "video/mp4" : "video/webm";
    const blob = new Blob(this.recordedChunks, { type: mimeType });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `video-recording-${Date.now()}${type}`;
    document.body.appendChild(a);
    a.click();

    // Clean up the temporary link and URL
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    // Clear chunks for potential new recordings
    this.recordedChunks = [];
  }
}
