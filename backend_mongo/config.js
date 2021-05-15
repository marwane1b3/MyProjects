const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    console.log(`mongo connection : ${con.connection.host}`);
  } catch (error) {
    console.error(`error : ${error}`);
  }
};
module.exports = { connectDB };
