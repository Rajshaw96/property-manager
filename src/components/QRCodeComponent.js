import React from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Use the named import

const QRCodeComponent = ({ id, size = 64 }) => {
const url = `/splash-page/${id}`;

return (
    <div className="qr-code">
      <QRCodeCanvas value={url} size={size} />
    </div>
);

};

export default QRCodeComponent;
