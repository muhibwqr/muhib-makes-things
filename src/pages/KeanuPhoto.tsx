import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Download, RotateCcw, Image as ImageIcon, Loader2 } from "lucide-react";

export default function KeanuPhoto() {
  const [streaming, setStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [keanuMode, setKeanuMode] = useState<'normal' | 'young' | 'grayscale' | 'young-gray'>('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const checkCameraPermissions = async () => {
    try {
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return permissions.state === 'granted';
    } catch (error) {
      // Some browsers might not support the permissions API
      return null;
    }
  };

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First check if getUserMedia is supported
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is not supported in your browser");
      }
      
      const hasPermission = await checkCameraPermissions();
      if (hasPermission === false) {
        throw new Error("Camera permission denied. Please grant camera access in your browser settings.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 }
      });
      
      if (!videoRef.current) {
        throw new Error("Video element not initialized");
      }

      videoRef.current.srcObject = stream;
      
      // Add all event handlers before setting srcObject
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          videoRef.current.play()
            .then(() => {
              setStreaming(true);
              setIsLoading(false);
            })
            .catch(err => {
              console.error("Error playing video:", err);
              setError("Failed to start video playback");
              setIsLoading(false);
            });
        }
      };

      videoRef.current.onloadeddata = () => {
        console.log("Video data loaded");
      };

      videoRef.current.onerror = (event) => {
        console.error("Video error:", event);
        setError("Error playing video stream");
        setIsLoading(false);
      };

    } catch (error) {
      console.error("Error accessing camera:", error);
      setError(error instanceof Error ? error.message : "Could not access camera. Please make sure you've granted camera permissions.");
      setIsLoading(false);
      setStreaming(false);
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

  const capturePhoto = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!videoRef.current || !canvasRef.current) {
        throw new Error("Video or canvas element not initialized");
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        throw new Error("Video stream is not ready yet");
      }
      
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      if (videoWidth === 0 || videoHeight === 0) {
        throw new Error("Video dimensions are not valid");
      }
      
      // Make canvas wide enough for both images side by side
      canvas.width = videoWidth * 2;
      canvas.height = videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }
      
      // Draw user's photo on the left
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      
      // Get Keanu image based on mode
      const getKeanuUrl = () => {
        let options = '';
        
        if (keanuMode === 'young') options = 'y';
        if (keanuMode === 'grayscale') options = 'g';
        if (keanuMode === 'young-gray') options = 'yg';
        
        return `https://placekeanu.com/${videoWidth}/${videoHeight}/${options}`;
      };

      // Load Keanu image and draw on the right
      return new Promise<void>((resolve, reject) => {
        const keanuImg = new Image();
        keanuImg.crossOrigin = 'anonymous';
        
        keanuImg.onload = () => {
          ctx.drawImage(keanuImg, videoWidth, 0, videoWidth, videoHeight);
          try {
            const imageData = canvas.toDataURL('image/png');
            setCapturedImage(imageData);
            stopCamera();
            setIsLoading(false);
            resolve();
          } catch (err) {
            reject(new Error("Failed to convert canvas to image"));
          }
        };
        
        keanuImg.onerror = () => {
          reject(new Error("Failed to load Keanu image"));
        };
        
        keanuImg.src = getKeanuUrl();
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to capture photo");
      setIsLoading(false);
      console.error("Error capturing photo:", error);
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
                Capture yourself and get a Keanu Reeves photo added!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Keanu Mode Selector */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={keanuMode === 'normal' ? 'default' : 'outline'}
                  onClick={() => setKeanuMode('normal')}
                  disabled={capturedImage !== null}
                >
                  Normal Keanu
                </Button>
                <Button
                  variant={keanuMode === 'young' ? 'default' : 'outline'}
                  onClick={() => setKeanuMode('young')}
                  disabled={capturedImage !== null}
                >
                  Young Keanu
                </Button>
                <Button
                  variant={keanuMode === 'grayscale' ? 'default' : 'outline'}
                  onClick={() => setKeanuMode('grayscale')}
                  disabled={capturedImage !== null}
                >
                  Grayscale
                </Button>
                <Button
                  variant={keanuMode === 'young-gray' ? 'default' : 'outline'}
                  onClick={() => setKeanuMode('young-gray')}
                  disabled={capturedImage !== null}
                >
                  Young + Grayscale
                </Button>
              </div>

              {/* Camera/Preview Section */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                {!capturedImage ? (
                  <>
                    {isLoading ? (
                      <div className="text-center text-muted-foreground">
                        <Loader2 className="w-16 h-16 mx-auto mb-4 opacity-50 animate-spin" />
                        <p>Initializing camera...</p>
                      </div>
                    ) : streaming ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-contain"
                        style={{ transform: 'scaleX(-1)' }} // Mirror the video
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        {error ? (
                          <>
                            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50 text-destructive" />
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

              {/* Controls */}
              <div className="flex flex-wrap gap-2">
                {!streaming && !capturedImage && (
                  <Button onClick={startCamera} size="lg">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                )}
                {streaming && (
                  <Button 
                    onClick={capturePhoto} 
                    size="lg" 
                    disabled={isLoading}
                  >
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
                  <li>Choose your preferred Keanu mode</li>
                  <li>Click "Capture with Keanu" to take your photo</li>
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

