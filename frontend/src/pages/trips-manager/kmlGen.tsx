import React from 'react';
import { saveAs } from 'file-saver';

const KmlGenerator = ({ latlongArray }) => {
    const generateKml = () => {
        const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
        <kml xmlns="http://www.opengis.net/kml/2.2">
        <Document>
        <name>Generated KML</name>`;
        const kmlFooter = `</Document></kml>`;

        const coordinates = latlongArray.map(latlong => {
            return `${latlong.position.lng},${latlong.position.lat},0`;
        }).join(' ');

        const kmlBody = `
            <Placemark>
                <name>Polyline</name>
                <LineString>
                    <coordinates>${coordinates}</coordinates>
                </LineString>
            </Placemark>`;

        const kmlContent = kmlHeader + kmlBody + kmlFooter;
        const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
        saveAs(blob, 'output.kml');
    };

    return (
        <div>
            <button onClick={generateKml}>Generate KML</button>
        </div>
    );
};

export default KmlGenerator;
