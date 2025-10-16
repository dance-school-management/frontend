'use client';

import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { toast } from 'sonner';
import { checkTicketValidity } from '@/lib/api/enroll';

interface QRScannerProps {
  cookie: string;
}

export function QRScanner({ cookie }: QRScannerProps) {
  const onScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length && detectedCodes[0]?.rawValue) {

      let qrCodeValue: string;
      try {
        qrCodeValue = JSON.parse(detectedCodes[0].rawValue).qrCodeUUID;
      } catch {
        toast.error('Invalid QR code');
        return;
      }

      try {
        const result = await checkTicketValidity(qrCodeValue, cookie);

        if (result.error) {
          toast.error(`Ticket validation failed: ${result.error.message}`);
        } else {
          toast.success('Ticket is valid!');
        }
      } catch {
        toast.error('Error validating ticket');
      }
    }
  };

  const onError = (error: unknown) => {
    console.error(error);
    toast.error('Error scanning QR code');
  };

  return (
    <div className="w-full">
      <Scanner
        formats={['qr_code']}
        onScan={onScan}
        onError={onError}
        components={{ finder: false }}
        allowMultiple
        scanDelay={5000}
        styles={{ container: containerStyles }}
        sound={false}
      />
    </div>
  );
}

const containerStyles = {
  '--s': 'min(10rem, 20vw)',
  padding: '0.25rem',
  border: '0.5rem solid var(--foreground)',
  WebkitMask: `
        conic-gradient(at var(--s) var(--s),#0000 75%,#000 0)
        0 0/calc(100% - var(--s)) calc(100% - var(--s)),
        linear-gradient(#000 0 0) content-box
    `
};
