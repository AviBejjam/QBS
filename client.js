import fs from 'fs';

const formData = new FormData();
const pdfFile = fs.createReadStream('/Users/avinashbejjam/Desktop/MU_Sem/3_2_SEM/NLP/nlp_project/Practise/Files/exportPDFInput.pdf');
formData.append('pdfFile', pdfFile);

// Find the form element
const pdfForm = document.getElementById('pdfForm');

// Add submit event listener to the form
pdfForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Create a FormData object to capture form data
    const formData = new FormData(pdfForm);

    
});
