require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./routes/auth')
const taskRouter = require('./routes/task')

// connect DB mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@bootcamp-mern.dvxoemk.mongodb.net/bootcamp-mern?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connect successfully !!!');
    } catch (error) {
        console.log('MongoDB connect failed', error);
        process.exit(1);
    }
}
connectDB();

const app = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter)
app.use('/api/tasks', taskRouter)

app.listen(port, function () {
    console.log(`Server start listening on http://localhost:${port}`)
})