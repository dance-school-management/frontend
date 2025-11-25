import { headers } from 'next/headers';

import { QRScanner } from '@/components/qr/qr-scanner';

export default async function Page() {
    const cookie = (await headers()).get('cookie') ?? "";

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-[80%] max-w-[500px] mx-auto">
                <QRScanner cookie={cookie} />
            </div>
        </div>
    );
}