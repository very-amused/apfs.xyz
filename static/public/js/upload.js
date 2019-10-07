const form = document.forms.uploadForm;
const progressBar = $('#progressBar');
form.onsubmit = () => {
    const formData = new FormData(form);

    const xhr = new XMLHttpRequest();

    // Show progress bar on upload start
    xhr.upload.addEventListener('loadstart', () => {
        $('#progressBarContainer').removeClass('d-none');
    });
    // Update progress bar width and percentage
    xhr.upload.addEventListener('progress', p => {
        const percentage = Math.round((p.loaded / p.total) * 100);
        progressBar.removeClass((i, className) => {
             // Remove classname that starts with w- (which controls width)
            return className.match(/w-\d*/g);
        });
        progressBar.addClass(`w-${percentage}`);
        progressBar.text(`${percentage}%`);

    });
    xhr.open('POST', form.getAttribute('action'));
    xhr.responseType = 'json'; // Receive JSON response from the server
    // Function called when the upload finishes
    xhr.onloadend = () => {
        // Stop the progress bar animation and set its text to 'finished'
        progressBar.removeClass('progress-bar-animated');
        progressBar.text('Upload complete');

        // Display a success message including the destination url
        const successMessage = $('#successMessage');
        successMessage.html(`Your file has been successfully uploaded, it can be found <a href=${xhr.response.url}>here</a>`);
        successMessage.removeClass('d-none');
    };
    xhr.send(formData);

    // Prevent the non-ajax fallback upload action from triggering
    return false;
}