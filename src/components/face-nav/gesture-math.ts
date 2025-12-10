// src/components/face-nav/gesture-math.ts

export const calculateFaceMetrics = (landmarks: any) => {
  if (!landmarks || landmarks.length < 468) return null;

  // 1. Face Height (Chin to Forehead) - This is our ruler for depth
  const forehead = landmarks[10];
  const chin = landmarks[152];
  const faceHeight = Math.abs(chin.y - forehead.y);

  // Safety check to prevent division by zero
  if (faceHeight < 0.01) return null;

  // 2. Mouth Dimensions
  const mouthTop = landmarks[13];
  const mouthBottom = landmarks[14];
  const mouthLeft = landmarks[61];
  const mouthRight = landmarks[291];

  const mouthHeight = Math.abs(mouthBottom.y - mouthTop.y);
  const mouthWidth = Math.abs(mouthRight.x - mouthLeft.x);

  // 3. Normalized Metrics
  // Aspect Ratio: Shape of mouth (Tall vs Wide)
  const mouthAspectRatio = mouthHeight / mouthWidth;
  
  // Openness: How open is the mouth relative to the face size?
  const normalizedMouthOpen = mouthHeight / faceHeight;

  // 4. Head Position (Center X)
  const leftEar = landmarks[234];
  const rightEar = landmarks[454];
  const headCenterX = (leftEar.x + rightEar.x) / 2;
  
  return {
    faceHeight,
    mouthAspectRatio,
    normalizedMouthOpen,
    centerDelta: headCenterX - 0.5, // 0.0 is center, -0.5 is left, +0.5 is right
  };
};
