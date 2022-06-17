import React, {Component} from "react"; 
import axios from "axios";
import {useEffect, useState } from 'react';




let url = "http://localhost:8080/users"
function Fa(){
 
}
class HomeContainer   extends Component{
    
       // metodo ciclo devida
    // promesa then y atrapa
componentDidMout(){
     axios.get(url + "/14").then(result=>{
        console.log(result)
    }).catch(console.log)
}


// metodo render que debe retornar algo
render(){
        return(
            <h1>App de Andres Rodriguez</h1>
        )
    }
}

export default HomeContainer;