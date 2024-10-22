import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Container, IconButton } from '@mui/material'
import { useState, useEffect, useContext  } from 'react'
import { styled } from '@mui/material/styles'
import { useNavigate } from "react-router-dom"
import CustomCircleProgress from '../components/CustomCircleProgress.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { getReviews, deleteReview, editTitleReview } from '../actions/index.js'
import DeleteIcon from '@mui/icons-material/Delete'
import { useData } from '../context/index.jsx'
import EditIcon from '@mui/icons-material/Edit'
import ConfirmationDialog from '../components/ConfirmDialog.jsx'
import EditDialog from '../components/EditDialog.jsx'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext';
import { page_states } from '../utils/constants'

/**
 * Dashboard page
 * @returns 
 */
const Dashboard = () => {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const [editTitle, setEditTitle] = useState(null);
  const [editTitleReviewId, setEditTitleId] = useState(null);

  const { activateStep, setActivateStep, setReviewID, updateFormData } = useData();

  const navigate = useNavigate();

  const { user, signinRedirect } = useContext(AuthContext);
  const accessToken = user?.access_token;

  // Handle authentication state before rendering
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    signinRedirect();
  }

  const gotToNewPage = (path) => {
    updateFormData({
      reviewName: null,
      citations: null,
      eligibilityCriteria: null,
      levelOfAutomation: '',
    });
    setReviewID(null);
    setActivateStep(0);
    navigate(path);
  };

  useEffect(() => {
    if (!accessToken) {
      // Access token is not available yet
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Fetching reviews');
        const res = await getReviews(accessToken);
        const mappedRows = res.map(review => ({
          id: review.review_id,
          title: review.review_title,
          last_modified: new Date(review.last_modified),
          state: review.current_phase,
          progress: Math.min((review.current_phase / page_states.DONE) * 100, 100)  // For the case the current_phase is 7 or 8 (= LLM screening flags)
        }));
  

        setRows(mappedRows);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [accessToken]);

  const deleteAction = async () => {
    try {
      const res = await deleteReview(deleteId, accessToken);

      const updatedItem = rows.filter((item) => item.id !== deleteId);
      setRows(updatedItem);
      setOpenDialog(false);

      if (res.code === 200) {
        toast.success(res.message);
        setDeleteId(null);
      } else {
        toast.error(res.message);
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleTitleSubmit = async (title) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === editTitleReviewId ? { ...row, title: title } : row
      )
    )

    try {
      const res = await editTitleReview(editTitleReviewId, title)

      if (res.code === 200) {
        toast.success(res.message, {autoClose: 2000})
        setEditTitleId(null)
      } else {
        toast.error(res.message, {autoClose: 2000})
        setEditTitleId(null)
      }
    } catch (error) {
      console.error("error in sending, ", error)
    }

  }

  const handleOpen = (param, type) => {
    if (type === 'id') {
      setDeleteId(param)
      setOpenDialog(true)
    } else {
      setOpenEditDialog(true)
      setEditTitle(param.title)
      setEditTitleId(param.id)
    }
  }

  const handleClose = () => {
    if (openDialog === true) {
      setOpenDialog(false)
      setDeleteId(null)
    } else {
      setOpenEditDialog(false)
    }
  }

  const continueAction = (params) => {
    console.log("Params: ", params)
    const status = params.state

    // This should be replace with params.id
    setReviewID(params.id)
    console.log("Dashboard status: ", status)

//  if (status === page_states.STOPPED || status === page_states.SEARCH) {  // TODO Ponder/Ask,wich of those approaches?
 if (status === page_states.LLM_SCREENING_AUTOMATION_PAUSED) {  
      setActivateStep(page_states.SEARCH)

    } else if (status === page_states.LLM_SCREENING_AUTOMATION_SELECTION || page_states.LLM_SCREENING  || status === page_states.LLM_SCREENING_AUTOMATION_CONTINUED) {  // TODO add status === page_states.LLM_SCREENING_AUTOMATION_PAUSED if we use the upper case
      setActivateStep(page_states.LLM_SCREENING)

    } else if (status === page_states.MANUAL_SCREENING) {
      setActivateStep(page_states.MANUAL_SCREENING)

    } else if (status === page_states.DONE) {
      setActivateStep(page_states.DONE)
    }
    navigate('/dashboard/new-review', { state: { reviewID: params.id } });
  }


  const CustomBox = styled(Box)(({ state }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: (state === "LLM screening") || (state === "Manual screening") ? '#b57edc' : state === 'Done' ? '#8cff66' : '#ff4d4d',
    color: 'black',
    width: 'fit-content',
    padding: '0px 10px',
    textAlign: 'center',
    borderRadius: '10px',

  }))

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      resizable: false,
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center'
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
    },
    {
      field: 'edit',
      headerName: '',
      width: 5,
      resizable: false,
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
      renderCell: (params) => (
        <div>
          <IconButton
            color='primary'
            onClick={() => handleOpen(params.row, 'title')}
          >
            <EditIcon />
          </IconButton>
        </div>
      )
    },
    {
      field: 'last_modified',
      headerName: 'Last modification',
      width: 150,
      editable: false,
      resizable: false,
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
      type: 'date',
      valueGetter: (value) => new Date(value),
    },
    {
      field: 'state',
      headerName: 'State',
      width: 150,
      editable: false,
      resizable: false,
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
      valueGetter: (value) => {
        // if (value === page_states.STOPPED) {
        if (value === page_states.LLM_SCREENING_AUTOMATION_PAUSED) {
          return 'Stopped'
        } else if (value === page_states.SEARCH) {
          return 'Search Issued'
        } else if (value === page_states.LLM_SCREENING_AUTOMATION_SELECTION || value === page_states.LLM_SCREENING  || value === page_states.LLM_SCREENING_AUTOMATION_CONTINUED) {
          return 'LLM screening'
        } else if (value === page_states.MANUAL_SCREENING) {
          return 'Manual screening'
        } else if (value === page_states.DONE) {
          return 'Done'
        }
      },
      renderCell: (params) => (
        <CustomBox state={params.value} >
          {params.value}
        </CustomBox>
      )
    },
    {
      field: 'progress',
      headerName: 'Progress',
      sortable: true,
      width: 100,
      resizable: false,
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
      renderCell: (params) => {
        const value = params.value != null ? params.value : 0
        return <CustomCircleProgress value={value} />
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 100,
      resizable: false,
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
      renderCell: (params) => (
        <div>
          <IconButton
            color='primary'
            onClick={() => continueAction(params.row)}>
            <ArrowForwardIcon />
          </IconButton>

          <IconButton
            color='error'
            onClick={() => handleOpen(params.row.id, 'id')}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      )
    }
  ]

  return (
    <Container>
      <Box sx={{ width: 1040, marginTop: '100px' }}>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <Button onClick={() => gotToNewPage('/dashboard/new-review')} variant="contained" style={{ 'backgroundColor': 'rgb(59, 82, 187)' }}>Create new Review</Button>
        </Box>
        <DataGrid
          getRowHeight={() => 'auto'}
          rows={rows}
          columns={columns}
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
        <ConfirmationDialog
          open={openDialog}
          handleClose={handleClose}
          deleteAction={deleteAction}
        />
        <EditDialog
          open={openEditDialog}
          handleClose={handleClose}
          onSubmit={handleTitleSubmit}
          title={editTitle}
        />
      </Box>
    </Container>
  )
}

export default Dashboard
