import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';

const ScanPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Function to set up the camera
  const setupCamera = async () => {
    try {
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      console.log("Camera access granted.");
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Stream assigned to video element:", stream);
        setHasPermission(true);
        setErrorMessage(null); // Clear any previous error messages
        videoRef.current.play(); // Explicitly call play()
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err.name === 'NotAllowedError') {
        setErrorMessage("Camera access denied. Please allow camera access in your browser settings.");
      } else if (err.name === 'NotFoundError') {
        setErrorMessage("No camera found. Please connect a camera.");
      } else {
        setErrorMessage("An unknown error occurred while trying to access the camera.");
      }
      setHasPermission(false);
    }
  };

  useEffect(() => {
    setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
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
          {hasPermission ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted // Ensure video is muted for autoplay
              controls // Add controls temporarily for debugging
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white">
              {errorMessage ? (
                <>
                  <p>{errorMessage}</p>
                  <button onClick={setupCamera} className="mt-4 bg-blue-500 text-white p-2 rounded">
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

        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm rounded-t-2xl">
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
                <h3 className="font-medium">Smart Watch</h3>
                <p className="text-sm text-gray-500">Arnotts</p>
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