import React, { useEffect, useState } from 'react';
import { Button,Modal } from 'react-bootstrap';
import { useAuthContext } from '../Auth/AuthContext';
import { HiCheckCircle , HiXCircle } from 'react-icons/hi2';
import { useAsanaDeadlinesApi } from './useAsanaDeadlinesApi';
import styles from './AsanaDeadlines.module.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { AsanaDeadlineRows } from './AsanaDeadlineRows';
import { AddDeadlineForm } from './AddDeadlineForm';
import { EditDeadlineForm } from './EditDeadlineForm';
import { DeleteDeadline } from './DeleteDeadline';
import { ViewDeadlineDetails } from './ViewDeadlineDetails';

function getCurrentDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${month}-${date}`;
}

function findAttObjByGid(arrAtt, id) {
  return arrAtt.find((element) => {
    return element.taskgid === id;
  })
}

const dateConverter = (startDate, timeEnd) => {
  const newStartDate= new Date(startDate+" 00:00:00");
  const newEndDate=new Date(timeEnd+" 00:00:00");
  const one_day = 1000*60*60*24;
  let result
  result = Math.ceil((newEndDate.getTime()-newStartDate.getTime())/(one_day))
  return result
}

export function AsanaDeadlines() {

  const projectGid = import.meta.env.VITE_ASANA_PJID; //project Deadlines
  const asanaToken = import.meta.env.VITE_ASANA_TOKEN;

  const [tasksTableData, setTasksTableData] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [currentDeadlineID, setCurrentDeadlineID] = useState(null);
  const [currentDeadline, setCurrentDeadline] = useState(null);
  
  const [showVEA, setShowVEA] = useState(false);
  const [viewType, setViewType] = useState('view');
  const [currentDate] = useState(getCurrentDate());

  //const navigate = useNavigate();
  
  const handleShowV = (deadline) => { 
    setCurrentDeadline(deadline);
    setViewType('view');
    setShowVEA(true); 
  };
  const handleShowE = (id,deadline) => { 
    setCurrentDeadlineID(id);
    setCurrentDeadline(deadline);
    setViewType('edit');    
    setShowVEA(true); 
  };
  const handleShowA = () => { 
    setViewType('add'); 
    setShowVEA(true); 
  };  
  
  const handleShowD = (id) => {
    setCurrentDeadlineID(id);
    setViewType('delete');
    setShowVEA(true); 
  };

  const handleCloseVEA = (id) => { 
    if (id) {
      const tableData = filteredList.filter((task) => task.id !== id);
      setTasksTableData(tableData);
      setFilteredList(tableData);
    } 
    setShowVEA(false);
    if (viewType=='add' || viewType=='edit') location.reload();
 }

  const { data: deadLines, attachments, deleteDeadline, addDeadline, editDeadline } = useAsanaDeadlinesApi(projectGid, 0, 'opt_fields=name,assignee.name,due_on,html_notes,completed', 'opt_fields=download_url,permanent_url,size,name', asanaToken);
  const { user } = useAuthContext();

  useEffect(() => {
    let tasksTableDataToBeMapped = [];
    if (attachments) {
      tasksTableDataToBeMapped = deadLines.data?.map(
        (task) => ({id: task.gid, thumb: findAttObjByGid(attachments,task.gid)?.download_url, name: task.name, due_on: task.due_on, assignee: [task.assignee], completed: task.completed, html_notes: task.html_notes, days_remaining: dateConverter(currentDate,task.due_on)})
      );
      setTasksTableData(tasksTableDataToBeMapped);
      setFilteredList(tasksTableDataToBeMapped);
    }
  },[deadLines, attachments]
  );

  const onSuccessfulDelete = async (id) => {
    await deleteDeadline(id);
    handleCloseVEA(id);
  }

  const filterBySearch = (event) => {
    const query = event.target.value;
    var updatedList = [...tasksTableData];
    updatedList = updatedList.filter((item) => {
      return item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    setFilteredList(updatedList);
  };

  return (
    <>
    {!filteredList.length && <div className={styles.loaderContainer}><img width="100" src="./src/imgs/loader.gif" /></div>}
    {!!filteredList.length &&
    <div className="container ">
      <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded"> 
        <div className="row ">          
          <div className="col-sm-3 mt-5 mb-4 text-gred">
            <div className="search">
              <form className="form-inline">
                <input className="form-control mr-sm-2" type="search" placeholder="Search Deadline" onChange={filterBySearch} aria-label="Search"/>              
              </form>
            </div>    
            </div>  
            <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{color:"green"}}><h2><b>Deadlines</b></h2></div>
            <div className="col-sm-3 offset-sm-1  mt-5 mb-4 text-gred text-end">
            <Button variant="primary" onClick={handleShowA}>
              Add New Deadline
            </Button>
            </div>
          </div>  
          <div className="row">
              <div className="table-responsive " >
                <table className="table table-striped table-hover table-bordered">
                  <thead>
                      <tr>
                          <th className="text-center">#</th>
                          <th className="text-center">Name </th>
                          <th className="text-center">Due On</th>
                          <th className="text-center">Assignee </th>
                          <th className="text-center">Days left </th>
                          <th className="text-center">Completed</th>
                          <th className="text-center">Actions</th>
                      </tr>
                  </thead>
                  <tbody>

                  <AsanaDeadlineRows deadlines={filteredList} showViewModal={handleShowV} showEditModal={handleShowE} showDeleteModal={handleShowD}   />               

                  </tbody>
              </table>
          </div>   
      </div>  

      {/* <!--- Model Box ---> */}
      <div className="model_box">
        <Modal
          show={showVEA}
          onHide={handleCloseVEA}
          backdrop="static"
          keyboard={false}
          size={(viewType=='view') ? "lg" : "" }
        >
          <Modal.Header closeButton>
            <Modal.Title>{ (viewType=='view') ? 'View Deadline Details' : (viewType=='edit') ? 'Edit Deadline' : (viewType=='delete') ? 'Delete Deadline' : 'Add Deadline' }</Modal.Title>
          </Modal.Header>          

          {{

                edit: <EditDeadlineForm editDeadline={editDeadline} deadline={currentDeadline} handleCloseVEA={handleCloseVEA} asanaToken={asanaToken} />,
                add: <AddDeadlineForm addDeadline={addDeadline} handleCloseVEA={handleCloseVEA} asanaToken={asanaToken} />,
                view: <ViewDeadlineDetails deadline={currentDeadline} />,
                delete: <DeleteDeadline deadlineID={currentDeadlineID} onSuccessfulDelete={onSuccessfulDelete} closeDeleteModal={handleCloseVEA}  />
              }[viewType]}

              
          {(viewType!=='delete') && <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseVEA}>
              Close
            </Button>        
          </Modal.Footer>}           

        </Modal>
        {/* <!--- Model Box Finishes ---> */}
      </div>  
    </div>    
    </div>
    }
    </>
  );
  
};