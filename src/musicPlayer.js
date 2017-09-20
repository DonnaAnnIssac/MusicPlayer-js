var playlist = [{
  title: 'Dance of death',
  src: 'music/danceofdeath.mp3'
},
{
  title: 'Paint it Black',
  src: 'music/paint-it-black.mp3'
},
{
  title: 'Satisfaction',
  src: 'music/Satisfaction.mp3'
}]

var player = {
  sound: createHowlObject(playlist[0]),
  soundIndex: 0,
  playing: false,
  title: playlist[0].title,
  seeking: false
}

playbtn = document.getElementById('playBtn')
pausebtn = document.getElementById('pauseBtn')
prevbtn = document.getElementById('prevBtn')
nextbtn = document.getElementById('nextBtn')
volbtn = document.getElementById('volume')
seeker = document.getElementById('seekSlider')
volumeslider = document.getElementById("volumeSlider")

playbtn.addEventListener('click', () => {player.sound.play()})
pausebtn.addEventListener('click', () => {player.sound.pause()})
nextbtn.addEventListener('click', () => { index = (player.soundIndex < playlist.length - 1) ? player.soundIndex + 1 : 0
                                          update(playlist[index], index)})
prevbtn.addEventListener('click', () => { index = (player.soundIndex > 0) ? player.soundIndex - 1 : playlist.length - 1
                                          update(playlist[index], index)})
volbtn.addEventListener('click', () => muteUnmuteSound())
seeker.addEventListener('mousedown', (event) => { player.seeking = true
                                                  seek(event)})
seeker.addEventListener('mousemove', (event) => {seek(event)})
seeker.addEventListener('mouseup', () => player.seeking = false)
volumeslider.addEventListener('mousemove', setVolume)
var updateTime
var titleText = document.createTextNode(playlist[0].title)
var parentNode = document.getElementById('title')
parentNode.appendChild(titleText)

function initAudioPlayer() {
  var playlistContainer = document.createElement('div')
  playlist.forEach( (song, index) => {
    var listItem = createListItem(song,index)
    playlistContainer.appendChild(listItem)
  })
  playlistContainer.id = 'playlist'
  var parent = document.getElementById('root')
  parent.appendChild(playlistContainer)
}

function createListItem(song, index) {
  var listItem = document.createElement('div')
  var title = document.createTextNode(song.title)
  listItem.appendChild(title)
  listItem.addEventListener('click', () => update(song, index))
  return listItem
}

function playSelected(sound, index) {
  if(player.playing === false) player.playing = true
  else player.sound.stop()
  player.soundIndex = index
  player.sound = sound
  player.sound.play()
}

function updateCurrTitle(song) {
  var title = document.getElementById('title')
  title.innerHTML = song.title
  player.title = song.title
}

function updateTrackDuration () {
  var mins = pad(Math.floor(player.sound._duration / 60))
  var secs = pad(Math.floor(player.sound._duration - (mins * 60)))
  duration.innerHTML = mins+':'+secs
}

function updateTimeAndSeek () {
  var totalMins = Math.floor(player.sound._duration / 60)
  var totalSecs = Math.floor(player.sound._duration - (mins * 60))
  var sec = parseFloat(secs.innerHTML), min = parseFloat(mins.innerHTML)
  updateTime = setInterval(() => { var newMin = sec/60
                            var newSec = sec%60
                            mins.innerHTML = pad(parseInt(min + newMin))
                            secs.innerHTML = pad(parseInt(newSec + 1))
                            ++sec
                            seeker.value = parseFloat(seeker.value) + parseFloat(100/player.sound._duration)
                          }, 1000)
}

function pad (val) { return val > 9 ? val : "0" + val }

function update(song, index) {
  var sound = createHowlObject(song)
  updateCurrTitle(song)
  resetTimer()
  playSelected(sound, index)
}

function muteUnmuteSound() {
  if (player.sound._muted === true) {
    player.sound._muted = false
    player.sound.mute(player.sound._muted)}
  else {
    player.sound._muted = true
    player.sound.mute(player.sound._muted)
  }
}

function seek(event) {
  if(player.seeking) {
    seeker.value = event.clientX - seeker.offsetLeft;
    var seekto = player.sound._duration * (seeker.value / 100);
    newMins = pad(Math.floor(seekto / 60))
    newSecs = pad(Math.floor(seekto - (newMins * 60)))
    mins.innerHTML = newMins
    secs.innerHTML = newSecs
    clearInterval(updateTime)
    updateTimeAndSeek()
    player.sound.seek(seekto)
  }
}



function setVolume() {
  player.sound.volume(volumeslider.value/100)
}

function resetTimer() {
  clearInterval(updateTime)
  mins.innerHTML = "00"
  secs.innerHTML = "00"
}

function createHowlObject(song) {
 return new Howl({src: song.src,
                  onload: () => {updateTrackDuration()
                    seeker.value = 0},
                  onplay: () => {player.playing = true
                    updateTimeAndSeek()},
                  onstop: () => {player.playing = false},
                  onend: () => {resetTimer()},
                  onpause: () => {player.playing = false
                    clearInterval(updateTime)},
                  onmute: () => {volbtn.style.background = (player.sound._muted) ?
                    "url(./images/mute.png) no-repeat" :
                    "url(./images/volume.png) no-repeat"
                    volbtn.style.backgroundSize = "cover"} })
}

window.addEventListener('load', initAudioPlayer)
