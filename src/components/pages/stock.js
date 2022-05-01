import React, { useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, Divider, Toolbar } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { symbollist } from '../config/apis2';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Company from './company';
import { StyledTableRow } from './tableextra';
import spaceimg from '../../assets/swr.png'
import { toast } from 'react-toastify';

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)

export default function Stock() {

  const [rowdata, setRowdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [profile, setProfile] = useState();
  const [open, setOpen] = useState(false);
  const [showerror, setShowerror] = useState(false);
  const myRef = useRef(null)
  const columns = [
    { id: 'symbol', label: 'Symbol', minWidth: 100 },
    { id: 'name', label: 'Company Name', minWidth: 100 },
    { id: 'sector', label: 'Industry', minWidth: 100 },

  ];

  const API_KEY = 'f09e040716cb0920a7927288d97a5067'

  async function getprofile(id) {
    let url = `https://financialmodelingprep.com/api/v3/profile/${id}?apikey=${API_KEY}`
    try {
      let res = await fetch(url);
      let data = await res.json();
      console.log(data, "profile")
      setProfile(data[0])
      if (data.length > 0) { setOpen(true); }
      else {
        toast.warn('There is no data available to display.');
      }
    }
    catch (err) {
      toast.error('There was an issue with retrieving data from the server.');
      //console.log(error, "error length")
    }
  }

  async function getdata() {
    let url = `https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${API_KEY}`
    try {
      let res = await fetch(url);
      let data = await res.json();
      setRowdata(data)
      if (data.length > 0) { setLoading(false) }
      else {
        setShowerror(true)
        toast.warn('There is no data available to display.');
        setLoading(false)
      }
    }
    catch (err) {
      setShowerror(true)
      toast.error('There was an issue with retrieving data from the server.');
      setLoading(false)
      //console.log(error, "error length")
    }
  }

  useEffect(() => {
    getdata();
  }, []);



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  function handleClick(id) {

    getprofile(id);
    scrollToRef(myRef)
    console.log(profile, "ids")

  };


  if (loading) {
    return (
      <>
        <div className='center-loading'>
          <div className='loading-container'>
            <Box sx={{ display: 'flex' }}> <CircularProgress color="secondary" /> </Box>
          </div>

        </div>

      </>
    )
  }
  if (showerror) {
    return (
      <>
        <div className='center-loading'>
          <div className='error-container'>
            <img alt='...' src={spaceimg} className="errorimg" />
          </div>
        </div>
      </>
    )
  }

  return (
    <>

      <Toolbar>
        <h1>  Stock {"\u00a0\u00a0"}</h1> < ShowChartIcon className='stock-head' />
      </Toolbar>
      <Paper sx={{ width: '100%', overflow: 'hidden' }} className='table-paper table-margin' >
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table" >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }} className="tableheader" >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell style={{ minWidth: "100px" }} className="tableheader" >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowdata
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <StyledTableRow hover tabIndex={-1} key={row.symbol}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} >
                            {value}
                          </TableCell>
                        );
                      })}
                      <TableCell  >

                        <Button type="button" variant="contained" size='small' color="secondary" onClick={() => handleClick(row.symbol)} > View Profile </Button>

                      </TableCell>
                    </StyledTableRow>
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
      <Divider/>

      <div ref={myRef}>
        {open &&
          <Company id={profile} />

        }

      </div>
      <br />


    </>
  );
}
