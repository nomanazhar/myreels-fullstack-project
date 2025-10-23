
import mongoose, {Schema , models} from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    username:string;
    email:string;
    password:string;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username:{ type: String, required:true },
        email:{ type: String, required:true, unique:true },
        password:{ type: String, required:true },
    }, { timestamps:true }

)
// Hash password before saving
UserSchema.pre('save', async function (next) {
    if(this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
})

const User = models?.User || mongoose.model<IUser>('User', UserSchema);

export default User;