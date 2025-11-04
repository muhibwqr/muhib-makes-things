import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Camera,
  Download,
  RotateCcw,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

export default function KeanuPhoto() {
  const [streaming, setStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [keanuMode, setKeanuMode] = useState<
    "normal" | "young" | "grayscale" | "young-gray"
  >("normal");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stop camera when component unmounts
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is not supported in your browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
        audio: false,
      });

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;

        // Wait for metadata to be ready
        await new Promise((resolve) => {
          video.onloadedmetadata = () => resolve(true);
        });

        try {
          await video.play();
          setStreaming(true);
          console.log("Camera stream started successfully");
        } catch (err) {
          console.error("Autoplay blocked, waiting for user interaction", err);
          setError(
            "Autoplay blocked. Tap the video or press 'Start Camera' again."
          );
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Error starting camera:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to access camera. Please grant permissions."
      );
      setIsLoading(false);
      setStreaming(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  const capturePhoto = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!videoRef.current || !canvasRef.current)
        throw new Error("Camera not initialized");

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.readyState < video.HAVE_ENOUGH_DATA) {
        throw new Error("Camera not ready yet");
      }

      const width = video.videoWidth;
      const height = video.videoHeight;

      if (!width || !height)
        throw new Error("Invalid video dimensions for capture");

      canvas.width = width * 2;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      // Draw user
      ctx.drawImage(video, 0, 0, width, height);

      // Load Keanu image
      const getKeanuUrl = () => {
        let suffix = "";
        if (keanuMode === "young") suffix = "y";
        if (keanuMode === "grayscale") suffix = "g";
        if (keanuMode === "young-gray") suffix = "yg";
        return `https://placekeanu.com/${width}/${height}/${suffix}`;
      };

      const keanuImg = new Image();
      keanuImg.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        keanuImg.onload = () => {
          ctx.drawImage(keanuImg, width, 0, width, height);
          resolve();
        };
        keanuImg.onerror = () => reject(new Error("Failed to load Keanu image"));
        keanuImg.src = getKeanuUrl();
      });

      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);
      stopCamera();
    } catch (err) {
      console.error("Capture error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to capture image."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!capturedImage) return;
    const link = document.createElement("a");
    link.download = `keanu-photo-${Date.now()}.png`;
    link.href = capturedImage;
    link.click();
  };

  const resetPhoto = () => {
    setCapturedImage(null);
    setError(null);
    setStreaming(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="glass border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-6 h-6 text-primary" />
                Take a Photo with Keanu
              </CardTitle>
              <CardDescription>
                Capture yourself and get a Keanu Reeves photo added!
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Keanu Mode Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  ["normal", "Normal Keanu"],
                  ["young", "Young Keanu"],
                  ["grayscale", "Grayscale"],
                  ["young-gray", "Young + Grayscale"],
                ].map(([mode, label]) => (
                  <Button
                    key={mode}
                    variant={keanuMode === mode ? "default" : "outline"}
                    onClick={() => setKeanuMode(mode as any)}
                    disabled={!!capturedImage}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              {/* Video or Image Display */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                {!capturedImage ? (
                  <>
                    {isLoading ? (
                      <div className="text-center text-muted-foreground">
                        <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin opacity-50" />
                        <p>Initializing camera...</p>
                      </div>
                    ) : streaming ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-contain"
                        style={{ transform: "scaleX(-1)" }}
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        {error ? (
                          <>
                            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-destructive opacity-50" />
                            <p className="text-destructive">{error}</p>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Camera not active</p>
                          </>
                        )}
                      </div>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                  </>
                ) : (
                  <img
                    src={capturedImage}
                    alt="You with Keanu"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Status */}
              <div className="mt-2 text-sm">
                <p>
                  <strong>Status:</strong>{" "}
                  {isLoading
                    ? "Initializing..."
                    : streaming
                    ? "Camera Active"
                    : "Idle"}
                </p>
                {error && <p className="text-destructive">Error: {error}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  If the camera doesn't start, ensure you've granted permissions
                  and tap the video (especially on Safari/iOS).
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-2">
                {!streaming && !capturedImage && (
                  <Button onClick={startCamera} size="lg">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                )}

                {streaming && (
                  <Button onClick={capturePhoto} size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Capturing...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Capture with Keanu
                      </>
                    )}
                  </Button>
                )}

                {capturedImage && (
                  <>
                    <Button onClick={downloadImage} size="lg">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={resetPhoto} size="lg" variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Take Another
                    </Button>
                  </>
                )}
              </div>

              {/* Info Section */}
              <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                <p className="font-semibold mb-2">💡 How it works:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Click "Start Camera" and grant permission</li>
                  <li>Select your preferred Keanu mode</li>
                  <li>Click "Capture with Keanu"</li>
                  <li>Download or retake your photo!</li>
                </ol>
                <p className="mt-2 text-xs">
                  Powered by PlaceKeanu.com — You're breathtaking! ❤️
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}