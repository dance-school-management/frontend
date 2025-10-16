"use client";

import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

import { toast } from 'sonner';

export default function Page() {
    const [data, setData] = useState<string | null>(null);

    const onScan = (detectedCodes: IDetectedBarcode[]) => {
        if (detectedCodes.length && detectedCodes[0]?.rawValue) {
            toast.success('QR code detected');
            setData(detectedCodes[0].rawValue);
        }
    };

    const onError = (error: unknown) => {
        console.error(error);
        toast.error('Error scanning QR code');
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-[80%] max-w-[500px] mx-auto">
                <Scanner
                    formats={['qr_code']}
                    onScan={onScan}
                    onError={onError}
                    components={{ finder: false }}
                    allowMultiple
                    scanDelay={5000}
                    styles={{ container: containerStyles }}
                />
            </div>
        </div>
    );
};

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