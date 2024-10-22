import { DataGrid } from '@mui/x-data-grid'
import { Container, Typography, Box } from '@mui/material'

/**
 * Table with all classified papers on result page
 * @param {array} citations
 * @returns 
 */
const ListCitations = ({ citations }) => {
  const columns = [
    {
      field: 'paper_id',
      headerName: 'ID',
      width: 40,
      resizable: false,
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center'
    },
    {
      field: 'manual_tag',
      headerName: 'Tag',
      width: 70,
      resizable: false,
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
      valueGetter: (value) => {
        if (value === 0) {
          return 'Exclude'
        } else if (value === 1) {
          return 'Include'
        }
      }
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 400,
      editable: false,
      resizable: false,
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
    }, {
      field: 'authors',
      headerName: 'Authors',
      width: 350,
      editable: false,
      resizable: false,
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
    },
    {
      field: 'exclusion_reason',
      headerName: 'Exclusion reason',
      width: 200,
      editable: false,
      resizable: false,
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
    }, {
      field: 'screener',
      headerName: 'Screener',
      width: 150,
      editable: false,
      resizable: false,
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
    }
  ]

  return (
    <Container>
      <Typography variant='h5' sx={{ fontWeight: 500, textAlign: 'justify', marginTop: '30px' }}>List of citations:</Typography>
      <Box sx={{ width: 1250, marginTop: '20px' }}>
        <DataGrid
          rows={citations}
          columns={columns}
          getRowId={(row) => row.paper_id}
          getRowHeight={() => 'auto'}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={
            [5, 10, 20, 30, 40, 50]}
          disableRowSelectionOnClick
        />
      </Box>
    </Container>
  )
}


export default ListCitations