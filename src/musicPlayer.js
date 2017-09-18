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
  sound: new Howl({src: playlist[0].src,
                   onload: () => updateTrackDuration(),
                   onplay: () => {player.playing = true
                                  updateTrackTime()},
                   onpause: () => {player.playing = false}
                 }),
  soundIndex: 0,
  playing: false,
  title: playlist[0].title
}

playbtn = document.getElementById('playBtn')
pausebtn = document.getElementById('pauseBtn')
prevbtn = document.getElementById('prevBtn')
nextbtn = document.getElementById('nextBtn')
trackTitle = document.getElementById('title')
playbtn.addEventListener('click', () => {player.sound.play()})
pausebtn.addEventListener('click', () => {player.sound.pause()})
nextbtn.addEventListener('click', () => { index = (player.soundIndex < playlist.length - 1) ? player.soundIndex + 1 : 0
                                          update(playlist[index], index)
                                        })
prevbtn.addEventListener('click', () => { index = (player.soundIndex > 0) ? player.soundIndex - 1 : playlist.length - 1
                                          update(playlist[index], index)
                                        })

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
  else player.sound.pause()
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
  var mins = Math.floor(player.sound._duration / 60)
  var secs = Math.floor(player.sound._duration - (mins * 60))
  duration.innerHTML = mins+':'+secs
}

function updateTrackTime () {
  var totalMins = Math.floor(player.sound._duration / 60)
  var totalSecs = Math.floor(player.sound._duration - (mins * 60))
  var secs = 0
  var mins = 0
  var foo = setInterval(() => { if(mins == totalMins && secs == totalSecs)
                                clearInterval(foo)
                                timer.innerHTML = (pad(parseInt(secs/60))+':'+pad(secs%60))
                                ++secs}, 1000)
}

function pad ( val ) { return val > 9 ? val : "0" + val }

function update(song, index) {
  var sound = new Howl({
      src: song.src,
      onload: () => updateTrackDuration(),
      onplay: () => {console.log("Hiya");updateTrackTime()}})
      updateCurrTitle(song)
      playSelected(sound, index)
}
window.addEventListener('load', initAudioPlayer)
