import fs from 'fs';
import path from 'path';

const directoryPath = 'uploads';

// Read all files in the directory
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    // Iterate over each file
    files.forEach(file => {
        // Create a readable stream for each file
        const filePath = path.join(directoryPath, file);
        const fileStream = fs.createReadStream(filePath);
        
        // Append the file to the FormData object
        formData.append('files[]', fileStream, { filename: file });
    });
});










// import fs from 'fs';

// const formData = new FormData();
// const pdfFile = fs.createReadStream('/Users/avinashbejjam/Desktop/MU_Sem/3_2_SEM/NLP/nlp_project/Practise/uploads/1706.03762v7.pdf');
// formData.append('pdfFile', pdfFile);

// // Find the form element
// const pdfForm = document.getElementById('pdfForm');

// // Add submit event listener to the form
// pdfForm.addEventListener('submit', async (event) => {
//     // Prevent the default form submission behavior
//     event.preventDefault();

//     // Create a FormData object to capture form data
//     const formData = new FormData(pdfForm);
    
// });