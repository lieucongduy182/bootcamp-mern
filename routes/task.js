const express = require('express');
const router = express.Router();

const Task = require('../models/Task')
const verifyToken = require('../middleware/auth')

// @router GET /api/tasks
// @define

router.get('/', verifyToken, async (req, res) => {
    const { userId } = req.body
    try {
        const tasks = await Task.find({ user: userId }).populate('user', ['username'])
        res.status(200).json({ success: true, message: 'Happy Coding!', tasks })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
})

// @router POST /api/tasks
// @define

router.post('/', verifyToken, async (req, res) => {
    const { title, description, url, status, userId } = req.body;
    // Validation
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        // check exits
        const task = await Task.findOne({ title })
        if (task) {
            return res.status(400).json({ success: false, message: 'Task is existing' })
        }
        const newTask = new Task({
            title,
            description,
            url: url.startsWith('https://') ? url : `https://${url}`,
            status: status || 'TO LEARN',
            user: userId
        })

        await newTask.save();

        res.json({ success: true, message: 'Happy Coding!', task: newTask });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal Server error' });
    }
})

// @router PUT /api/tasks/:id
// @define

router.put('/:id', verifyToken, async (req, res) => {
    const { title, description, url, status, userId } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' })
    try {
        let updateTask = {
            title,
            description: description || '',
            url: (url.startsWith('https://') ? url : `https://${url}`) || '',
            status: status || 'TO LEARN',
        }

        updateCondition = { _id: req.params.id, userId }

        updateTask = await Task.findOneAndUpdate(updateCondition, updateTask, { new: true })
        if (!updateTask)
            return res.status(401).json({ success: false, message: 'Task not found or user not authorized' })
        res.json({ success: true, message: 'Happy Coding', task: updateTask })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

// @router DELETE /api/tasks/:id
// @define

router.delete('/:id', verifyToken, async (req, res) => {
    const { userId } = req.body
    try {
        const deleteCondition = { _id: req.params.id, userId }
        const deleteTask = await Task.findOneAndRemove(deleteCondition)

        if (!deleteTask)
            return res.status(401).json({ success: false, message: 'Task not found or user not authorized' })

        res.json({ success: true, message: 'Remove task successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports = router;