import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Box, CircularProgress, Paper } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                font: {
                    size: 20,
                    weight:600,
                    family:'Cambria, Cochin, Georgia, Times, Times New Roman,serif'
                }
            }
        },
        title: {
            display: false,
            text: 'Chart.js Line Chart',
        },
    },
};

export default function Graph(props) {
    const propdata = props.data
    const [closes, setCloses] = useState([]);
    const [labels, setLabels] = useState([]);
    const [low, setLow] = useState([]);
    const [high, setHigh] = useState([]);
    const [volume, setVolume] = useState([]);

    const [loading, setLoading] = useState(true);




    function processdata(pro) {
        for (let i in pro) {
            let d = pro[i].date
            d = d.toString();
            setLabels(labels => [...labels, d])
            setCloses(closes => [...closes, pro[i]['4. close']])
            setLow(low => [...low, pro[i]['3. low']])
            setHigh(high => [...high, pro[i]['2. high']])
            setVolume(volume => [...volume, pro[i]['5. volume']])



        }

    }
    async function getgraphdata(prodata) {
        await processdata(prodata)
        setLoading(false)

    }
    useEffect(() => {
        setLoading(true)
        setCloses([]);
        setLabels([]);
        getgraphdata(props.data)
    }, [props]);

    const closedata = {
        labels,
        datasets: [
            {
                label: 'Closed price',
                data: closes,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },

        ],
    }
    const lowhighdata = {
        labels,
        datasets: [
            {
                label: 'Low',
                data: low,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'High',
                data: high,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },

        ],
    }
    const volumedata = {
        labels,
        datasets: [
            {
                label: 'Volume',
                data: volume,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    }

    if (loading) {
        return <Box sx={{ display: 'flex' }}> <CircularProgress /> </Box>
    }
    return (
        <>
            <div>
                <Paper className='chart-paper'>
                <Line options={options} data={closedata} />
                </Paper>
               
            </div>
            <div>
            <Paper className='chart-paper'>
                <Bar options={options} data={lowhighdata} />
                </Paper>
            </div>
            <div>
            <Paper className='chart-paper'>
                <Bar options={options} data={volumedata} />
                </Paper>
            </div>



        </>
    );
}
