import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Autocomplete, Button, Container, Divider, Grid, TextField, Toolbar } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StyledTableRow } from './tableextra';
import spaceimg from '../../assets/swr.png'



export default function Quote() {

  const [rowdata, setRowdata] = useState();
  const [filterdata, setFilterdata] = useState()
  const [showdata, setShowdata] = useState();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [profile, setProfile] = useState(0);
  const [value, setValue] = useState('');
  const [dropdown, setDropdown] = useState([]);
  const [showerror, setShowerror] = useState(false);


  const columns = [
    { id: 'symbol', label: 'Symbol', minWidth: 100 },
    { id: 'name', label: 'Company Name', minWidth: 100 },
    { id: 'sector', label: 'Industry', minWidth: 100 },
  ];

  const API_KEY = 'f09e040716cb0920a7927288d97a5067'

  async function getdata() {
    let url = `https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${API_KEY}`
    try {
      let res = await fetch(url);
      let data = await res.json();
      setRowdata(data);
      setFilterdata(data);
      setShowdata(data);
      setdropdata(data);
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

    }

  }


  useEffect(() => {
    getdata();
  }, []);

  const searchSymbol = (searchedSymbol) => {
    toast.dismiss()
    if (profile > 0) {
      const filteredRows = filterdata.filter((row) => {
        return row.symbol.toString().toLowerCase().includes(searchedSymbol.toString().toLowerCase());
      });
      if (filteredRows.length <= 0) {
        console.log(filteredRows.length, " no data found")
        toast.warn("No stocks could be found for your search");
      }
      if (searchedSymbol.length < 1) {

        setShowdata(filterdata)
      }
      else {
        setShowdata(filteredRows)
      }
    }
    else {
      const filteredRows = rowdata.filter((row) => {

        return row.symbol.toString().toLowerCase().includes(searchedSymbol.toString().toLowerCase());
      });
      if (filteredRows.length <= 0) {
        console.log(filteredRows.length, " no data found")
        toast.warn("No stocks could be found for your search");
      }
      if (searchedSymbol.length < 1) {

        setShowdata(rowdata)
      }
      else {
        setShowdata(filteredRows)
      }
    }
  };



  const handleselect = () => {
    setProfile(value.length);
    console.log(profile, "search test")
    const filteredRows = rowdata.filter((row) => {
      return row.sector.toString().toLowerCase().includes(value.toString().toLowerCase());
    });
    if (filteredRows.length < 1) {
      setFilterdata(rowdata)
    }
    else {
      setFilterdata(filteredRows)
      setShowdata(filteredRows)
    }
  };

  function setdropdata(data) {
    const result = data.filter((thing, index, self) =>
      index === self.findIndex((t) => (
        t.sector === thing.sector
      ))
    )
    setDropdown(result)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
      <div >
        <Toolbar>

          <h1>  Quote {"\u00a0\u00a0"}</h1> < ShowChartIcon className='stock-head' />
        </Toolbar>

        <Container className='qoute-container'>
          <Grid container justifyContent="center" className='quote-search' spacing={3}>
            <Grid item>
              <TextField id="outlined-basic" label="Search symbol" variant="outlined" onChange={(e) => searchSymbol(e.target.value)} />
            </Grid>
            <Grid item>
              <Autocomplete

                autoHighlight
                options={dropdown.map((option) => option.sector)}
                sx={{ width: 300 }}
                inputValue={value}
                onInputChange={(event, newInputValue) => { setValue(newInputValue); }}
                renderInput={(params) => <TextField{...params} label="Search industries" />}
              />
            </Grid>
            <Grid item>
              <Button type="button" variant="contained" size='small' color="secondary" className='history-button' onClick={() => handleselect()} > <SearchIcon /> Search industry</Button>
            </Grid>
          </Grid>
        </Container>

        <Divider />
        <Paper className='table-paper table-margin' >
          <TableContainer component={Paper} sx={{ maxHeight: "700px" }} className='table'>
            <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }} size="medium" >
              <TableHead >
                <TableRow >
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
                {showdata
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <StyledTableRow hover tabIndex={-1} key={row.symbol} className="quote-tablecell">
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} >
                              {value}
                            </TableCell>

                          );
                        })}
                        <TableCell >
                          <Link className='react-link' to={`/history/${row.symbol},${row.name}`}>Historypro → </Link>
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
            count={filterdata.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <ToastContainer
          position="top-right"
          autoClose={8000}
          hideProgressBar={false}
          newestOnTop={false}
          draggable={false}
          pauseOnVisibilityChange
          closeOnClick
          pauseOnHover
        />
      </div>
    </>
  );
}
