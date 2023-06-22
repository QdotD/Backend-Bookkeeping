import mongoose from 'mongoose';

const connectionString = 'mongodb+srv://qdotd:yPw2PqT608ix0gx4@cluster0.mymmezs.mongodb.net/test';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default mongoose;
