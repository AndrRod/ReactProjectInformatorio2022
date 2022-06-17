import './App.css';
import axios from 'axios';
import React from 'react';
import { Component, useEffect, useState } from 'react';
// mejor forma es la importación más que agregar el script 
import 'bootstrap/dist/css/bootstrap.min.css';
//fontawesone
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
// reactstrap
import { Modal, ModalBody, ModalHeader, ModalFooter, Table, Form, Button} from 'reactstrap';
import { text } from '@fortawesome/fontawesome-svg-core';
import moment from "moment"; 

function App() {

  let url = "http://localhost:8080/users"
  let urlAuth = "http://localhost:8080/auth"

  const [userList, setUserList] = useState([]);   
  const [tableUsers, setTableUsers] = useState([]);
  const [nextPath, setNextPath] = useState([]);
  const [prevPath, setPrevPath] = useState([]);

  const [modalDelete, setModalDelete] = useState(false);
  const [modalAddUser, setModalAddUser] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalCreate, setModalCreate] = useState(false)
  //  Busquedas ------------------------------ start:
  const [search, setSearch] = useState("");
  const [texto, setTexto] = useState({
    name: null
  });
  const handleChangeText = (e) => {
    setTexto({
      ...texto,
      [e.target.name]: e.target.value})
  }   

  const requestGetByUserName= async () =>{   
    let newText = texto;
    
    console.log(newText)    
    await axios.post(url + "/byname/0", newText)    
   .then(response=>{      
    console.log(response)
     setTableUsers(response.data);
     setUserList(response.data);       
   }).catch(error=>{
     console.log(error)   
   }); 
 }



let date = new Date();
const [dates, setDates] = useState({
  startDate: "01-01-2017",
  finishDate: moment(new Date()).format("DD-MM-YYYY") 
})

const handleChangeDate = (e) => {
  setDates({
    ...dates,
    [e.target.name]: moment(new Date(e.target.value)).format("DD-MM-YYYY")
  })
}
 const requestGetByDatesBetween= ()=>{       
  let newDates = dates;
  console.log(newDates.startDate)
  console.log(newDates.finishDate)
   axios.post(url + "/bydates/0", newDates)
  .then(response=>{      
    console.log(response.data)
    setTableUsers(response.data);
    setUserList(response.data);           
  }).catch(error=>{
    console.log(error)     
  });   
}

//  Busquedas ------------------------------ end:

  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password:""
  });
  const handleChangeUser = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value})
  }  

  const updateModalEdit= (param)=>{
    if(modalEdit===false){ 
      setTimeout(async function(){
        setModalEdit(true);
      }, 300)
    }else{
      setModalEdit(false)
      
    }
  }

  const modifModalDelete= ()=>{    
    if(modalDelete===false){
      setModalDelete(true)
    }else{
      setModalDelete(false)
    
    }
  }

  const modifModalAdd= ()=>{    
    if(modalAddUser===false){
      setModalAddUser(true)
    }else{
      setModalAddUser(false)
      }
  }
  const modifModalCreate= ()=>{
    if(modalCreate){setModalCreate(true)}
    else{setModalCreate(false)}
  }
  const requestPost = async () => {      
    const newUser = user;
    await axios.post(urlAuth + "/register", newUser)
    .then(response=>{
      console.log(response);
      modifModalAdd()
      requestGet();        
    });        
  };

  const requestPut = async (id, user)=>{
    const newUser = user;
    await axios.put(url + "/" + id, newUser).then(response=>{
      console.log(response.data);
      requestGet();
    })    
  }

   
  const reguestGetById = (id)=>{
    axios.get(url + "/" + id)
    .then(response=>{   
      console.log(response.data)         
      setUser(response.data)              
    }).catch(error=>{
      console.log(error)
    })
  }
  
 const requestDeleteById = (id) => {
  axios.delete(url + "/" + id)
    .then(response=>{
    console.log(response.data);      
    modifModalDelete()    
    requestGet(); 
  }).catch (error =>{
  console.log(error);
})
};

const requestGet= async (page)=>{      
  // console.log(axios.defaults.headers.common.Authorization)
  // console.log(localStorage.getItem('userToken'))
  await axios.get(page? page: url+"?page=0")
  .then(response=>{
    setPrevPath(response.data.prevPath? url + response.data.prevPath: null);
    setNextPath(response.data.nextPath? url + response.data.nextPath: url + "?page=0");      
    setUserList(response.data.content);
    setTableUsers(response.data.content);       
  }).catch(error=>{
    console.log(error)
  })
}

  useEffect(()=>{
    requestGet()    
  },[]);  

  const getLastArrItem = (arr) => { 
    let lastItem=arr[arr.length-1];  
    return lastItem; 
  }           
  
  let users = userList.map(m=>{return m.id})  
  const lastId = () => { return getLastArrItem(users)};  

 
  
  // .....................................................
  const [token, setToken] = useState("") 
  const updateToken = (t) => {
    setToken(t)
  }
  const [bodyParameters, setBodyParameters] = useState({
     email: "",
     password: ""
  });
  
  const handleChangeBodyParameters = (e) => {
    setBodyParameters({
      ...bodyParameters,
      [e.target.name]: e.target.value})
  }   
  // .....................................................
   
  const requestLogin = () => {
    const body = bodyParameters;
   axios.post(urlAuth  + "/login", body)
   .then(response=>{
    console.log(response.data.accessToken)
    localStorage.setItem("userToken", JSON.stringify(response.data.accessToken));
    setAuthToken("Bearer "+ JSON.parse(localStorage.getItem("userToken")))    
    requestGet(); 
  })}
    // .....................................................
    function setAuthToken(token) {
      axios.defaults.headers.common['Authorization'] = '';
      delete axios.defaults.headers.common['Authorization'];    
      if (token) {
        axios.defaults.headers.common['Authorization'] = `${token}`;
      }
    } 
      
      return (
        
        <div className="App"> 
    
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
              <a className="navbar-brand" href="#">INFORMATORIO JAVA</a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" 
                      data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
                      aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>    
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item active">
                    <a className="nav-link" href="#">USUARIO</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#"> EMPRENDIMIENTO</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#"> EVENTO</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#"> VOTO</a>
                  </li>                       
                </ul>           
                  <input className='form-control' type="text" name="name" id="name"  onChange={(e)=>handleChangeText(e)} placeholder="Search by firstname and lastname"/>
                  <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={()=>{texto.name? requestGetByUserName(): requestGetByDatesBetween();}}><FontAwesomeIcon icon={faSearch}/></button>          
                 
           
                  <div class="tp-3 mb-2 bg-primary text-white">Start:
                    <label htmlFor='startDate'></label>            
                      <input type="date" name="startDate" id="startDate"  min="2017-01-01" onChange={(e) => handleChangeDate(e)}/>
                  </div>             
                  <div class="tp-1 mb-2 bg-primary text-white">End:
                      <label htmlFor='finishDate'></label>
                        <input type="date" name="finishDate" id="finishDate" min="2017-01-01" onChange={(e) => handleChangeDate(e)}/>
                  </div> 
      
              </div>
         
          </nav>
    
    
             <br></br>   
                <button className='btn btn-success' onClick={()=>modifModalAdd()}>Agregar usuario</button>
               <br></br>    
    
    <Table>
    <div className='form-group'> 
      
             <label htmlFor="email">Email</label>
             <input className='form-control' type="text" name="email" id="email"    onChange={(e)=>handleChangeBodyParameters(e)}/>
             <br/>   
             </div>   
           
              <div>
                <label htmlFor="password">password</label>
                <input className='form-control' type="password" name="password" id="password"    onChange={(e)=>handleChangeBodyParameters(e)} />
              </div>
          
             <br/>      
          <button className='btn btn-success' onClick={()=>{requestLogin()}}>Login </button> 
           <button className='btn btn-danger'onClick={()=>{modifModalCreate()}}>Register</button>
    </Table>
    
      <header className="App-header">
  <Table striped bordered hover className='Table-List'>
    {userList.length?
      <thead>      
        <tr>                     
          <th>Fisrt and last name</th>            
          <th>Email</th>
          <th>Role</th> 
          <th>Date</th>
          <th>Config</th>
        </tr>
      </thead>      
      : ""}
      <tbody>
         
        {userList && userList.map(usuario=>{         
          
          
          return(            
            <tr key={usuario.id}>
            <td>{usuario.firstName} {usuario.lastName}</td>
            <td>{usuario.email}</td>
            <td>{usuario.role}</td>           
            <td>{usuario.creationDate}</td>   
            <td>
              <button className='btn btn-primary' onClick={()=>{reguestGetById(usuario.id); updateModalEdit();}}><FontAwesomeIcon icon={faEdit} /></button>
              {" "}
              <button className="btn btn-danger" onClick={()=>{reguestGetById(usuario.id); modifModalDelete();}}><FontAwesomeIcon icon={faTrashAlt} /></button>    
            </td>   
          </tr>        
        )}
        )}
        
        </tbody>
        {userList.length?
        <footer>
        {prevPath==null?
        <button className='btn btn-primary' onClick={()=>{requestGet(prevPath);}} disabled>Previous</button>    
        :<button className='btn btn-primary' onClick={()=>{requestGet(prevPath);}}>Previous</button>    
        }
   
        {nextPath===prevPath?      
      <button className='btn btn-primary' onClick={()=>{requestGet(nextPath);}} disabled> Came back</button>      
        :<button className='btn btn-primary' onClick={()=>{requestGet(nextPath);}}>Next</button>
        }
        </footer>
        :""}
      
        
              
    </Table>  


    
    <Modal isOpen={modalAddUser || modalEdit || modalCreate}>
     <ModalHeader style={{display: 'float'}}>
       <button className='btn btn-outline-primary  ' style={{float: 'right'}} onClick={()=>{modalEdit? updateModalEdit() :modifModalAdd()}}>x
         </button>
     </ModalHeader>
     <ModalBody>      
       <div className='form-group'>
         <br/>
         <label htmlFor="id">Id</label>
         <input className='form-control' type="text" name="id" id="id"  defaultValue={modalEdit? user.id :lastId()+1} readOnly/>
         <br/> 
         <label htmlFor="firstName">FirstName</label>
         <input className='form-control' type="text" name="firstName" id="firstName"   defaultValue={modalEdit? user.firstName : ""} onChange={(e)=>handleChangeUser(e)}/>
         <br/>
         <label htmlFor="lastName">LastName</label>
         <input className='form-control' type="text" name="lastName" id="lastName"  defaultValue={modalEdit? user.lastName : ""} onChange={(e)=>handleChangeUser(e)} />
         <br/>
         <label htmlFor="email">Email</label>
         <input className='form-control' type="text" name="email" id="email"   defaultValue={modalEdit? user.email : ""}  onChange={(e)=>handleChangeUser(e)}/>
         <br/>   
         </div>
         {modalEdit?          
         <div>
         <label>Role</label>
          <select htmlFor="role" name="role" id="role" className="form-select" defaultValue={modalEdit? user.role : ""} onChange={(e)=>handleChangeUser(e)} >
              <option >Choice an option</option>
              <option  value="OWNER">OWNER</option>
              <option value="USER">USER</option>
              <option  value="COLLABORATOR">COLLABORATOR</option>
            </select>
         </div>
        : <div>
            <label htmlFor="password">password</label>
            <input className='form-control' type="password" name="password" id="password"   defaultValue={modalEdit? user.password : ""} onChange={(e)=>handleChangeUser(e)} />
          </div>
        }
         <br/>  
     </ModalBody>
     <ModalFooter>
       {modalEdit?          
      <button className='btn btn-success' onClick={()=>{requestPut (user.id, user); modalEdit? updateModalEdit() :modifModalAdd()}}>Actualizar</button>:
       <button className='btn btn-primary' onClick={()=>{requestPost(); modalEdit? updateModalEdit() :modifModalAdd()}}>Insertar</button>          
      }
       <button className='btn btn-danger' onClick={()=>{modalEdit? updateModalEdit() :modifModalAdd()}}>Cancelar</button>
        
     </ModalFooter>
   </Modal>
   <Modal isOpen={modalDelete}>       
     {/* devolverEstadoEliminar() */}
       <ModalBody>
             <p>¿Estas seguro que quieres eliminar el usuario {user.email}?</p>
              
           </ModalBody><ModalFooter>
               <button className="btn btn-danger" onClick={() =>{requestDeleteById(user.id);}}>Si</button>
               <button className="btn btn-primary" onClick={() => {modifModalDelete();}}>No</button>
            </ModalFooter>
     </Modal>
        

      </header>
    </div>
  );
}

export default App;
