import React, { useEffect, useState } from 'react';
import './page.css'
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { useStockRecord } from '../config/api';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function Company(props) {

  const { sympole } = useStockRecord([]);
  let temp = sympole[0];
  const [loading, setLoading] = useState(false);
   useEffect(() => {
    if(props?.id?.symbol){
      setLoading(false)
    }
    else
    {
      setLoading(false)
    }
   }, [props]);
  console.log(props.id, "shankar test")
  if (loading) {
    return <Box sx={{ display: 'flex' }}> <CircularProgress /> </Box>
  }
  return (
    <Paper sx={{ p: 2, margin: '20px auto', flexGrow: 1}} >
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <Img alt="complex" src={sympole[0].image} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
            <Typography gutterBottom variant="h6" component="div">
            <span className="content-bold" >{temp.symbol}</span>
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
              <span className="content-bold" >{temp.companyName}</span>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                <span className="content-bold" >CEO:</span> {temp.ceo}
              </Typography>
              <Typography variant="body2" gutterBottom >
              <span className="content-bold" > Industry: </span>{temp.industry}
              </Typography>

              <Typography variant="body2" gutterBottom >
              <span className="content-bold" > Exchange: </span>{temp.exchange}
              </Typography>

              <Typography variant="body2" gutterBottom >
              <span className="content-bold" > Average Volume: </span>{temp.volAvg}, <span className="content-bold" > Beta: </span>{temp.beta},<br/>
              <span className="content-bold" > Range: </span>{temp.range}
              </Typography>

              <Typography variant="body2" gutterBottom  sx={{textAlign:'justify'}} className="fixwidth hide-scroll">
             <span className="content-bold" > Description: </span>{temp.description}
              </Typography>

              <Typography variant="body2" color="text.secondary">
              <span className="content-bold" > Address:  </span>{temp.address}, {temp.city}, {temp.state}-{temp.zip}, {temp.country}
              </Typography>

            </Grid>
            <Grid item>
              <Typography sx={{ cursor: 'pointer' }} variant="body2">
                <a href={temp.website} target="_blank" rel="noreferrer">Open website</a>
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              price:  {sympole[0].price} {sympole[0].currency}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
