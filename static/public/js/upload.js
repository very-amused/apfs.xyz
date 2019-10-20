const form = document.forms.uploadForm;
const progressBar = $('#progressBar');

$('#fileUpload').on('change', (evt) => {
    const file = evt.target.files[0];
    const filenameDisplay = $('#filename');
    const submitButton = $('#submitButton');

    // Make the filename display visible
    filenameDisplay.removeClass('d-none');
    // Check file size and disable the upload button if it's above 50MB
    if (file.size >= (50 * 1024 * 1024)) {
        filenameDisplay.text('This file is too large');
        submitButton.removeClass('btn-success').addClass('btn-dark').attr('disabled', true);
    }
    else {
        // Re-enable the upload button if it was previously disabled
        if (submitButton.attr('disabled')) {
            submitButton.removeAttr('disabled').removeClass('btn-dark').addClass('btn-success');
        }
        // Set the text to the file's name
        filenameDisplay.text(file.name);
    }
});

form.onsubmit = () => {
    const formData = new FormData(form);

    const xhr = new XMLHttpRequest();

    // Show progress bar on upload start
    xhr.upload.addEventListener('loadstart', () => {
        $('#progressBarContainer').removeClass('d-none');
    });

    // Update progress bar width and percentage
    xhr.upload.addEventListener('progress', p => {
        const percentage = `${Math.round((p.loaded / p.total) * 100).toString()}%`;
        progressBar.css('width', percentage);
        progressBar.text(percentage);
    });

    // POST the form to the url specified by its 'action' attribute
    xhr.open('POST', form.getAttribute('action'));
    xhr.responseType = 'json'; // Receive JSON response from the server

    // Function to check for errors
    function errorCheck() {
        if (xhr.status !== 200) {
            /* If the server sent back an error message, alert the client using that,
            else check if the xhr has a status message. If neither messages are available, use a generic error message */
            let error;
            if (xhr.response) {
                error = xhr.response.error;
            }
            else {
                error = xhr.statusText ? xhr.statusText : 'An unspecified error has occured';
            }
            alert(error);
            return true;
        }
        else {
            return false;
        }
    }


    // Function called when the upload finishes
    xhr.onloadend = () => {
        // Check for errors
        if (errorCheck()) {
            return;
        }

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
};