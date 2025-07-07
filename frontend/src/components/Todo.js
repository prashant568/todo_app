import React from 'react'
import './Todo.css';
import { useState } from 'react';
import Swal from 'sweetalert2'
import { MdTask } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Dropdown from 'react-bootstrap/Dropdown';
import { useEffect } from 'react';
import { TiThList } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';

let Todo = () => {
  const navigate = useNavigate();
  let [task, setTask] = useState({ taskName: '', dueDate: '' });
  let [allTasks, setAllTasks] = useState(() => {
    const savedTasks = localStorage.getItem("allTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  let [ongoingTasks, setongoingTasks] = useState(() => {
    const saved = localStorage.getItem("ongoingTasks");
    return saved ? JSON.parse(saved) : [];
  });
  let [completedTasks, setcompletedTasks] = useState(() => {
    const saved = localStorage.getItem("completedTasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [modalShow, setModalShow] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Add these two states to control input fields in modal
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState('');
  const [deleteItem, setDeleteItem] = useState(() => {
    const saved = localStorage.getItem("deletedTasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [progress, setProgress] = useState(0);
  const [sortOption, setSortOption] = useState('');
  let [showDeleted, setShowDeleted] = useState(false);


  const [globalSearch, setGlobalSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);




  
  useEffect(() => {
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
  }, [allTasks]);

  useEffect(() => {
    localStorage.setItem('ongoingTasks', JSON.stringify(ongoingTasks));
  }, [ongoingTasks]);

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem('deletedTasks', JSON.stringify(deleteItem));
  }, [deleteItem]);

  const handleMoreInfoClick = (task) => {
    const user = JSON.parse(localStorage.getItem('Todo_login'));

    if (!user || !user.email) {
      // Not logged in — redirect to login page
      navigate('/login');
      return;
    }

    // Logged in — populate modal data and show it
    setSelectedTask(task);
    setNote(task.note || '');
    setPriority(task.priority || '');
    setProgress(task.progress || 0); // Ensure it's a number
    setModalShow(true);
  };


  let getTask = (e) => {
    e.preventDefault();

    if (task.taskName === '' || task.dueDate === '') {

      Swal.fire({
        title: "Please fill all fields",
        icon: "error",
        draggable: true
      });
    }
    else {
      setAllTasks([...allTasks, {
        ...task,
        time: new Date().toLocaleTimeString(), addDate: new Date().toDateString(), status: 'pending'
      }]);


      console.log(allTasks);
      setTask({ taskName: '', dueDate: '' });

    }
  }
  let add_OngoingTask = (task, index) => {
    console.log(task);
    // Remove the task from allTasks
    let copyAllTasks = [...allTasks];
    copyAllTasks.splice(index, 1);
    setAllTasks(copyAllTasks);
    Swal.fire({
      title: "added to ongoing tasks",
      icon: "success",
      draggable: true
    });
    task.status = 'ongoing';
    setongoingTasks([...ongoingTasks, task]);
  }
  let add_CompletedTask = (task, index) => {
    console.log(task);
    // Remove the task from allTasks
    let copyAllTasks = [...ongoingTasks];
    copyAllTasks.splice(index, 1);
    setongoingTasks(copyAllTasks);
    Swal.fire({
      title: "added to completed tasks",
      icon: "success",
      draggable: true
    });
    task.status = 'completed';
    setcompletedTasks([...completedTasks, task]);
  }
  const deleteitems = (task, index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        if (task.status === 'pending') {
          let updatedTasks = [...allTasks];
          updatedTasks.splice(index, 1);
          setAllTasks(updatedTasks);

        } else if (task.status === 'ongoing') {
          let updatedTasks = [...ongoingTasks];
          updatedTasks.splice(index, 1);
          setongoingTasks(updatedTasks);

        } else if (task.status === 'completed') {
          let updatedTasks = [...completedTasks];
          updatedTasks.splice(index, 1);
          setcompletedTasks(updatedTasks);

        }
        setDeleteItem([...deleteItem, task]);
        console.log(deleteItem);
      }
    });
  };

  const getDaysLeft = (dueDate) => {
    const due = new Date(dueDate);
    due.setHours(23, 59, 59, 999); // 👈 Set time to end of day
    const now = new Date();
    const diff = due - now;

    if (diff <= 0) return 'Overdue';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m left`;
  };

  const getPriorityValue = (priority) => {
    if (priority === 'High') return 3;
    if (priority === 'Medium') return 2;
    if (priority === 'Low') return 1;
    return 0;
  };

  const sortTasks = (tasks) => {
    console.log("ee", tasks, sortOption);
    let sorted = [...tasks];

    switch (sortOption) {
      case 'date':
        return sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      case 'name':
        return sorted.sort((a, b) => a.taskName.localeCompare(b.taskName));
      case 'time':
        return sorted.sort((a, b) => new Date(a.time) - new Date(b.time));
      case 'priority':
        return sorted.sort((a, b) => getPriorityValue(b.priority) - getPriorityValue(a.priority));
      default:
        return tasks;
    }
  };

  const handleGlobalSearch = (query) => {
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const allCombinedTasks = [...allTasks, ...ongoingTasks, ...completedTasks];

    const filtered = allCombinedTasks.filter(task =>
      task.taskName.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filtered);
    setShowSearchResults(true);
  };



  return <>
    <div className='main-div '>

      <div className='  left' >
        <form className="flex gap-3 pt-3 flex-wrap mb-6 d-flex justify-content-center" style={{ 'background-color': '#f8f9fa', 'padding': '20px ', 'border-radius': '10px' }}>
          <input
            type="text"
            placeholder="Task name"
            className="p-2 border rounded w-48"
            onChange={(e) => setTask({ ...task, taskName: e.target.value })}
            value={task.taskName}
          />
          <input
            type="date"
            className="p-2 ms-2 border rounded"
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            value={task.dueDate}
          />
          <button
            type="submit"
            className="bg-success ms-2 text-white text-center px-4 py-2 rounded hover:bg-blue-700"
            onClick={getTask}
          >
            Add Task
          </button>
        </form>

        <br></br>

        <div className="flex  gap-3 flex-wrap mb-6" style={{ 'background-color': '#f8f9fa', 'padding': '20px ', 'border-radius': '10px' }}>
          <input
            type="text"
            placeholder="Search Task"
            className="p-2 border rounded w-48"

            value={globalSearch}
            onChange={(e) => {
              const value = e.target.value;
              setGlobalSearch(value);
              handleGlobalSearch(value);
            }}
          />

          <button
            type="submit"
            className="bg-success ms-2 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleGlobalSearch}
          >
            Search Task
          </button>
          {showSearchResults && (
            <div>

              <h5>Search Results:</h5>


              <button
                className="btn btn-sm btn-danger mb-3"
                onClick={() => {
                  setGlobalSearch('');
                  setShowSearchResults(false);
                  setSearchResults([]);
                }}
              >
                Clear Search
              </button>


              {searchResults.length > 0 ? (
                searchResults.map((task, index) => (
                  <div key={index} className="task-item p-2 m-2 bg-white rounded shadow">
                    <h6>{task.taskName}</h6>
                    <p className={`${task.status === 'pending'
                        ? 'text-danger'
                        : task.status === 'ongoing'
                          ? 'text-warning'
                          : 'text-success'
                      }`}><b className='text-black'>Status:</b> {task.status}</p>
                    <p><b>Due:</b> {task.dueDate}</p>
                  </div>
                ))
              ) : (
                <p>No matching tasks found.</p>
              )}
            </div>
          )}

        </div>

        <div className='pt-3'>

          <div className='d-flex justify-content-around align-items-center flex-wrap'>
            <span className='fw-700'>click to show deleted</span>
            <Button onClick={() => setShowDeleted(!showDeleted)} className="bg-success ms-2 text-white px-4 py-2 rounded hover:bg-blue-700">
              {showDeleted ? 'Hide Deleted Tasks' : 'Show Deleted Tasks'}
            </Button>
          </div>
          <div className='del-items'> {console.log("ddd", deleteItem)}
            {showDeleted && (
              deleteItem.length > 0 ? (
                deleteItem.map((task, index) => (
                  <div key={index} className='task-item p-2 m-2 bg-white rounded shadow allTask-item'>
                    <div className='d-flex justify-content-between'>
                      <h4 className='font-semibold'><MdTask /> {task.taskName}</h4>
                    </div>
                    <p className='text-gray-600'><b>Due Date:</b> {task.dueDate}</p>
                    <p className='text-gray-500'><b>Added at:</b> {task.addDate}</p>
                    <p className='text-gray-500'>
                      <b>Status:</b> <span className='text-danger fw-semibold'>{task.status}</span>
                    </p>
                  </div>
                ))
              ) : (
                <div>No deleted items</div>
              )
            )}

          </div>

        </div>


      </div>


      <div className='right pb-5 pt-3  bg-gray' style={{ width: '100%', height: '100vh', backgroundColor: '#deebf6', overflowY: 'scroll' }}>

        <div className='allTask'>
          <div className='d-flex justify-content-around'>  <h3 className='text-center text-xl font-bold'>All Tasks</h3> <span >



          </span></div>
          {
            sortTasks(allTasks.filter(task =>
              task.taskName.toLowerCase().includes(globalSearch.toLowerCase())
            )).map((task, index) => {
              return <div key={index} className='task-item p-2 m-2 bg-white rounded shadow  allTask-item'>
                <div className='d-flex justify-content-between'>  <h4 className='font-semibold'><MdTask />  {task.taskName}</h4> <span> <h3 style={{ cursor: 'pointer' }} onClick={() => { deleteitems(task, index) }}><MdDelete /></h3>
                </span></div>
                <p className='text-gray-600'><b>Due Date:</b> {task.dueDate}</p>
                <p className='text-gray-500'><b> Added at:</b> {task.addDate}</p>
                <p className='text-gray-500'><b>Status:</b> <span className='text-danger fw-semibold'>{task.status}</span></p>
                <p>
                  <b>Time Left:</b>{' '}
                  <span className={getDaysLeft(task.dueDate) === 'Overdue' ? 'text-danger' : 'text-success'}>
                    {getDaysLeft(task.dueDate)}
                  </span>
                </p>
                <button className='btn btn-warning me-2' onClick={() => { add_OngoingTask(task, index) }}>set as Ongoing</button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedTask(task);
                    setNote(task.note || '');
                    setPriority(task.priority || '');
                    setProgress(task.progress || 0);
                    setModalShow(true);
                  }}
                >
                  More info
                </Button>

              </div>
            })
          }
        </div>
        <div className='ongoingTask'>
          <div className='d-flex justify-content-around'>  <h3 className='text-center text-xl font-bold'>Ongoing Task</h3> <span >



          </span></div>

          {
            sortTasks(ongoingTasks.filter(task =>
              task.taskName.toLowerCase().includes(globalSearch.toLowerCase())
            )).map((task, index) => {
              return <div key={index} className='task-item p-2 m-2 bg-white rounded shadow  ongoingTasks-item'>
                <div className='d-flex justify-content-between'>  <h4 className='font-semibold'><MdTask />  {task.taskName}</h4> <span> <h3 style={{ cursor: 'pointer' }} onClick={() => { deleteitems(task, index) }}><MdDelete /></h3>
                </span></div>
                <p className='text-gray-600'><b>Due Date:</b> {task.dueDate}</p>
                <p className='text-gray-500'><b> Added at:</b> {task.addDate}</p>
                <p className='text-gray-500'><b>Status:</b> <span className='text-warning fw-semibold'>{task.status}</span></p>
                <p>
                  <b>Time Left:</b>{' '}
                  <span className={getDaysLeft(task.dueDate) === 'Overdue' ? 'text-danger' : 'text-success'}>
                    {getDaysLeft(task.dueDate)}
                  </span>
                </p>
                <ProgressBar className='mb-2' variant={
                  task.progress < 30
                    ? 'danger'
                    : task.progress < 70
                      ? 'warning'
                      : task.progress == undefined ? 'danger' : 'success'
                } now={task.progress} label={`${task.progress ? task.progress : 0}%`} />


                <button className='btn btn-success me-2' onClick={() => { add_CompletedTask(task, index) }}>set as Completed</button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedTask(task);
                    setNote(task.note || '');
                    setPriority(task.priority || '');
                    setProgress(task.progress || 0);
                    setModalShow(true);
                  }}
                >
                  More info
                </Button>
              </div>

            })
          }

        </div>
        <div className='completedTask'>
          <div className='d-flex justify-content-around'>  <h3 className='text-center text-xl font-bold'>completed Task</h3> <span >  <Dropdown>
            <Dropdown.Toggle variant="none" id="dropdown-basic" >
              <TiThList />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSortOption('date')}>Sort by Due date</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortOption('name')}>Sort by name</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortOption('time')}>Sort by added time</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortOption('priority')}>Sort by Priority</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortOption('')}>Reset</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>


          </span></div>
          {
            sortTasks(completedTasks.filter(task =>
              task.taskName.toLowerCase().includes(globalSearch.toLowerCase())
            )).map((task, index) => {
              return <div key={index} className='task-item p-2 m-2 bg-white rounded shadow  completedTasks-item'>
                <div className='d-flex justify-content-between'>  <h4 className='font-semibold'><MdTask />  {task.taskName}</h4> <span> <h3 style={{ cursor: 'pointer' }} onClick={() => { deleteitems(task, index) }}><MdDelete /></h3>
                </span></div>
                <p className='text-gray-600'><b>Due Date:</b> {task.dueDate}</p>
                <p className='text-gray-500'><b> Added at:</b> {task.addDate}</p>
                <p className='text-gray-500'><b>Status:</b> <span className='text-success fw-semibold'>{task.status}</span></p>
                <button className='btn btn-info me-2' >Task Completed</button>
              </div>
            })
          }
        </div>

      </div>
    </div>
    <Modal
      show={modalShow} onHide={() => setModalShow(false)}


      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {selectedTask ? selectedTask.taskName : ''}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedTask && (
          <>
            <p><strong>Task:</strong> {selectedTask.taskName}</p>
            <p className={`${selectedTask.status == 'pending' ? 'text-danger' : 'text-warning'}`}><strong className='text-black' >Status:</strong> {selectedTask.status}</p>
            <p><strong>Due Date:</strong> {selectedTask.dueDate}</p>
            <p><strong>Added On:</strong> {selectedTask.addDate}</p>

            <div className="mb-3">
              <label><strong>Note:</strong></label>
              <textarea
                className="form-control"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter a note"
              />
            </div>

           
            <div className="mb-3">
              <label><strong>Priority:</strong></label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">Select Priority</option>
                <option value="High">High 🔴</option>
                <option value="Medium">Medium 🟠</option>
                <option value="Low">Low 🟢</option>
              </select>
            </div>
            {/* Progress Bar */}
            <div className="mb-3">
              <input placeholder='Enter progress percentage' value={progress}
                onChange={(e) => setProgress(e.target.value)}></input>
              <label><strong>Progress:</strong></label>
              <ProgressBar variant={selectedTask.status === 'pending' ? 'danger' : 'warning'} now={progress} label={`${progress}%`} />
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            Swal.fire({
              title: "Do you want to save the changes?",
              showDenyButton: true,
              showCancelButton: true,
              confirmButtonText: "Save",
              denyButtonText: `Don't save`
            }).then((result) => {
            
              if (result.isConfirmed) {

                const updatedTask = { ...selectedTask, note, priority, progress };

            
                const updateList = (list, setter) => {
                  const index = list.findIndex(t => t.taskName === selectedTask.taskName && t.dueDate === selectedTask.dueDate);
                  if (index !== -1) {
                    const copy = [...list];
                    copy[index] = updatedTask;
                    setter(copy);
                  }
                };


                updateList(allTasks, setAllTasks);
                updateList(ongoingTasks, setongoingTasks);
                updateList(completedTasks, setcompletedTasks);

                setModalShow(false);

                Swal.fire("Saved!", "", "success");
              } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
              }
            });

          }}
        >
          Save
        </Button>

        <Button variant="secondary" onClick={() => setModalShow(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}

export default Todo;