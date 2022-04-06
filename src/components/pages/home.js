import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Toolbar } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';





export default function Home() {

 
const [rowdata, setRowdata] = React.useState([]); 
const API_KEY = 'f09e040716cb0920a7927288d97a5067A'
const columns = [
  { id: 'symbol', label: 'Symbol', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'exchangeShortName', label: 'Exchange Short Name', minWidth: 100 },
  { id: 'exchange', label: 'Exchange', minWidth: 100 },
  { id: 'type', label: 'Type', minWidth: 100 },
];
React.useEffect(() => {
  fetch(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${API_KEY}`)
  .then(res => res.json())
  .then(data =>
    data.map(stock => {
      return {
        symbol : stock.symbol,
        name : stock.name,
        price : stock.price,
        exchange : stock.exchange, 
        exchangeShortName : stock.exchangeShortName,
        type : stock.type
      };
    })
    )
    .then(stock => setRowdata(stock))
    console.log(rowdata)
  
}, []);

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
    <Toolbar>
      <h1>  Home{"\u00a0\u00a0"}</h1> < ShowChartIcon className='stock-head' />
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
            {rowdata
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
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
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5,10, 25, 100]}
        component="div"
        count={rowdata.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>

    {
      rowdata.map((data)=>{
        <p>
          {data.title}
        </p>
      }
      
      )
    }
    </>
  );
}




//import * as React from 'react';
// import { useStockRecord } from '../config/api';

// function getStockData(){
//   const url =  ``
// }

// export default function Home() {
//   const { loading, sympole, error } = useStockRecord();
//   if (loading)
//   {
//     return <p>loading...</p>;
    
//   }

//   return (
//     <div >
//       <h1>Home</h1>
//       {sympole.map((x) => (
//         <div>
//           <h1>{x.title}</h1>
//         </div>))}
//     </div>
//   );
// }

