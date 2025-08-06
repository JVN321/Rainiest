"use client";

import { useState, useEffect } from "react";
import DistrictTile from "./components/DistrictTile";
import Modal from "./components/Modal";
import WeatherCanvas from "./components/WeatherCanvas";

const districts = [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod",
];

export default function Home() {
    const [districtData, setDistrictData] = useState({});
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [isNight, setIsNight] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkTime = () => {
            const hour = new Date().getHours();
            setIsNight(hour < 6 || hour >= 18);
        };

        checkTime();
        const interval = setInterval(checkTime, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchDistrictData();
    }, []);

    const fetchDistrictData = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/districts");
            const data = await response.json();
            setDistrictData(data);
        } catch (error) {
            console.error("Error fetching district data:", error);
            // Set mock data for development
            const mockData = {};
            districts.forEach((district) => {
                mockData[district] = {
                    hasLeaveInfo: Math.random() > 0.7,
                    likelyLeave: Math.random() > 0.8,
                    lastUpdated: new Date().toISOString(),
                    keywords: [],
                    fbPost: null,
                };
            });
            setDistrictData(mockData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`min-h-screen transition-all duration-500 ${
                isNight
                    ? "bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100"
                    : "bg-gradient-to-br from-cyan-50 to-blue-100 text-slate-800"
            }`}
        >
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="text-center mb-8">
                    <h1 className={`text-4xl font-bold mb-2 ${isNight ? "text-slate-100" : "text-teal-700"}`}>
                        Kerala Weather Dashboard
                    </h1>
                    <p className="text-lg opacity-80">
                        Live rain status and educational leave announcements for all 14 districts
                    </p>
                </div>

                <button
                    onClick={fetchDistrictData}
                    disabled={loading}
                    className={`fixed top-4 right-4 px-6 py-3 rounded-full font-medium transition-all ${
                        isNight
                            ? "bg-slate-700 hover:bg-slate-600 text-slate-100"
                            : "bg-teal-600 hover:bg-teal-700 text-white"
                    } ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"} shadow-lg`}
                >
                    {loading ? "Updating..." : "Refresh Data"}
                </button>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {districts.map((district) => (
                            <DistrictTile
                                key={district}
                                district={district}
                                data={districtData[district] || {}}
                                isNight={isNight}
                                onClick={() => setSelectedDistrict(district)}
                            />
                        ))}
                    </div>
                )}

                {selectedDistrict && (
                    <Modal
                        district={selectedDistrict}
                        data={districtData[selectedDistrict] || {}}
                        isNight={isNight}
                        onClose={() => setSelectedDistrict(null)}
                    />
                )}

                <WeatherCanvas
                    isVisible={selectedDistrict !== null}
                    districtData={districtData[selectedDistrict] || {}}
                    isNight={isNight}
                />
            </div>
        </div>
    );
}
