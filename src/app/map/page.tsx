"use client";
import React, { useState } from 'react';
import GetParking from '../feature/getParking';

// サンプルデータ
const sampleLocations = [
    { name: "名古屋城", lat: 35.1855875, lng: 136.8990919 },
    { name: "バンタン", lat: 35.1672471, lng: 136.8788377 },
];

// 初期表示する地点
const initialLocation = sampleLocations[0];

export default function ParkingTestPage() {
    
    // 現在選択されている地点の緯度経度を state で管理
    const [currentLat, setCurrentLat] = useState(initialLocation.lat);
    const [currentLng, setCurrentLng] = useState(initialLocation.lng);
    const [currentName, setCurrentName] = useState(initialLocation.name);

    // ボタンがクリックされたときの処理
    const handleLocationChange = (loc: { name: string, lat: number, lng: number }) => {
        setCurrentName(loc.name);
        setCurrentLat(loc.lat);
        setCurrentLng(loc.lng);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>📍 駐車場検索 サンプル</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <strong>検索地点を選択してください:</strong>
                {sampleLocations.map((loc) => (
                    <button
                        key={loc.name}
                        onClick={() => handleLocationChange(loc)}
                        style={{ 
                            margin: '5px', 
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontWeight: currentName === loc.name ? 'bold' : 'normal',
                            backgroundColor: currentName === loc.name ? '#e0e0e0' : '#f4f4f4',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    >
                        {loc.name}
                    </button>
                ))}
            </div>

            <hr style={{ margin: '20px 0' }} />

            <h3>{currentName} 周辺の駐車場</h3>
            <GetParking 
                lat={currentLat} 
                lng={currentLng} 
                limit={10}
            />
        </div>
    );
}