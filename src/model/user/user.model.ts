import mongoose from "mongoose";
import UserInterface from "./user.interface";

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    salt: String,
    password: String,
});

const userModel = mongoose.model<UserInterface & mongoose.Document>('User', userSchema);

export default userModel;
