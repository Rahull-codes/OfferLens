const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app.js');
const connectDB = require('./src/config/database');

const port = process.env.PORT||3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

connectDB();

