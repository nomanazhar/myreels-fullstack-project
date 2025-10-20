import mongoose ,{Schema,models} from "mongoose";

export interface IFavorite extends Document {
    userId:mongoose.Types.ObjectId;
    videoId:mongoose.Types.ObjectId;
    createdAt?: Date;
}

const FavoriteSchema = new Schema<IFavorite>({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
    videoId:{ type: mongoose.Schema.Types.ObjectId, ref:'Video', required:true },
},{ timestamps:{ createdAt:true, updatedAt:false } })

const Favorite = models?.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;