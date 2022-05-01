import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Grid, TextField } from '@mui/material';
import { symbollist } from '../config/apis2';
import Autocomplete from '@mui/material/Autocomplete';
import Graph from './graph';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import HistoryIcon from '@mui/icons-material/History';
import { toast } from 'react-toastify';
import { StyledTableRow } from './tableextra';
import swr from '../../assets/swr.png';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


const columns = [
  { id: 'date', label: 'Date', minWidth: 100 },
  { id: '1. open', label: 'Open', minWidth: 100 },
  { id: '2. high', label: 'High', minWidth: 100 },
  { id: '3. low', label: 'Low', minWidth: 100 },
  { id: '4. close', label: 'Close', minWidth: 100 },
  { id: '5. volume', label: 'Volume', minWidth: 100 },
];


function TableHeader(props) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead >
      <TableRow>

        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            className="tableheader"
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

TableHeader.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};




//--------Price history----------

function Pricehistory(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('1. close');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rowdata, setRowdata] = useState([]);
  const [showdata, setShowdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchdate, setSearchdate] = useState();
  const [showerror, setShowerror] = useState(false);


  const API_KEY = 'J8R2RN1PX4OKM418'
  const API_KEY2 = 'demo'

  const { id, name } = props;

  async function getdata(sy) {
    console.log(id, "demmo id")
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${sy}&apikey=${API_KEY}`
    try {
      let res = await fetch(url);
      let data = await res.json();
      dayslist(data['Time Series (Daily)'], Object.values(data['Time Series (Daily)']));
      let temp = Object.values(data['Time Series (Daily)'])
      //console.log(temp.length, "error length")
      if (temp.length > 1) { setLoading(false) }
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
    setLoading(true)
    getdata(id);
  }, [props]);

  function dayslist(json, value) {
    let index;
    let arr1 = [];
    let arr2 = [];
    for (index in json) {
      let date = index.toString();
      arr1.push({ date });
      arr2.push(date);
    }
    const results = arr1.map((ar, index) =>
      Object.assign({}, ar, value[index]),

    )
    setRowdata(results)
    setShowdata(results)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowdata.length) : 0;

  const handlesearch = () => {
    toast.dismiss();
    if (searchdate != null) {
      console.log(searchdate)
      let startDate = new Date(searchdate);
      let endDate = new Date(Math.max(...showdata.map(e => new Date(e.date))));
      let datefilter = showdata.filter(function (x) { return new Date(x.date) >= startDate && new Date(x.date) <= endDate });
      console.log(datefilter, "filter date");
      setRowdata(datefilter)
      if (datefilter < 1) {
        toast.error("There is No data available from this date")
      }
    }
    else {
      setRowdata(showdata)
    }
  }

  const handleclear = () => {
    setRowdata(showdata)
  }

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
            <img alt='...' src={swr} className="errorimg" />
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      <div >
        <div>
          <Box className='quote-search'>
            <Grid container justifyContent="left" spacing={2}>
              <Grid item>
                <TextField label="Search Date From" color="success" type="date" focused onChange={(e) => setSearchdate(e.target.value)} />
              </Grid>
              <Grid item>
                <Button type="button" variant="contained" size='small' color="secondary" className='history-button' onClick={() => handlesearch()} > <SearchIcon /> Search</Button>
              </Grid>
              <Grid item>
                <Button type="button" variant="contained" size='small' color="secondary" className='history-button' onClick={() => handleclear()} ><ClearIcon /> Clear</Button>
              </Grid>
            </Grid>
          </Box>
        </div>
        <Paper className="show-stock">
          <p>Showing Stocks for the <span>{name}</span> </p>
        </Paper>

        <div className='table-container' >
          <Paper className='table-paper'>
            <TableContainer className='table'>
              <Table aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'} stickyHeader >
                <TableHeader order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={rowdata.length} />
                <TableBody>
                  {stableSort(rowdata, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.date}>
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} >
                                {value}
                              </TableCell>
                            );
                          })}
                        </StyledTableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, rowdata.length]}
              component="div"
              count={rowdata.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <div className='dense' >
              <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
            </div>
          </Paper>


        </div>
        <Box>
          <Graph data={rowdata} />
        </Box>
      </div>
    </>
  );
}

export default function History(props) {

  const { propsymbol, propname } = props.match.params;
  const [searchname, setSearchname] = useState();
  const [showdata, setShowdata] = useState();
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState();
  const [open, setOpen] = useState(false);
  const [showerror, setShowerror] = useState(false);


  const API_KEY = 'f09e040716cb0920a7927288d97a5067'

  useEffect(() => {
   // console.log(Object.values.props,"prop length")
      //;
      if (propname){
        setLoading(false)
      }
      else{
        getdata()
      }
    
    
  }, [props]);

  async function getdata() {
    console.log("hit")
    let url = `https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${API_KEY}`
    try{
    let res = await fetch(url);
    let data = await res.json();
    setShowdata(data)
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
   
  const handleselect = () => {
    if (value != null) {
      setOpen(true)
      console.log(searchname, "symbole test")
      console.log(value, "value test")
    }
  }

  if (!propname) {


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
              <img alt='...' src={swr} className="errorimg" />
            </div>
          </div>
        </>
      )
    }
    return (
      <>
        <div>
          <Toolbar>
            <h1>  Price history {"\u00a0\u00a0"}</h1> < HistoryIcon className='stock-head' />
          </Toolbar>

          <Box className='quote-search'>
            <Grid container justifyContent="center" spacing={1}>
              <Grid item>
                <Autocomplete
                  disablePortal
                  autoHighlight
                  getOptionLabel={(option) => option.name}
                  options={showdata}
                  sx={{ width: 300 }}
                  onChange={(event, newValue) => { setValue(newValue.symbol); setSearchname(newValue.name); setOpen(false) }}
                  renderInput={(params) => <TextField {...params} label="Search symbol" />}
                />
              </Grid>
              <Grid item>
                <Button type="button" variant="contained" size='small' color="secondary" className='history-button' onClick={() => handleselect()} > <SearchIcon /> Search </Button>
              </Grid>
            </Grid>
          </Box>
          <hr />

          <div className='margintop10px'>
            {open &&
              <Pricehistory id={value} name={searchname} />
            }
          </div>


        </div>
      </>
    );
  }
  else {

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
    return (
      <>
        <Toolbar>
          <h1>  Price history {"\u00a0\u00a0"}</h1> < HistoryIcon className='stock-head' />
        </Toolbar>


        <hr />

        <div className='margintop10px'>

          <Pricehistory id={propsymbol} name={propname} />

        </div>

      </>
    );
  }
}