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
  sound: new Howl({src: playlist[0].src}),
  soundIndex: 0,
  playing: false
}

playbtn = document.getElementById('playBtn')
pausebtn = document.getElementById('pauseBtn')
prevbtn = document.getElementById('prevBtn')
nextbtn = document.getElementById('nextBtn')
playbtn.addEventListener('click', () => {player.playing = true;player.sound.play()})
pausebtn.addEventListener('click', () => {player.playing = false;player.sound.pause()})
nextbtn.addEventListener('click', () => { index = (player.soundIndex < playlist.length - 1) ? player.soundIndex + 1 : 0
                                          sound = new Howl ({src: playlist[index].src})
                                          playSelected(sound, index)
                                        })
prevbtn.addEventListener('click', () => { index = (player.soundIndex > 0) ? player.soundIndex - 1 : playlist.length - 1
                                          sound = new Howl ({src: playlist[index].src})
                                          playSelected(sound, index)
                                        })
function initAudioPlayer() {
  var playlistContainer = document.createElement('div')
  playlist.forEach( (song, index) => {
    var listItem = createListItem(song,index)
    playlistContainer.appendChild(listItem)
  })
  var parent = document.getElementById('container')
  parent.appendChild(playlistContainer)
}

function createListItem(song, index) {
  var listItem = document.createElement('div')
  var title = document.createTextNode(song.title)
  var sound = new Howl({
    src: [song.src],
    volume: 1,
  })
  listItem.appendChild(title)
  listItem.addEventListener('click', () => {playSelected(sound, index)})
  return listItem
}

function playSelected(sound, index) {
  if(player.playing === false) {
    player.playing = true
  }
  else {
    player.sound.pause()
  }
  player.soundIndex = index
  player.sound = sound
  player.sound.play()
}

window.addEventListener('load', initAudioPlayer)
