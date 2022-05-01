import React, { useEffect, useState } from 'react';
import './page.css'
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function Company(props) {

  const [loading, setLoading] = useState(true);
  const [profiledata, setProfiledata] = useState();

   useEffect(() => {
    if(props?.id?.symbol){
      setProfiledata(props?.id)
      setLoading(false)
    }
    else
    {
      setLoading(false)
    }
   }, [props]);

  //console.log(props.id, "shankar test")
  if (loading) {
    return <Box sx={{ display: 'flex' }}> <CircularProgress /> </Box>
  }
  return (
    <>
    
    <Paper sx={{ p: 2, margin: '20px auto', flexGrow: 1}} className='profile'>
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
          <a href={profiledata.website} target="_blank" className="namelink" rel="noreferrer"><Img alt="complex" src={profiledata.image} /></a>
            
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
            <Typography gutterBottom variant="h6" component="div">
            <span className="content-bold" >{profiledata.symbol}</span>
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
              <a href={profiledata.website} target="_blank" className="namelink" rel="noreferrer">{profiledata.companyName}</a>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                <span className="content-bold" >CEO:</span> {profiledata.ceo}
              </Typography>
              <Typography variant="body2" gutterBottom >
              <span className="content-bold" > Industry: </span>{profiledata.industry}
              </Typography>

              <Typography variant="body2" gutterBottom >
              <span className="content-bold" > Exchange: </span>{profiledata.exchange}
              </Typography>

              <Typography variant="body2" gutterBottom >
              <span className="content-bold" > Average Volume: </span>{profiledata.volAvg}, <span className="content-bold" > Beta: </span>{profiledata.beta},<br/>
              <span className="content-bold" > Range: </span>{profiledata.range}
              </Typography>
              <Typography variant="body2" gutterBottom  sx={{textAlign:'justify'}} className="discription">
             <span className="content-bold" > Description: </span>{profiledata.description}
              </Typography>

              <Typography variant="body2" color="text.secondary">
              <span className="content-bold" > Address:  </span>{profiledata.address}, {profiledata.city}, {profiledata.state}-{profiledata.zip}, {profiledata.country}
              </Typography>

            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              price:  {profiledata.price} {profiledata.currency}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
    </>
  );
}
