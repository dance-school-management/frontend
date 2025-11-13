'use client';

import { checkTicketValidity, markTicketAsUsed } from '@/lib/api/enroll';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui/alert-dialog';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { CircleCheckBig } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface QRScannerProps {
  cookie: string;
}

export function QRScanner({ cookie }: QRScannerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const lastProcessedQrCode = useRef<string | null>(null);
  const isProcessingRef = useRef<boolean>(false);

  const onScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (!detectedCodes || detectedCodes.length === 0) return;

    const raw = detectedCodes[0]?.rawValue;
    if (!raw) return;

    if (isProcessingRef.current || isDialogOpen) {
      return;
    }

    let parsedQrUuid: string | null = null;
    try {
      const parsed = JSON.parse(raw);
      parsedQrUuid = typeof parsed?.qrCodeUUID === 'string' ? parsed.qrCodeUUID : null;
      if (!parsedQrUuid) throw new Error('Missing qrCodeUUID');
    } catch {
      if (lastProcessedQrCode.current !== raw) {
        lastProcessedQrCode.current = raw;
        toast.error('Invalid QR code');
      }
      return;
    }

    if (lastProcessedQrCode.current === parsedQrUuid) {
      return;
    }

    isProcessingRef.current = true;
    try {
      const result = await checkTicketValidity(parsedQrUuid, cookie);
      if (!result?.error) {
        lastProcessedQrCode.current = parsedQrUuid;
        setQrCodeValue(parsedQrUuid);
        setIsDialogOpen(true);
      } else {
        toast.error(`Failed to validate ticket: ${result.error?.message ?? 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error validating ticket');
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleConfirm = async () => {
    if (!qrCodeValue) return;

    setIsProcessing(true);
    try {
      const result = await markTicketAsUsed(qrCodeValue, cookie);

      if (result?.error) {
        toast.error(`Failed to use ticket: ${result.error.message}`);
      } else {
        toast.success('Ticket successfully used!');
        setIsDialogOpen(false);
        setQrCodeValue(null);
        lastProcessedQrCode.current = null;
      }
    } catch {
      toast.error('Error using ticket');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setQrCodeValue(null);
    lastProcessedQrCode.current = null;
  };

  const onError = (error: unknown) => {
    console.error(error);
    toast.error('Error scanning QR code');
  };

  return (
    <>
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

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mb-4 flex size-9 items-center justify-center rounded-full bg-green-600/10 sm:mx-0 dark:bg-green-400/10">
              <CircleCheckBig className="size-4.5 text-green-600 dark:text-green-400" />
            </div>
            <AlertDialogTitle>Ticket is Valid</AlertDialogTitle>
            <AlertDialogDescription>
              The scanned ticket is valid. Do you want to confirm and use this ticket?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isProcessing}
              className="bg-green-600 text-white hover:bg-green-600 focus-visible:ring-green-600 dark:bg-green-400 dark:hover:bg-green-400 dark:focus-visible:ring-green-400"
            >
              {isProcessing ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
