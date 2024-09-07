import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const ScanPage: React.FC = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null);

  const handleScan = async (data: string | null) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        const response = await fetch('https://lavial.icu/verify-ticket', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uniq_id: parsedData.uniq_id }),
        });
        if (response.ok) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        setVerificationStatus('error');
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-6">Scanează QR</h2>
      <div style={{ width: '100%' }}>
        <QrReader
          constraints={{ facingMode: 'environment' }}
          onResult={(result) => {
            if (result?.getText()) {
              handleScan(result.getText());
            }
          }}
          videoContainerStyle={{ width: '100%' }}
        />
      </div>
      {verificationStatus && (
        <p className={`mt-4 p-2 text-white ${verificationStatus === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {verificationStatus === 'success' ? 'Valid!' : 'Invalid!'}
        </p>
      )}
    </div>
  );
};

export default ScanPage;