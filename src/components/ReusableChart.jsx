import React, { useEffect, useRef } from "react";
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';

const ReusableChart = ({ chartId, chartTitle, yAxisLabel, data, dataKey, labelKey }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!data) return;

        const ctx = document.getElementById(chartId);

        if (!ctx) return;

        // Extract unique labels and sort them in ascending order
        const uniqueLabels = [...new Set(data.map(item => item.year))].sort((a, b) => a - b);

        // Extract unique keys for the datasets
        const uniqueKeys = [...new Set(data.map(item => item[dataKey]))];

        // Prepare datasets for each key
        const datasets = uniqueKeys.map(key => {
            const keyData = data.filter(item => item[dataKey] === key);
            const dataValues = uniqueLabels.map(year => {
                const dataPoint = keyData.find(item => item.year === year);
                return dataPoint ? dataPoint.value : null;
            });
            const keyName = keyData.length > 0 ? keyData[0][labelKey] : `Key ${key}`;
            return {
                label: keyName,
                data: dataValues,
                fill: false,
                borderColor: getRandomColor(), // Example function to generate random colors
                tension: 0.1
            };
        });

        const chartData = {
            labels: uniqueLabels,
            datasets: datasets
        };

        const chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: chartTitle
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
                            text: yAxisLabel
                        }
                    }
                },
                onClick: (e) => {
                    const canvasPosition = getRelativePosition(e, chart);

                    // Example: Get data values corresponding to click position
                    if (chart.scales && chart.scales.x && chart.scales.y) {
                        const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
                        const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
                        console.log('Clicked on:', { x: dataX, y: dataY });
                    }
                }
            }
        });

        chartRef.current = chart;

        return () => {
            chart.destroy();
        };
    }, [data, chartId, chartTitle, yAxisLabel, dataKey, labelKey]);

    // Function to generate random RGB color
    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    };

    return (
        <div className="chart-container">
            <canvas id={chartId} width="600" height="400"></canvas>
        </div>
    );
};

export default ReusableChart;
