//create object references
playPausebtn = document.getElementById('playPauseBtn')
prevbtn = document.getElementById('prevBtn')
nextbtn = document.getElementById('nextBtn')
shufflebtn = document.getElementById('shuffle')
repeatbtn = document.getElementById('repeat')
volbtn = document.getElementById('volume')
seeker = document.getElementById('seekSlider')
volumeslider = document.getElementById("volumeSlider")
searchInput = document.getElementById('searchInput')
coverArt = document.getElementById('albumArt')
togglebtn = document.getElementById('showLib')
parent = document.getElementById('libraryContainer')
playlistAdd = document.getElementById('add')
playlistView = document.getElementById('playlistDisplay')
view = document.getElementById('view')
//add event handlers
playPausebtn.addEventListener('click', () => { if(!player.playing) player.sound.play()
                                          else player.sound.pause() } )
nextbtn.addEventListener('click', () => { if(player.shuffle) shufflePlaylist()
                                          else {
                                          index = (player.soundIndex < library.length - 1) ? player.soundIndex + 1 : 0
                                          update(library[index], index)} })
prevbtn.addEventListener('click', () => { if(player.shuffle) shufflePlaylist()
                                          else {
                                          index = (player.soundIndex > 0) ? player.soundIndex - 1 : library.length - 1
                                          update(library[index], index)} })
shufflebtn.addEventListener('click', () => { player.shuffle = (player.shuffle) ? false : true
                                            if(!player.playing) shufflePlaylist() })
repeatbtn.addEventListener('click', () => player.repeat = (player.repeat) ? false : true )
volbtn.addEventListener('click', () => muteUnmuteSound())
seeker.addEventListener('mousedown', (event) => { player.seeking = true
                                                  seek(event)})
seeker.addEventListener('mousemove', (event) => seek(event))
seeker.addEventListener('mouseup', () => player.seeking = false)
volumeslider.addEventListener('mousemove', setVolume)
togglebtn.addEventListener('click', () => { parent.style.display = (player.showLib) ? "none" : "flex"
                                            player.showLib = (!player.showLib)
                                          })
playlistAdd.addEventListener('click', () => createPlaylist())   
view.addEventListener('click', () => {  showPlaylist = (!showPlaylist) ? true : false
                                        playlistView.style.display = (showPlaylist) ? "flex" : "none"
                                        appendToList()
                                      })                                       
var updateTime,library = [], player = {}, playlist = [], add = false, showPlaylist = false
var libraryItems = document.createElement('ul')
var playlistItems = document.createElement('ul')

function createPlaylist() {
  if(!add) {
    add = true
    playlistAdd.style.background = 'url("./images/playlist-add-check.png") no-repeat'
    playlistAdd.style.backgroundSize = 'contain'}
  else {
    add = false
    playlistAdd.style.background = 'url("./images/playlist-add.png") no-repeat'
    playlistAdd.style.backgroundSize = 'contain'
    pushToStorage()
  }
}

function addToPlaylist(song, index) {
  playlist.push(song)
  console.log(playlist)
}

function pushToStorage() {
  localStorage.setItem('playlist', JSON.stringify(playlist))
  appendToList()
}

function appendToList() {
  if(localStorage.getItem('playlist'))
    // playlist.push(JSON.parse(localStorage.getItem(i)))
  // console.log(playlist)
      playlist = JSON.parse(localStorage.getItem('playlist'))
    console.log(playlist)
    playlist.forEach((song, index) => {
      var listItem = createListItem(song, index)
      playlistItems.appendChild(listItem)
    })
    playlistItems.id = 'playlistDisplay'
    playlistItems.style.listStyleType = 'none'
    playlistItems.style.padding = '10px'
    playlistItems.style.width = '100%'
    playlistItems.style.margin = '0px'
    console.log(playlistItems)
    playlistView.appendChild(playlistItems)
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

function updateCurrImage(song) {
  player.image = song.albumArt
  coverArt.style.background = "url("+player.image+") no-repeat"
  coverArt.style.backgroundSize = "100% 100%"
}
function update(song, index) {
  var sound = createHowlObject(song)
  updateCurrTitle(song)
  updateCurrImage(song)
  resetTimer()
  playSelected(sound, index)
}

function resetTimer() {
  clearInterval(updateTime)
  mins.innerHTML = "00"
  secs.innerHTML = "00"
  return
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

function shufflePlaylist() {
  var index = Math.floor(Math.random() * (library.length))
  update(library[index], index)
}

function search() {
  var filter = searchInput.value.toUpperCase()
  // if(filter.length === 0)

  var lis = Array.from(document.getElementsByTagName('li'))
  arr = lis.filter((li) => {
    var name = li.innerHTML
    li.style.display = (name.toUpperCase().indexOf(filter) !== -1) ? 'list-item' : 'none'
    if(li.style.display === 'list-item') return li
  })
  console.log(arr)
  //if not found, use search call
  if(arr.length === 0) searchAndAdd(filter)
}

function searchAndAdd(filter) {
  var xhr = new XMLHttpRequest()
  xhr.open("GET", "https://api.fanburst.com/tracks/search?query="+searchInput.value+";client_id=08820572-567e-4aeb-9e3c-61e029d82a46", true)
  xhr.onload = () => {
    var results = JSON.parse(xhr.responseText)
    if(results[0].title.toUpperCase().indexOf(filter) !== -1) {
      var old = library
      addToLibrary(results)
      var newlyAdded = library.filter((song) => { 
        if(!(song in old))
          return song
      })
      createList(newlyAdded)
      search()
    }
    else 
      document.getElementById('libraryContainer').textContent = 'Nothing to display'  
  }
  xhr.send()

}

function makeRequest(callback) {
  var xhr = new XMLHttpRequest()
  xhr.open("GET", "https://api.fanburst.com/tracks/trending?client_id=08820572-567e-4aeb-9e3c-61e029d82a46", true)
  xhr.onload = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      addToLibrary(JSON.parse(xhr.responseText)) 
      callback()
    }
    else  
      console.error(xhr.statusText)}
  xhr.onerror = () => console.error(xhr.statusText)
  xhr.send()
}

function addToLibrary(resp) {
  resp.map((item) => {
    let track = {}
    track["title"] = item.title.toUpperCase()
    track["src"] = item.stream_url+"?client_id=08820572-567e-4aeb-9e3c-61e029d82a46"
    track["albumArt"] = item.image_url
    library.push(track) 
  })
}

function createHowlObject(song) {
 return new Howl({ 
  src: song.src,
  format: "mp3",
  html5: true,
  xhrWithCredentials: true,
  onload: () => { updateTrackDuration()
                  seeker.value = 0 },
  onplay: () => { player.playing = true
                  playPausebtn.style.background = "url(./images/pause2.png) no-repeat"
                  playPausebtn.style.backgroundSize = "contain"
                  setVolume()
                  updateTimeAndSeek() },
  onstop: () => player.playing = false,
  onend: () => {  player.playing = false
                  resetTimer()
                  if(player.shuffle) shufflePlaylist()
                  if(player.repeat) { player.sound = createHowlObject(library[player.soundIndex])
                  player.sound.play()} },
  onpause: () => { player.playing = false
                   playPausebtn.style.background = "url(./images/play2.png) no-repeat"                  
                   playPausebtn.style.backgroundSize = "contain"
                   clearInterval(updateTime) },
  onmute: () => { volbtn.style.background = (player.sound._muted) ?
                  "url(./images/mute.png) no-repeat" : "url(./images/volume.png) no-repeat"
                  volbtn.style.backgroundSize = "contain" } 
                })
}

function initPlayerState() {
  return {
    sound: createHowlObject(library[0]),
    soundIndex: 0,
    playing: false,
    title: library[0].title,
    seeking: false,
    volume: 1,
    shuffle: false,
    repeat: false,
    image: library[0].albumArt,
    showLib: false,
  }
}

function createList(library) {
  library.forEach((song, index) => {
    var listItem = createListItem(song,index)
    libraryItems.appendChild(listItem)
  })
  libraryItems.id = 'list'
  libraryItems.style.listStyleType = 'none'
  libraryItems.style.padding = '10px'
  libraryItems.style.width = '100%'
  libraryItems.style.margin = '0px'
}
//creating sub divs to hold info of each track
function createListItem(song, index) {
  var listItem = document.createElement('li')
  var title = document.createTextNode(song.title)
  listItem.appendChild(title)
  listItem.className = 'playlist'
  // listItem.style.borderRadius = "50px";
  listItem.addEventListener('click', () => {
    if(!add)
      update(song, index)
    else
      addToPlaylist(song, index)
  })
  return listItem
}
function callback() {
  createList(library)
  player = initPlayerState()
  parent.appendChild(libraryItems)
  var titleText = document.createTextNode(library[0].title)
  var parentNode = document.getElementById('title')
  parentNode.appendChild(titleText)
  coverArt.style.background = "url("+player.image+") no-repeat"
  coverArt.style.backgroundSize = "100% 100%"
}
function initAudioPlayer() {
  makeRequest(callback)
}

window.addEventListener('load', initAudioPlayer)
