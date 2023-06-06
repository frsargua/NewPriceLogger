import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, TableHead } from "@mui/material";
import { Link } from "react-router-dom";
import { SortedPhonesDataContext } from "../../context/SortedPhonesDataContext";
import { CompareContext } from "../../context/CompareContext";
import { TableColumn } from "../../types/generalTypes";
import { deletePhoneById } from "../../utils/URIs";
import axios from "axios";

export default function PhonesDataTable() {
  let { phones, fetchPhones, sortBy, getSortDirection } = React.useContext(
    SortedPhonesDataContext
  );
  let { removeFromList } = React.useContext(CompareContext);
  let { listOfIds } = React.useContext(CompareContext);
  let { fetchPrices } = React.useContext(CompareContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - phones.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  async function deletePhone(id: Number) {
    try {
      let response = await axios.delete(deletePhoneById(String(id)));

      if (response.status == 200) {
        fetchPhones();
      }
    } catch (error) {
      console.error("Error in POST request:", error);
      return;
    }
  }

  const tableColumn = [
    { label: "Brand", property: "BrandName" },
    { label: "Price", property: "ReleasePrice" },
  ] as TableColumn[];

  return (
    <TableContainer >
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "100px" }} align="center">
              date
            </TableCell>
            {tableColumn.map((el) => (
              <TableCell
                onClick={() => sortBy(el.property)}
                sx={{ width: "100px" }}
                align="center"
              >
                <span>
                  {el.label}
                  {getSortDirection(el.property)}
                </span>
              </TableCell>
            ))}

            <TableCell sx={{ width: "100px" }} align="center">
              Model
            </TableCell>

            <TableCell sx={{ width: "80px" }} align="center" />
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? phones.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : phones
          ).map((row, i) => (
            <TableRow key={i}>
              <TableCell align="center">{row.ReleaseDate.toString()}</TableCell>
              <TableCell align="center">
                <Link to={`/news/${row.BrandName}`}>{row.BrandName}</Link>
              </TableCell>
              <TableCell align="center">
                {row.ReleasePrice.toString()}
              </TableCell>
              <TableCell align="center">{row.Model}</TableCell>
              <TableCell
                align="center"
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-evenly",
                }}
              >
                <Button type="button" onClick={() => deletePhone(row.ID)}>
                  Delete
                </Button>
                <Button>
                  <Link to={`/update-phone/${row.ID}`}>Update</Link>
                </Button>
                <Button>
                  <Link to={`/prices/${row.Model}/${row.ID}`}>Stats</Link>
                </Button>
                <Button
                  onClick={() => {
                    listOfIds.includes(row.ID)
                      ? removeFromList(String(row.ID))
                      : fetchPrices(String(row.ID));
                  }}
                >
                  {listOfIds.includes(row.ID) ? "-" : "+"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={phones.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
