

const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]); 

require("dotenv").config();

// bring express in Node.js
const express = require("express");

// installing cors middleware
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./models/Task.js");
const User = require("./models/User.js");

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
        const title = (req.body.title || "").trim();
        const description = (req.body.description || "").trim();

        if (!title || !description) {
            return res.status(400).json({ message: "Please enter the details and do not add empty task." });
        }

        const newTask = new Task({
            ...req.body,
            title,
            description,
        });

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

app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name: username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT_SECRET is not configured." });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: "Login successful",
            token:token
        });

    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});

// start the server and listen to the configured port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
});