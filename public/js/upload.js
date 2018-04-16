$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#up').on('click', function(){

    var files = $('#upload-input').get(0).files;

    if (files.length > 0){
        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var formData = new FormData();

        // loop through all the selected files and add them to the formData object
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            // add the files to formData object for the data payload
            formData.append('uploads[]', file, name1 + '_' + file.name);
        }
        var file_name = name1 + '_' + files[0].name;
        console.log(file_name);

        $.ajax({
            url: '/videos/uploadf',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data){
                console.log('upload successful!\n' + data);
                $.ajax({
                    url: '/videos/upload',
                    type: 'POST',
                    data: {
                        title: $('#title').val(),
                        description: $('#description').val(),
                        file_name: file_name,
                        privacy: $('#privacy').val(),
                        category: $('#category').val(),
                        tags: $('#tags').val()
                    },
                    success: function(res) {
                        console.log(res);
                        //alert(res);
                        window.location.replace("/videos/me");
                    },
                    error: function(data){
                        alert("fail " + data);

                    }
                });
            },
            error: function(data){
                alert("fail " + data);

            },
            xhr: function() {
                // create an XMLHttpRequest
                var xhr = new XMLHttpRequest();

                // listen to the 'progress' event
                xhr.upload.addEventListener('progress', function(evt) {

                    if (evt.lengthComputable) {
                        // calculate the percentage of upload completed
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);

                        // update the Bootstrap progress bar with the new percentage
                        $('.progress-bar').text(percentComplete + '%');
                        $('.progress-bar').width(percentComplete + '%');

                        // once the upload reaches 100%, set the progress bar text to done
                        if (percentComplete === 100) {
                            $('.progress-bar').html('Done');
                        }

                    }

                }, false);

                return xhr;
            }
        });

    }
});
