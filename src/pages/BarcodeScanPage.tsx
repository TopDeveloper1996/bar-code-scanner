import { useState, useEffect, useRef } from "react";
import Quagga from '@ericblade/quagga2';
import { Link } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import { useScanHistory } from '../context/ScanHistoryContext';
import { config } from '../config';

interface ProductInfo {
  title: string;
  brand: string;
  image: string;
  description: string;
  category: string;
}

function BarcodeScanPage() {
  const [data, setData] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToScanHistory } = useScanHistory();
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      if (scannerRef.current) {
        try {
          await Quagga.init({
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: scannerRef.current,
              constraints: {
                facingMode: "environment",
                width: { min: 640, ideal: 1280 },
                height: { min: 480, ideal: 720 },
                aspectRatio: { ideal: 16 / 9 }
              },
              area: {
                top: "20%",
                right: "10%",
                left: "10%",
                bottom: "20%"
              }
            },
            decoder: {
              readers: ["ean_reader", "ean_8_reader", "code_128_reader", "code_39_reader", "upc_reader", "upc_e_reader"]
            },
            locate: true,
            // debug: {
            //   showCanvas: true,
            //   showPatters: true,
            //   showFrequency: true,
            //   drawBoundingBox: true,
            //   showPattern: true,
            //   showResult: true,
            //   showLandmarker: true,
            // }
          }, (err) => {
            if (err) {
              console.error("Quagga initialization error:", err);
              return;
            }
            console.log("Quagga initialized successfully");
            Quagga.start();
          });

          Quagga.onDetected((result) => {
            if (mounted) {
              const barcodeValue = result.codeResult.code;
              // alert(barcodeValue);
              console.log('Barcode Detected', barcodeValue);
              if (barcodeValue) {
                setData(barcodeValue);
                fetchProductInfo(barcodeValue);
              }
            }
          });
        } catch (error) {
          console.error("Error starting scanner:", error);
        }
      }
    };

    const timeoutId = setTimeout(startScanner, 100);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      Quagga.stop();
    };
  }, []);

  const resetScanner = () => {
    setData(null);
    setProductInfo(null);
    setIsLoading(false);
  };

  const handleAddItem = () => {
    if (productInfo && data) {
      // Add to scan history
      addToScanHistory({
        barcode: data,
        title: productInfo.title,
        brand: productInfo.brand,
        image: productInfo.image,
        category: productInfo.category,
        description: productInfo.description,
        timestamp: new Date()
      });

      // Reset scanner for next scan
      resetScanner();
    }
  };

  const fetchProductInfo = async (barcode: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.apiUrl}/api/barcodescan?barcode=${barcode}`);
      if (!response.ok) throw new Error('Failed to fetch product info');

      const data = await response.json();
      setProductInfo(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col w-full h-screen bg-white items-center overflow-hidden">
      <Link
        to="/"
        className="absolute top-4 left-4 z-20 p-2"
      >
        <ChevronLeft className="h-10 w-10 bg-[#fff]/80 p-2 text-blue-500 rounded-lg" />
      </Link>

      <div className="absolute inset-0 w-full h-full" ref={scannerRef}>

        {/* Scanning frame overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-72 h-96">
            {/* Center guide */}
            <div className="absolute inset-0 border-2 border-none border-b-4 bg-gradient-to-b from-white/10 to-white/60 rounded-t-3xl animate-bg-scan" />
            {/* Corner markers */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-blue-500 rounded-br-3xl" />
          </div>
        </div>
        {/* Overlay for detection area */}
        {/* <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            right: '10%',
            bottom: '20%',
            borderWidth: '2px',
            borderColor: 'red',
            borderStyle: 'dashed',
            pointerEvents: 'none' // Prevent interaction with this overlay
          }}
        /> */}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm rounded-t-2xl z-10">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg">
              <img
                src={productInfo?.image || "/watch.png"}
                alt="Product thumbnail"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">{productInfo?.brand || 'Scanning...'}</p>
              <h3 className="font-medium">
                {isLoading ? 'Loading...' : (productInfo?.title || 'Scan a barcode')}
              </h3>
            </div>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full disabled:opacity-50 disabled:bg-blue-500 disabled:cursor-not-allowed"
            onClick={handleAddItem}
            disabled={!productInfo}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add item</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BarcodeScanPage;
