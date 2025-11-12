import File from "../model/file.model.js";
import cloudinary from "../config/cloud.js"

export const addfile = async (req, res) => {
    try {
        const { title, description, subject, createdBy } = req.body
        console.log(req.body)

        if (!title || !description || !subject || !createdBy) {
            return res.status(400).json({
                message: "All fields are required!!!!!!"
            })
        }
        let fileUrl = undefined;

        if (req.file) {
            try {
                const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
                const uploadResult = await cloudinary.uploader.upload(base64File, {
                    folder: "files",
                    resource_type: "raw"
                });

                fileUrl = uploadResult.secure_url;


                //


            } catch (error) {
                console.error(error);
                res.status(500).json({
                    message: "Internal Server Error"
                })

            }
        }

        const newFile = await File.create({
            title, description, subject, fileUrl, createdBy
        })
        res.status(201).json({
            success: true,
            message: "file created",
            newFile,

        })


    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

}

//new controller


export const getAllFiles = async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json({
            success: true,
            count: files.length,
            files
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}


export const getFileById = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({
                message: "File not find"
            })
        }

        res.status(200).json({
            success: true,
            file
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}