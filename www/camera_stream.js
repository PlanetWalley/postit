// try to use webrtc to get camera stream

// get video object
var video = document.getElementById('cam')

// set navigator.getUserMedia            
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

// set window.URL
window.URL = (window.URL || window.webkitURL || window.mozURL || window.msURL);
                                      
var onFailSoHard = function(e) {
    alert("Can not play Video");
    console.log('Reeeejected!', e);
}
            
var onSuccess=function(stream) {
    if (video.mozSrcObject != undefined) {
        video.mozSrcObject = stream;
    } else {
        video.src = (window.URL &&
                     window.URL.createObjectURL(stream)) || stream;
    }           
}
            
            
if (navigator.getUserMedia) {
    navigator.getUserMedia(
        // {video: true, audio: true},
        {video: true},
        onSuccess,
        onFailSoHard);
} else {
    alert("Failed");
    video.src = 'somevideo.webm'; // fallback.
}


            

