import React from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Use the named import

const QRCodeComponent = ({ id, size = 64 }) => {
const url = `https://property-manager-j6d4.onrender.com/splash-page/${id}`;

return (
    <div className="qr-code">
      <QRCodeCanvas value={url} size={size} />
    </div>
);

};

export default QRCodeComponent;
