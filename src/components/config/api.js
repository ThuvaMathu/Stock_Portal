import { useState } from "react";

const API_KEY = ''

export function useStockRecord(){
    const [loading, setLoading] = useState(true);
    //const [sympole, setSympole] = useState([]);
    const [error, setError] = useState(null);
    const sympole = [
        { title: 'My First Title', url: 'https://news.com/first-title' },
        { title: 'My Second Title', url: 'https://news.com/second-title' },
        { title: 'My Third Title', url: 'https://news.com/third-title' },
        { title: 'My Fourth Title', url: 'https://news.com/fourth-title' },
        ];
    return{ loading, sympole, error}
}