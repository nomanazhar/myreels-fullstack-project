"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import axios from "axios";
import { useRef, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { on } from "events";


interface FileUploadProps {
    onUploadComplete?: (response: any) => void;
    fileType?: "image" | "video";
    onProgress?: (progress: number) => void;
}

const FileUpload = ({ onUploadComplete, fileType, onProgress }: FileUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFileType = (file: File) => {
        if (fileType === "video" ){
            if (!file.type.startsWith("video/")) {
                setError("Please select a valid video file.");
            }
        }
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            setError("File size exceeds 50MB.");
            return false;
        }
    }
    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = event.target.files?.[0];
        if (!file || !validateFileType(file)) return;

        try {
            setUploading(true);
            const response = await axios.get("/api/upload-auth");
            const uploadParams = await response.data;

            const uploadResponse = await upload({
                file,
                fileName: file.name, // Optionally set a custom file name
                signature: uploadParams.signature,
                publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
                // Authentication parameters
                expire: uploadParams.expire,
                token: uploadParams.token,
                
                
                // Progress callback to update upload progress state
                onProgress: (event) => {
                   if(event.lengthComputable && onProgress) {
                    const progress = (event.loaded / event.total) * 100;
                    onProgress(progress);
                   }
                },
            });
            onUploadComplete && onUploadComplete(uploadResponse);
        } catch (error) {
            setError("File Upload failed.");
        }
        finally {   
            setUploading(false);
        }
    }


    return (
        <>
            <input 
            type="file"
            ref={fileInputRef}
            accept={fileType === "video" ? "video/*" : "image/*"}
            onChange={handleChange}
              />
            {uploading && <p>Uploading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </>
    );
};

export default FileUpload;