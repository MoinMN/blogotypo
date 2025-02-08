import mongoose from 'mongoose';

let isConnected = false;

const connectMongoDB = async () => {
  try {
    if (isConnected) {
      console.log('MongoDB Already Connected!');
    } else {
      mongoose.set('strictQuery', true);

      await mongoose.connect(process.env.MONGODB_URL, {
        dbName: 'blogotypo',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      isConnected = true;
      console.log('MongoDB Connected Succsessfully!');
    }
  } catch (error) {
    console.log('MongoDB Connection Failed!');
    console.log(error);
  }
}

export default connectMongoDB;