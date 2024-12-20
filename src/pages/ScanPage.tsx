import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';

const ScanPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setupCamera = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      console.log("1. Starting camera setup...");

      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      console.log("2. Requesting media with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("3. Got media stream:", stream.getTracks());

      // Store the stream in ref for later use
      streamRef.current = stream;
      setHasPermission(true);
      
    } catch (err: unknown) {
      console.error("Camera setup error:", err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setErrorMessage("Camera access denied. Please allow camera access in your browser settings.");
        } else if (err.name === 'NotFoundError') {
          setErrorMessage("No camera found. Please connect a camera.");
        } else if (err.name === 'NotReadableError') {
          setErrorMessage("Camera is in use by another application.");
        } else {
          setErrorMessage(`Camera error: ${err.message}`);
        }
      } else {
        setErrorMessage("An unknown error occurred while trying to access the camera.");
      }
      setHasPermission(false);
    }
    setIsLoading(false);
  };

  // Add a new effect to handle video element setup
  useEffect(() => {
    if (hasPermission && videoRef.current && streamRef.current) {
      console.log("4. Setting up video element");
      videoRef.current.srcObject = streamRef.current;
      
      videoRef.current.onloadeddata = () => {
        console.log("5. Video data loaded");
        videoRef.current?.play()
          .then(() => {
            console.log("6. Video playing successfully");
          })
          .catch((err) => {
            console.error("Error playing video:", err);
            setErrorMessage("Failed to play video");
            setHasPermission(false);
          });
      };
    }
  }, [hasPermission, videoRef.current]);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("Your browser doesn't support camera access");
      setIsLoading(false);
      return;
    }

    setupCamera();

    return () => {
      console.log("Cleaning up camera...");
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => {
          track.stop();
          console.log("Track stopped:", track.label);
        });
        streamRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      <div className="flex-1 relative">
        <Link 
          to="/" 
          className="absolute top-4 left-4 z-20 text-white bg-black/50 rounded-full p-2"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>

        <div className="absolute inset-0">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white">
              <p>Initializing camera...</p>
            </div>
          ) : hasPermission ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900 text-white">
              {errorMessage ? (
                <>
                  <p className="text-center px-4">{errorMessage}</p>
                  <button 
                    onClick={setupCamera} 
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Retry Access
                  </button>
                </>
              ) : (
                <p>Please grant camera access</p>
              )}
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-72 h-48 rounded-2xl border-2 border-white overflow-hidden">
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-4 border-2 border-white rounded-lg" />
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-72 h-48">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-xl" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm rounded-t-2xl z-10">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg">
                <img 
                  src="/placeholder.svg" 
                  alt="Product thumbnail" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Arnotts</p>
                <h3 className="font-medium">Smart Watch</h3>
              </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add item</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;