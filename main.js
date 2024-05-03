import {
    ExtractElementType,
    ExtractPDFJob,
    ExtractPDFParams,
    ExtractPDFResult,
    MimeType,
    PDFServices,
    SDKError,
    ServiceApiError,
    ServicePrincipalCredentials,
    ServiceUsageError
} from "@adobe/pdfservices-node-sdk";
import dotenv from 'dotenv';
import express from "express";
import fs from "fs";
import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";
const app = express();
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = 3000;

// Set up multer middleware to handle file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

app.get("/extractText",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

// Use multer middleware for handling file uploads
app.post('/extractText', upload.single('pdfFile'), async (req, res) => {
    let readStream;

    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Access the uploaded PDF file data from the request object
        const pdfFile = req.file;

        // Specify the destination directory where the PDF file will be saved
        const destinationDirectory = 'uploads/';
        

        // Move the uploaded PDF file to the destination directory
        fs.renameSync(pdfFile.path, destinationDirectory + pdfFile.originalname);

        // Extract the query from the request body
        const query = req.body.textex;

        // Save the query to a text file
        const queryFilePath = `${destinationDirectory}query.txt`;
        fs.writeFileSync(queryFilePath, query);

        res.redirect("/extractText");

        // Create PDF Services credentials
        const credentials = new ServicePrincipalCredentials({
            clientId: process.env.PDF_SERVICES_CLIENT_ID,
            clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
        });

        // Create a PDF Services instance
        const pdfServices = new PDFServices({ credentials });

        // Read the uploaded PDF file and create an asset
        readStream = fs.createReadStream(destinationDirectory + pdfFile.originalname);
        const inputAsset = await pdfServices.upload({
            readStream,
            mimeType: MimeType.PDF
        });

        // Create parameters for the job
        const params = new ExtractPDFParams({
            elementsToExtract: [ExtractElementType.TEXT]
        });

        // Create a new job instance
        const job = new ExtractPDFJob({ inputAsset, params });

        // Submit the job and get the job result
        const pollingURL = await pdfServices.submit({ job });
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: ExtractPDFResult
        });

        // Get content from the resulting asset
        const resultAsset = pdfServicesResponse.result.resource;
        const streamAsset = await pdfServices.getContent({ asset: resultAsset });

        // Write the extracted text to a JSON file
        const outputFilePath = createOutputFilePath();
        console.log(`Saving asset at ${outputFilePath}`);

        const writeStream = fs.createWriteStream(outputFilePath);
        streamAsset.readStream.pipe(writeStream);
    } catch (err) {
        console.error('Error saving PDF:', err);
        res.status(500).send('Error saving PDF: ' + err.message);
        if (err instanceof SDKError || err instanceof ServiceUsageError || err instanceof ServiceApiError) {
            console.log("Exception encountered while executing operation", err);
        } else {
            console.log("Exception encountered while executing operation", err);
        }
    } finally {
        readStream?.destroy();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


function createOutputFilePath() {
    const filePath = "output/";
    const date = new Date();
    const dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
        ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
    fs.mkdirSync(filePath, {recursive: true});
    return (`${filePath}extract${dateString}.zip`);
}