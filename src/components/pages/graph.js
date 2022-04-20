import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';

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
        },
        title: {
            display: false,
            text: 'Chart.js Line Chart',
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];


//console.log(data,"d")

export default function Graph(props) {
    const propdata = props.data
    const [closes, setCloses] = useState([]);
    const [labels, setLabels] = useState([]);
    const [low, setLow] = useState([]);
    const [high, setHigh] = useState([]);
    const [volume, setVolume] = useState([]);

    const [loading, setLoading] = useState(true);


    //console.log(propdata, "graph data date")
    //let dates = [];
    //let closes = [];

    function processdata(pro) {
        for (let i in pro) {
            let d = pro[i].date
            d = d.toString();
            setLabels(labels => [...labels, d])
            setCloses(closes => [...closes, pro[i]['4. close']])
            setLow(low => [...low, pro[i]['2. low']])
            setHigh(high => [...high, pro[i]['3. high']])
            setVolume(volume => [...volume, pro[i]['5. volume']])


            //closes.push(pro[i]['4. close']);
        }

    }


    async function getgraphdata(prodata) {
        await processdata(prodata)
        setLoading(false)
        //console.log(dates, "graph2 dates")
        //console.log(closes, "graph2 close")


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

    //console.log(data2,"data2")

    if (loading) {
        return <p>Loading...</p>
    }
    return (
        <>
            <div>
                <Line options={options} data={closedata} />
            </div>
            <div>
                <Bar options={options} data={lowhighdata} />
            </div>
            <div>
                <Bar options={options} data={volumedata} />
            </div>



        </>
    );
}
