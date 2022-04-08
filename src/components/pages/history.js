import React, {useState, useEffect} from 'react';
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




export default function History() {

  const [rowdata, setRowdata] = useState([]); 
  const [demo, setDemo] = useState();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { id: 'date', label: 'Date', minWidth: 100 },
    { id: '1. open', label: 'Open', minWidth: 100 },
    { id: '2. high', label: 'High', minWidth: 100 },
    { id: '3. low', label: 'Low', minWidth: 100 },
    { id: '4. close', label: 'Close', minWidth: 100 },
    { id: '5. volume', label: 'Volume', minWidth: 100 },
  ];

   async function getdata() {
     let url="https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo"
    let res = await fetch(url);
    let data = await res.json();
     dayslist(data['Time Series (Daily)'],Object.values(data['Time Series (Daily)']) )
     setLoading(false)
     return data;
  }

   useEffect(() => {
     console.log("hello")
       getdata();
 }, []);


 
   function dayslist(json,value){
    let index;  
    let arr1 = [];
     for(index in json){
       let date = index.toString();
        arr1.push({date});
     }
     const results = arr1.map((ar, index) => 
     Object.assign({}, ar, value[index])
      )
      setRowdata(results)
 }

   if(loading){
     return <p>Loading...</p> 
   }
   
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
     </>
   );
 }
