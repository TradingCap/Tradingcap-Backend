const app = require('./src/app')
const connectDB = require('./src/DB/config/config');
require('dotenv').config()


const PORT = process.env.PORT || 1335;
  
app.listen(PORT, async () => {
    console.log(`app listening on assigned port`);
    await connectDB();
});