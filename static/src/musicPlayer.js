playbtn = document.getElementById('playBtn')
pausebtn = document.getElementById('pauseBtn')
prevbtn = document.getElementById('prevBtn')
nextbtn = document.getElementById('nextBtn')
shufflebtn = document.getElementById('shuffle')
repeatbtn = document.getElementById('repeat')
volbtn = document.getElementById('volume')
seeker = document.getElementById('seekSlider')
volumeslider = document.getElementById("volumeSlider")
searchInput = document.getElementById('searchInput')

playbtn.addEventListener('click', () => { if(!player.playing) player.sound.play() } )
pausebtn.addEventListener('click', () => player.sound.pause() )
nextbtn.addEventListener('click', () => { if(player.shuffle) shufflePlaylist()
                                          else {
                                          index = (player.soundIndex < playlist.length - 1) ? player.soundIndex + 1 : 0
                                          update(playlist[index], index)} })
prevbtn.addEventListener('click', () => { if(player.shuffle) shufflePlaylist()
                                          else {
                                          index = (player.soundIndex > 0) ? player.soundIndex - 1 : playlist.length - 1
                                          update(playlist[index], index)} })
shufflebtn.addEventListener('click', () => { player.shuffle = (player.shuffle) ? false : true
                                            if(!player.playing) shufflePlaylist() })
repeatbtn.addEventListener('click', () => player.repeat = (player.repeat) ? false : true )
volbtn.addEventListener('click', () => muteUnmuteSound())
seeker.addEventListener('mousedown', (event) => { player.seeking = true
                                                  seek(event)})
seeker.addEventListener('mousemove', (event) => seek(event))
seeker.addEventListener('mouseup', () => player.seeking = false)
volumeslider.addEventListener('mousemove', setVolume)
var updateTime

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
  seeker.max = player.sound._duration
  var sec = parseFloat(secs.innerHTML) + 1, min = parseFloat(mins.innerHTML)
  updateTime = setInterval(() => { var newMin = sec/60
    var newSec = sec%60
    mins.innerHTML = pad(parseInt(min + newMin))
    secs.innerHTML = pad(parseInt(newSec))
    seeker.value = parseFloat(seeker.value) + 1
    sec++ }, 1000)
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
    var secPerPixel = player.sound._duration/seeker.offsetWidth
    seeker.value = parseFloat((event.clientX - seeker.offsetLeft) * secPerPixel)
    newMins = pad(Math.floor(parseFloat(seeker.value) / 60))
    newSecs = pad(Math.floor(parseFloat(seeker.value) - (newMins * 60)))
    mins.innerHTML = newMins
    secs.innerHTML = newSecs
    clearInterval(updateTime)
    updateTimeAndSeek()
    player.sound.seek(seeker.value)
  }
}

function setVolume() {
  player.volume = volumeslider.value/100
  player.sound.volume(player.volume)
}

function resetTimer() {
  clearInterval(updateTime)
  mins.innerHTML = "00"
  secs.innerHTML = "00"
  return
}

function shufflePlaylist() {
  var index = Math.floor(Math.random() * (playlist.length))
  update(playlist[index], index)
}

function search() {
  var filter = searchInput.value.toUpperCase()
  var lis = document.getElementsByTagName('li')
  for(let i = 0; i < lis.length; i++) {
    var name = lis[i].innerHTML
    lis[i].style.display = (name.toUpperCase().indexOf(filter) !== -1) ? 'list-item' : 'none'
  }
}

function createHowlObject(song) {
 return new Howl({ src: song.src,
  onload: () => { updateTrackDuration()
    seeker.value = 0 },
  onplay: () => { player.playing = true
    setVolume()
    updateTimeAndSeek() },
  onstop: () => player.playing = false,
  onend: () => { player.playing = false
    resetTimer()
    if(player.shuffle) shufflePlaylist()
    if(player.repeat) { player.sound = createHowlObject(playlist[player.soundIndex])
      player.sound.play()} },
  onpause: () => { player.playing = false
      clearInterval(updateTime) },
  onmute: () => { volbtn.style.background = (player.sound._muted) ?
    "url(./images/mute.png) no-repeat" : "url(./images/volume.png) no-repeat"
    volbtn.style.backgroundSize = "contain" } })
}

var playlist = [{
  title: 'Dance of death',
  src: 'http://localhost:8000/music/danceofdeath.mp3'
},
{
  title: 'Paint it Black',
  src: 'http://localhost:8000/music/paint-it-black.mp3'
},
{
  title: 'Satisfaction',
  src: 'http://localhost:8000/music/Satisfaction.mp3'
}]

var player = {
  sound: createHowlObject(playlist[0]),
  soundIndex: 0,
  playing: false,
  title: playlist[0].title,
  seeking: false,
  volume: 1,
  shuffle: false,
  repeat: false
}

//creating sub divs to hold info of each track
function createListItem(song, index) {
  var listItem = document.createElement('li')
  var title = document.createTextNode(song.title)
  listItem.appendChild(title)
  listItem.className = 'playlist'
  listItem.addEventListener('click', () => update(song, index))
  return listItem
}

function initAudioPlayer() {
  var playlistItems = document.createElement('ul') //creating main playlist
  playlist.forEach( (song, index) => {
    var listItem = createListItem(song,index)
    playlistItems.appendChild(listItem)
  })
  playlistItems.className = 'playlist'
  playlistItems.id = 'list'
  playlistItems.style.listStyleType = 'none'
  var parent = document.getElementById('playlistContainer')
  parent.appendChild(playlistItems)
  var titleText = document.createTextNode(playlist[0].title)
  var parentNode = document.getElementById('title')
  parentNode.appendChild(titleText)
}

window.addEventListener('load', initAudioPlayer)
