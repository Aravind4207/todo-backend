//express  
const express = require('express');
const mongoose = require ('mongoose'); 
const cors = require('cors');

//create an istance of express
const app = express();
app.use (express.json());
app.use(cors()); 

//sample in-memory storage for todo items
//let todos = [];

 //connect to mongoose
 mongoose.connect('mongodb://localhost:27017/todo-app')
    .then(() => {
        console.log('connected to mongodb');
    })
    .catch((error) => {
        console.error('error connecting to mongodb:', error);
    })

//create an mongoose schema
const todoSchema = new mongoose.Schema({
    title: {
        required : true,
        type : String
    },
    description: {
        required : true,
        type : String
    }
});

//create a mongoose model
const todoModel = mongoose.model('todo' , todoSchema);

//create a new todo item
app.post('/todos',async (req ,res )=>{
    const {title , description} =req.body; 
    // const newtodo ={
    //     id:todos.length +1,
    //     title,
    //     description
    // };
    // todos.push(newtodo);
    // console.log(todos);
    try {
        const newtodo = new todoModel({title , description})
        await newtodo.save();
        res.status(201).json(newtodo);
    } catch (error){
        console.log(error)
        res.status(500).json({message : 'internal server error'});
    }
    


})
//get api item
app.get('/todos' ,async (req ,res ) => {
    try{
       const todos = await todoModel.find();
       res.json(todos);
    }catch (error){
        console.log(error)
        res.status(500).json({message : 'internal server error'});
    }
    
})

// update a todo item 
app.put('/todos/:id' ,async (req , res ) => {
    try{
        const {title , description} = req.body;
        const id = req.params.id;
        const updateTodo = await  todoModel.findByIdAndUpdate(
            id,
            {title , description},
            {new : true}
        )
        if(!updateTodo){
            return res.status(404).json({message : 'todo not found'});
        }
        res.json(updateTodo);
    }catch (error){
        console.log(error);
        res.status(500).json({message : 'internal server error'});
    }
})
//delete a todo item
app.delete('/todos/:id' , async (req , res ) => {
    try{
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }catch(error){
        console.log(error);
        res.status(500).json({message : 'internal server error'});
    }
}) 

//start the server
const port = 8000;
app.listen(port ,() => {
    console.log ('server is listening on the port'+port);
})