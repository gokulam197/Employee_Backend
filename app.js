const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Task 1: initiate app and run server at 3000
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/dist/FrontEnd')));

// Task 2: create MongoDB connection
mongoose
  .connect('mongodb+srv://gokulmadhavan002:<db_password>@cluster0.cg1yj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Employee schema and model
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
});

const Employee = mongoose.model('Employee', employeeSchema);

// APIs

// TODO: get data from db using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching employee list', details: err.message });
  }
});

// TODO: get single data from db using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching employee data', details: err.message });
  }
});

// TODO: send data to db using api '/api/employeelist'
// Request body format: {name:'',location:'',position:'',salary:''}
app.post('/api/employeelist', async (req, res) => {
  try {
    const { name, location, position, salary } = req.body;
    const newEmployee = new Employee({ name, location, position, salary });
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    res.status(500).json({ error: 'Error adding employee', details: err.message });
  }
});

// TODO: delete an employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully', data: deletedEmployee });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting employee', details: err.message });
  }
});

// TODO: update an employee data from db by using api '/api/employeelist'
// Request body format: {name:'',location:'',position:'',salary:''}
app.put('/api/employeelist/:id', async (req, res) => {
  try {
    const { name, location, position, salary } = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, location, position, salary },
      { new: true }
    );
    if (!updatedEmployee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ error: 'Error updating employee', details: err.message });
  }
});

// ! don't delete this code. it connects the front end file.
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
