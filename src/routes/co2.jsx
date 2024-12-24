import React, { useEffect, useState } from "react";
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import co2data from "../data/co2Data.json";

const Co2Chart = () => {
    const [co2Data, setCo2Data] = useState(null);

    useEffect(() => {
    }, []);

    useEffect(() => {
        console.log(co2Data);
        const ctx = document.getElementById('co2Chart');
        
        if (!ctx) return;

        const parsedData = JSON.parse(co2data.body);

        const companies = [...new Set(parsedData.map(item => item.company_code))];

        const uniqueYears = [...new Set(parsedData.map(item => item.year))].sort((a, b) => a - b);

        const datasets = companies.map(company => {
            const companyData = parsedData.filter(item => item.company_code === company);
            const dataValues = uniqueYears.map(year => {
                const dataPoint = companyData.find(item => item.year === year);
                return dataPoint ? dataPoint.co2_emission_ton : null;
            });
            return {
                label: company,
                data: dataValues,
                fill: false,
                borderColor: getRandomColor(),
                tension: 0.1
            };
        });

        const data = {
            labels: uniqueYears,
            datasets: datasets
        };

        const chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'CO2 Emissions by Year'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'CO2 Emissions (tons)'
                        }
                    }
                },
                onClick: (e) => {
                    const canvasPosition = getRelativePosition(e, chart);

                    if (chart.scales && chart.scales.x && chart.scales.y) {
                        const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
                        const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
                        console.log('Clicked on:', { x: dataX, y: dataY });
                    }
                }
            }
        });

        return () => {
            chart.destroy();
        };
    }, []);

    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    };

    return (
        <div className="chart-container" style={{ width: '70%', height: '100%', margin: '0 auto' }}>
            <canvas id="co2Chart"></canvas>
        </div>
    );
};

export default Co2Chart;
