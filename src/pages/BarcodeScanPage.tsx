import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { Link } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';

function BarcodeScanPage() {
  const [data, setData] = useState("No barcode detected");

  return (
    <div className="relative flex flex-col w-full h-screen bg-white items-center overflow-hidden">
      {/* <h2 className="text-2xl font-bold mb-4">Barcode Scanner</h2> */}

      <Link
        to="/"
        className="absolute top-4 left-4 z-20 p-2"
      >
        <ChevronLeft className="h-10 w-10 bg-[#fff]/80 p-2 text-blue-500 rounded-lg" />
      </Link>

      <div className="relative w-full h-full">
        <BarcodeScannerComponent
          onUpdate={(err, result) => {
            if (result) {
              // alert("Detected!!!");
              setData(result.getText());
              console.log("Barcode found:", result.getText());
            } else {
              console.log('no result', err)
            }
          }}
          videoConstraints={{
            facingMode: "environment",
            frameRate: { ideal: 30 },
            aspectRatio: 3/5 
          }}
          torch={false}
          delay={100}
        />

        {/* Scanning frame overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-72 h-96">
            {/* Center guide */}
            <div className="absolute inset-0 border-2 border-none border-b-4 bg-gradient-to-b from-white/10 to-white/60 rounded-t-3xl animate-bg-scan">
              {/* <div className="absolute left-0 right-0 h-0.5 bg-red-500 top-1/2 transform -translate-y-1/2 animate-scan" /> */}
            </div>
            {/* Corner markers */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-blue-500 rounded-br-3xl" />
          </div>
        </div>
      </div>

      {/* <div className="mt-4 text-center">
        <p className="text-lg">
          {data === "No barcode detected" ? (
            <span className="text-gray-500">Position barcode within frame</span>
          ) : (
            <span className="text-green-500 font-semibold">Scanned: {data}</span>
          )}
        </p>
      </div> */}

      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm rounded-t-2xl z-10">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg">
              <img
                src="watch.png"
                alt="Product thumbnail"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Arnotts</p>
              <h3 className="font-medium">{ data === 'No barcode detected' ? 'Scanning...' : data }</h3>
            </div>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add item</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BarcodeScanPage;