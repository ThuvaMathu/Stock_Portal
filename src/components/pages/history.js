import React, { useState, useEffect } from 'react';
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
import ShowChartIcon from '@mui/icons-material/ShowChart';

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
  const { order, orderBy,onRequestSort } =
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
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function History() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('1. close');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rowdata, setRowdata] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getdata() {
    let url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo"
    let res = await fetch(url);
    let data = await res.json();
    dayslist(data['Time Series (Daily)'], Object.values(data['Time Series (Daily)']))
    setLoading(false)
    return data;
  }

  useEffect(() => {
    console.log("hello")
    getdata();
  }, []);

  function dayslist(json, value) {
    let index;
    let arr1 = [];
    for (index in json) {
      let date = index.toString();
      arr1.push({ date });
    }
    const results = arr1.map((ar, index) =>
      Object.assign({}, ar, value[index])
    )
    setRowdata(results)
  }

  if (loading) {
    return <p>Loading...</p>
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


  return (
    <>
      <Toolbar>
        <h1>  Price history 2{"\u00a0\u00a0"}</h1> < ShowChartIcon className='stock-head' />
      </Toolbar>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}  stickyHeader aria-label="sticky table" >            
        <TableHeader  order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={rowdata.length} />
            <TableBody>
            {stableSort(rowdata, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.symbol}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} >
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowdata.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </>
  );
}
