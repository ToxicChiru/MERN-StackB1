

const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]); 

require("dotenv").config();

// bring express in Node.js
const express = require("express");

// installing cors middleware
const cors = require("cors");

const Task = require("./models/Task.js");

// create express app using what we imported
const app = express();

const mongoose = require("mongoose");

// use cors middleware to handle requests
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URL || process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoUri) {
    console.error("Missing MongoDB connection string. Set MONGO_URL or MONGODB_URL in backend/.env");
    process.exit(1);
}

mongoose.connect(mongoUri)
.then(()=>{
    console.log("MongoDB Connected Successfully!");
}).catch((error)=>{
    console.log("MongoDB Connection Failed: ", error.message);
});;

app.get("/api/tasks", async (req, res) =>{
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
});

app.get("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found!" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Error fetching task", error });
    }
})

app.put("/api/tasks/:id", async (req, res)=>{
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).json({ message: "Task not found!" });
        }
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error });
    }
})

app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found!" });
        }
        res.json(deletedTask);
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error });
    }
});

app.post("/api/tasks", async (req, res)=>{
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error });
    }
})

// API Route (Testing Backend)
app.get("/", (req, res) => {
    res.send("Backend is Working!!")
});

// start the server and listen to port 5000
app.listen(5000, () => {
    console.log("Server is Running on port 5000");
});