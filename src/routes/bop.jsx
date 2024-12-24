import React, { useEffect } from "react";
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import bopData from "../data/bopData.json"; 

const BopChart = () => {
    useEffect(() => {
        if (!bopData) return;

        const ctx = document.getElementById('bopChart');
        
        if (!ctx) return;

        const parsedData = JSON.parse(bopData.body);

        const subcategories = [...new Set(parsedData.map(item => item.subcategory_id))];

        const uniqueYears = [...new Set(parsedData.map(item => item.year))].sort((a, b) => a - b);

        const datasets = subcategories.map(subcategory => {
            const subcategoryData = parsedData.filter(item => item.subcategory_id === subcategory);
            const dataValues = uniqueYears.map(year => {
                const dataPoint = subcategoryData.find(item => item.year === year);
                return dataPoint ? dataPoint.value : null;
            });
            const subcategoryName = subcategoryData.length > 0 ? subcategoryData[0].name : `Subcategory ${subcategory}`;
            return {
                label: subcategoryName,
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
                        text: 'BoP Data by Year'
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
                            text: 'Values (Mill. USD)'
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
        <div className="chart-container" style={{ width: '70%', height: '70%', margin: '0 auto' }}>
            <canvas id="bopChart"></canvas>
        </div>
    );
};

export default BopChart;
