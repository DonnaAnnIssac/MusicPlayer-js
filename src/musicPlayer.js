var sound, playbtn, pausebtn, mutebtn, seekSlider, volumeSlider, currTime, durationTime
function initAudioPlayer() {
    sound = new Howl({
      src: ['music/danceofdeath.mp3'],
      loop: true,
      volume: 1,
      })
    playbtn = document.getElementById('playBtn')
    pausebtn = document.getElementById('pauseBtn')
    // mutebtn = document.getElementById('mutebtn')
    // seekSlider = document.getElementById('seekSlider')
    // volumeSlider = document.getElementById('volumeSlider')
    // currTime = document.getElementById('currTime')
    // durationTime = document.getElementById('durationTime')
    playbtn.addEventListener('click', function() {sound.play()})
    pausebtn.addEventListener('click', function() {sound.pause()})
    // mutebtn.addEventListener('click', function() {sound.mute()})
  }
// function mute() {
//     if(sound.muted) {
//       sound.muted = false;
//        mutebtn.background = "url(volume_off.png)"
//     }
//     else {
//       sound.mute()
//     }
//   }
window.addEventListener('load', initAudioPlayer)
