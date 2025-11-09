import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Download, RotateCcw, Image as ImageIcon } from "lucide-react";

export default function KeanuPhoto() {
  const [streaming, setStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please make sure you've granted camera permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    // Set canvas to same size as video
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw user's photo
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      
      // Get Keanu image - use a reasonable size (about 1/4 of the canvas)
      const keanuSize = Math.min(videoWidth, videoHeight) * 0.4;
      const keanuUrl = `https://placekeanu.com/${Math.round(keanuSize)}/${Math.round(keanuSize)}`;
      
      // Load Keanu image and overlay it in the bottom right corner
      const keanuImg = new Image();
      keanuImg.crossOrigin = 'anonymous';
      keanuImg.onload = () => {
        // Draw Keanu in bottom right corner with some padding
        const padding = 20;
        const x = videoWidth - keanuSize - padding;
        const y = videoHeight - keanuSize - padding;
        ctx.drawImage(keanuImg, x, y, keanuSize, keanuSize);
        
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
        stopCamera();
      };
      keanuImg.onerror = () => {
        alert("Failed to load Keanu image. Please try again.");
      };
      keanuImg.src = keanuUrl;
    }
  };

  const downloadImage = () => {
    if (!capturedImage) return;
    
    const link = document.createElement('a');
    link.download = `keanu-photo-${Date.now()}.png`;
    link.href = capturedImage;
    link.click();
  };

  const resetPhoto = () => {
    setCapturedImage(null);
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
                Capture yourself and Keanu will appear in your photo!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Camera/Preview Section */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                {!capturedImage ? (
                  <>
                    {streaming ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain"
                        style={{ transform: "scaleX(-1)" }}
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Camera not active</p>
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

              {/* Controls */}
              <div className="flex flex-wrap gap-2">
                {!streaming && !capturedImage && (
                  <Button onClick={startCamera} size="lg">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                )}
                {streaming && (
                  <Button onClick={capturePhoto} size="lg">
                    <Camera className="w-4 h-4 mr-2" />
                    Capture with Keanu
                  </Button>
                )}
                {capturedImage && (
                  <>
                    <Button onClick={downloadImage} size="lg" variant="default">
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

              {/* Info */}
              <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                <p className="font-semibold mb-2">💡 How it works:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Click "Start Camera" and grant camera permissions</li>
                  <li>Click "Capture with Keanu" to take your photo</li>
                  <li>Keanu will appear in the bottom right corner!</li>
                  <li>Download or take another photo!</li>
                </ol>
                <p className="mt-2 text-xs">Powered by PlaceKeanu.com - You're breathtaking! ❤️</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
