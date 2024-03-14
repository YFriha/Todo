import './App.css';
import React, { Component } from 'react';
import Modal from './components/Modal';
import axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      viewCompleted: false,
      // taskList: tasks,
      activeItem:{
        title:"",
        description:"",
        completed: false
      },
      todoList: []
    };
  }

componentDidMount(){
  this.refreshList();
}
refreshList=() => {
  axios
  .get("http://localhost:8000/api/tasks/")
  .then(res => this.setState({todoList:res.data}))
  .catch(err=>console.log(err))
};

  toggle= () => {
    this.setState({
      modal:!this.state.modal
    })
  };
  handleSubmit = item =>{
    this.toggle();
    // alert('saved!'+JSON.stringify(item));
    if (item.id){
      axios.put(`http://localhost:8000/api/tasks/${item.id}/`,item)
      .then(res=>this.refreshList())
    }
    axios
    .put("http://localhost:8000/api/tasks/",item)
      .then(res=>this.refreshList())
  }
  handleDelete= item =>{
    // this.toggle();
    // alert('Deleted!'+JSON.stringify(item));
    if (item.id){
      axios.put(`http://localhost:8000/api/tasks/${item.id}/`)
      .then(res=>this.refreshList())
  }}
  createItem =()=>{
    const item = {title :"", modal:!this.state.modal};
    this.setState({activeItem: item, modal:!this.state.modal})
  };
editItem = item =>{
  this.setState({activeItem: item, modal: !this.state.modal})
};
  displayCompleted (status){
    return this.setState({viewCompleted:status});
  };

  renderTbList = () => {
    return (
      <div className='my-5 tab-list'>
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          completed
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          Incompleted
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      item => item.completed === viewCompleted
    );

    return newItems.map(item => (
      <li key={item.id}
        className='list-group-item d-flex justify-content-between align-items-center'>
        <span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`}>
          {item.title}
        </span>
        <span>
          <button className='btn btn-info mr-2'>Edit</button>
          <button className='btn btn-danger mr-2'>Delete</button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className='content p-3 mb-2 bg-info'>
        <h1 className='text-white text-uppercase text-center my-4'>Task Manager</h1>
        <div className='row'>
          <div className='col-md-6 col-sm-10 mx-auto p-0'>
            <div>
              <button className='btn btn-warning'>Add Task</button>
            </div>
            {this.renderTbList()}
            <ul className='list-group list-group-flush'>
              {this.renderItems()}
            </ul>
          </div>
        </div>
        <footer className='my-3 mb-2 bg-info text-white text-center'>Made with <span className="heart">♥</span> by FRIHA, Copyright 2024 &copy; All rights reserved</footer>
        {this.state.modal?(
          <modal activeItem={this.state.activeItem} toggle={this.toggle}
          onSave={
            this.handleSubmit
          }/>
        ): null}
      </main>
    );
  }
}

export default App;
