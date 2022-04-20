import React, { useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, Toolbar } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useStockRecord } from '../config/api';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Company from './company';


const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)

export default function Stock() {

  const [rowdata, setRowdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { sympole } = useStockRecord([]);
  const [profile, setProfile] = useState();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  const myRef = useRef(null)

  const columns = [
    { id: 'symbol', label: 'Symbol', minWidth: 100 },
    { id: 'name', label: 'Company Name', minWidth: 100 },
    { id: 'sector', label: 'Industry', minWidth: 100 },

  ];
  const API_KEY = 'f09e040716cb0920a7927288d97a5067A'
 

  async function getdata() {
    let url = `https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${API_KEY}`
    let res = await fetch(url);
    let data = await res.json();
    setRowdata(data)
    if (data.length > 0) { setLoading(false) }
    
  }
  async function getprofile(id) {
    let url = `https://financialmodelingprep.com/api/v3/profile/${id}?apikey=${API_KEY}`
    let res = await fetch(url);
    let data = await res.json();
    setProfile(data[0])

  }
  async function getdata2() {
    let url = `https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${API_KEY}`
    try {
      let res = await fetch(url);
      let data = await res.json();
      setRowdata(data)
      if (data.length > 0) { setLoading(false) }
      else{
        setError('There Is no data avilable to show')
        setLoading(false)
      }
    }
    catch (err) {
      setError('There has been a problem with fetching data from server')
      setLoading(false)
      //console.log(error, "error length")

    }
  }

  useEffect(() => {
    //getdata2();
  }, []);



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  function handleClick(id) {
    //console.log(id,"ids")
    getprofile(id);
    setOpen(true)
    scrollToRef(myRef)
  };


  if (loading) {
    return<Box sx={{ display: 'flex' }}> <CircularProgress /> </Box>
  }
  if (error !== null) {
    return <Box sx={{ display: 'flex' }}> <p>{error}</p> </Box>
  }

  return (
    <>

      <Toolbar>
        <h1>  Stock {"\u00a0\u00a0"}</h1> < ShowChartIcon className='stock-head' />
      </Toolbar>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sympole
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.symbol}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} >
                            {value}
                          </TableCell>

                        );
                      })}
                      <TableCell >

                        <Button type="button" variant="contained" size='small' color="secondary" onClick={() => handleClick(row.symbol)} > View Profile </Button>

                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={rowdata.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <div ref={myRef}>
        {open &&
          <Company id={profile} />

        }

      </div>
      
    </>
  );
}
