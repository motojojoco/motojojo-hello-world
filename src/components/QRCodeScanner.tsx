import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Camera, X } from 'lucide-react';

interface QRCodeScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const QRCodeScanner = ({ onScan, onClose, isOpen }: QRCodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen && isScanning) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, isScanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera access error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setError(null);
  };

  const handleStopScan = () => {
    setIsScanning(false);
    stopCamera();
  };

  const handleManualInput = () => {
    const ticketNumber = prompt('Enter ticket number:');
    if (ticketNumber) {
      onScan(ticketNumber);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Scanner
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
          
          {!isScanning ? (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Scan QR codes to mark attendance quickly
                </p>
                <Button onClick={handleStartScan} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Scanner
                </Button>
              </div>
              <div className="text-center">
                <Button variant="outline" onClick={handleManualInput} className="w-full">
                  Enter Ticket Number Manually
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 bg-black rounded-lg"
                />
                <div className="absolute inset-0 border-2 border-white border-dashed rounded-lg pointer-events-none" />
              </div>
              <div className="text-center text-sm text-gray-600">
                Position the QR code within the frame
              </div>
              <Button onClick={handleStopScan} variant="outline" className="w-full">
                Stop Scanner
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeScanner; 