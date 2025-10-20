import mongoose ,{Schema,models} from "mongoose";

export interface IVideo extends Document {
    title:string;
    description?:string;
    url:string;
    controls?:boolean;
    transformations?:{
        height:number;
        width:Number;
        quality?: number;
    }
    UserId:mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export const Video_Dimensions = {
    WIDTH:1280,
    HEIGHT:720
} as const;

export const VideoSchema = new Schema<IVideo>({
    title:{ type: String, required:true },
    description:{ type: String },
    url:{ type: String, required:true },
    controls:{ type: Boolean, default:true },
    transformations:{
        height:{ type: Number , default:Video_Dimensions.HEIGHT },
        width:{ type: Number , default:Video_Dimensions.WIDTH },
        quality:{ type: Number , min:1, max:100, default:80 },
    },
    UserId:{ type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
},{ timestamps:true })

const Video = models?.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;