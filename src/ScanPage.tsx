import React, { useState } from 'react';
import QrScanner from 'qr-scanner'; // Asigură-te că folosești componenta/corectă importată

const ScanPage: React.FC = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleScan = async (data: string) => {
    if (data) {
      setScannedData(data); // Stochează datele scanate pentru debugging
      try {
        const parsedData = JSON.parse(data);

        if (!parsedData.uniq_id) {
          setVerificationStatus('error');
          setErrorMessage('ID-ul unic nu a fost găsit în datele QR.');
          return;
        }

        const response = await fetch('https://lavial.icu/verify-ticket', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uniq_id: parsedData.uniq_id }),
        });

        if (response.ok) {
          setVerificationStatus('success');
          setErrorMessage(null); // Resetează mesajul de eroare
        } else {
          const errorData = await response.json();
          setVerificationStatus('error');
          setErrorMessage(errorData.message || 'Eroare necunoscută la verificarea biletului.');
        }
      } catch (error) {
        console.error('Error parsing data or verifying ticket:', error);
        setVerificationStatus('error');
        setErrorMessage('Eroare la parsarea datelor QR sau la conectarea la server.');
      }
    }
  };

  const startScanner = () => {
    const videoElement = document.getElementById('qr-video') as HTMLVideoElement;
    if (videoElement) {
      const qrScanner = new QrScanner(
        videoElement,
        (result) => handleScan(result.data), // Gestionează rezultatul scanării
        { preferredCamera: 'environment' } // Opțiuni de cameră
      );
      qrScanner.start();
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-6">Scanează QR</h2>
      <div>
        <video id="qr-video" width="100%"></video> {/* Video pentru camera */}
        <button
          onClick={startScanner}
          className="w-full bg-blue-500 text-white py-2 rounded mt-4"
        >
          Pornește Scanner-ul
        </button>
      </div>
      {scannedData && (
        <p className="mt-4 p-2 bg-gray-100 text-gray-700 rounded">
          Date scanate: {scannedData}
        </p>
      )}
      {verificationStatus && (
        <p className={`mt-4 p-2 text-white ${verificationStatus === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {verificationStatus === 'success' ? 'Valid!' : `Invalid! ${errorMessage}`}
        </p>
      )}
    </div>
  );
};

export default ScanPage;