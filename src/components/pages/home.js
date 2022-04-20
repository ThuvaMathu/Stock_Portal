import React from 'react';
import Graph from './graph';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Container, Toolbar } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { experimentalStyled as styled } from '@mui/material/styles';
import stockchart from '../../assets/stock.jpg'
import chart2 from '../../assets/stockchart1.png'


export default function Home() {

  return (
    <>

      <div className='home'>
       
        <Toolbar>
          <h1>  Stock Price {"\u00a0\u00a0"}</h1> < BarChartIcon className='stock-head' />
        </Toolbar>
        <div className='content-container'>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 3 }} >

              <Grid item xs={12} sm={12} md={12} lg={6}  className="img-grid" >
                <img src={stockchart} alt="..." className='home-img' />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6}>
                <Box className='content'>
                  <p>
                  Welcome to the Stock Market Portal. You may click on stocks to view all the available companies
                 or Quote to get the latest price information by stock symbol, or choose Price History
                   or search to sample from the most recent  one hundred days of information for a particular stock.
                  </p>
                
                </Box>
                
              </Grid>

            </Grid>
          </Box>
        </div>
        
      </div>

    </>
  );
}
