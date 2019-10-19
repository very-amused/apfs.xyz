$('#fileUpload').on('change', (evt) => {
    const filename = evt.target.files[0].name;
    const filenameDisplay = $('#filename');

    // Make the filename display visible and set the text to the file's name
    filenameDisplay.removeClass('d-none');
    filenameDisplay.text(filename);
});