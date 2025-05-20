
// SONG DATA
let playlistData = [
    { title: "Pee Loon", artist: "Mohit Chauhan", art: "pee loon.jpg", file: "128-Pee Loon Hoto Ki Sargam - Once Upon A Time In Mumbaai 128 Kbps.mp3" },
    { title: "Tu Chahiye", artist: "Atif Aslam", art: "tu chahiye.jpg", file: "128-Tu Chahiye - Bajrangi Bhaijaan 128 Kbps.mp3" },
    { title: "Raanjhan", artist: "Raanjhan", art: "raanjhan.jpg", file: "Raanjhan.mp3" },
    { title: "Shaky", artist: "Sanju Rathod, Isha Malviya", art: "shaky.jpg", file: "Shaky Sanju Rathod, Isha Malviya (pagalall.com).mp3" },
    { title: "Ik Kahani", artist: "Gajendra Verma", art: "ek kahani.jpg", file: "Ik Kahani.mp3" },
    { title: "Vaaste", artist: "Dhvani Bhanushali", art: "vaasteee.jpg", file: "Vaaste Nikhil Dsouza 128 Kbps.mp3" },
    { title: "Tera Ban Jaunga", artist: "Akhil Sachdeva", art: "tera ban jauga.jpg", file: "128-Tera Ban Jaunga - Kabir Singh 128 Kbps.mp3" },
    { title: "Tum Hi Ho", artist: "Arijit Singh", art: "tum hi ho.jpg", file: "128-Tum Hi Ho - Aashiqui 2 128 Kbps.mp3" },
    { title: "Dil Diyan Gallan", artist: "Atif Aslam", art: "dil diyan gallan.jpg", file: "128-Dil Diyan Gallan - Tiger Zinda Hai 128 Kbps.mp3" },
    { title: "Bekhayali", artist: "Sachet Tandon", art: "bekhayali.jpg", file: "128-Bekhayali - Kabir Singh 128 Kbps.mp3" }
];

const popularSongs = [
    { title: "Pee Loon", art: "pee loon.jpg", index: 0 },
    { title: "Tu Chahiye", art: "tu chahiye.jpg", index: 1 },
    { title: "Dil Diyan Gallan", art: "dil diyan gallan.jpg", index: 8 },
    { title: "Shaky", art: "shaky.jpg", index: 3 },
    { title: "Raanjhan", art: "raanjhan.jpg", index: 2 },
    { title: "Tera Ban Jaunga", art: "tera ban jauga.jpg", index: 6 },
    { title: "Ik Kahani", art: "ek kahani.jpg", index: 4 },
    { title: "Vaaste", art: "vaasteee.jpg", index: 5 },
    { title: "Tum Hi Ho", art: "tum hi ho.jpg", index: 7 },
    { title: "Bekhayali", art: "bekhayali.jpg", index: 9 }
];

const popularArtists = [
    { name: "Atif Aslam", art: "Atif Aslam.jpg" },
    { name: "Arijit Singh", art: "Arijit Singh.jpg" },
    { name: "Mohit Chauhan", art: "Mohit Chauhan.jpg" },
    { name: "Dhvani Bhanushali", art: "Dhvani Bhanushali.jpg" },
    { name: "Gajendra Verma", art: "Gajendra Verma.jpg" },
    { name: "Akhil Sachdeva", art: "Akhil Sachdeva.jpg" },
    { name: "sanju rathod", art: "sanju rathod.jpg" },
    { name: "sanchet tandon", art: "sanchet tandon.jpg" },
    { name: "mithoon", art: "mithoon.jpg" }
];

const artistMap = {
    "Atif Aslam": [1, 8],
    "Arijit Singh": [7],
    "Mohit Chauhan": [0],
    "Dhvani Bhanushali": [5],
    "Gajendra Verma": [4],
    "Akhil Sachdeva": [6],
    "sanchet tandon": [2,9],
    "sanju rathod": [3],
    "mithoon": [3]
};

// DOM Elements
const playlistEl = document.getElementById('playlist');
const popularSongsEl = document.getElementById('popular-songs');
const popularArtistsEl = document.getElementById('popular-artists');
const playerArt = document.getElementById('player-art');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progressContainer');
const volumeSlider = document.getElementById('volume');
const searchInput = document.getElementById('searchInput');
const addSongBtn = document.getElementById('add-song-btn');

let audio = new Audio();
let currentTrack = 0;
let isPlaying = false;
let filteredPlaylistIndexes = null; // For search/artist filter

// Render Sidebar Playlist
function renderPlaylist() {
    playlistEl.innerHTML = '';
    (filteredPlaylistIndexes || playlistData.map((_, i) => i)).forEach((idx, n) => {
        const song = playlistData[idx];
        const li = document.createElement('li');
        li.className = 'playlist-item' + (idx === currentTrack ? ' active' : '');
        li.innerHTML = `
            <span class="number">${String(n+1).padStart(2,'0')}</span>
            <img src="${song.art}" alt="${song.title}">
            <div class="info">
                <div class="title">${song.title}</div>
                <div class="artist">${song.artist}</div>
            </div>
            <button class="play-btn">▶</button>
            <button class="remove-btn" title="Remove Song" style="margin-left:8px;">🗑️</button>
        `;
        li.querySelector('.play-btn').onclick = (e) => {
            e.stopPropagation();
            playFromIndex(idx);
        };
        li.querySelector('.remove-btn').onclick = (e) => {
            e.stopPropagation();
            removeSong(idx);
        };
        li.onclick = () => playFromIndex(idx);
        playlistEl.appendChild(li);
    });
}

// Remove Song (dynamic playlist)
function removeSong(idx) {
    // Remove from playlistData
    playlistData.splice(idx, 1);
    // Adjust currentTrack if needed
    if (currentTrack >= playlistData.length) {
        currentTrack = Math.max(0, playlistData.length - 1);
    }
    renderPlaylist();
    loadTrack(currentTrack, false);
}

// Add Song (dynamic playlist)
addSongBtn.onclick = () => {
    const title = prompt("Song Title:");
    if (!title) return;
    const artist = prompt("Artist Name:");
    if (!artist) return;
    const art = prompt("Cover Image File (e.g. song.jpg):", "default.jpg");
    const file = prompt("Audio File (e.g. song.mp3):", "default.mp3");
    playlistData.push({ title, artist, art, file });
    renderPlaylist();
};

// Render Popular Songs (horizontal scroll)
function renderPopularSongs() {
    popularSongsEl.innerHTML = '';
    popularSongs.forEach(song => {
        const div = document.createElement('div');
        div.className = 'song-cover-container';
        div.innerHTML = `<img src="${song.art}" alt="${song.title}" class="song-cover"><div class="song-title">${song.title}</div>`;
        div.onclick = () => playFromIndex(song.index);
        popularSongsEl.appendChild(div);
    });
}

// Render Popular Artists
function renderPopularArtists() {
    popularArtistsEl.innerHTML = '';
    popularArtists.forEach(artist => {
        const div = document.createElement('div');
        div.className = 'artist-cover-container';
        div.innerHTML = `<img src="${artist.art}" alt="${artist.name}" class="artist-cover"><div class="artist-name">${artist.name}</div>`;
        div.onclick = () => filterByArtist(artist.name);
        popularArtistsEl.appendChild(div);
    });
}

// Play a song from any index
function playFromIndex(idx) {
    currentTrack = idx;
    loadTrack(idx, true);
    renderPlaylist();
}

// Load Track
function loadTrack(idx, play = false) {
    if (playlistData.length === 0) {
        audio.pause();
        playerArt.src = "";
        playerTitle.textContent = "No Song";
        playerArtist.textContent = "";
        playBtn.textContent = '▶';
        progress.style.width = "0%";
        return;
    }
    currentTrack = idx;
    const song = playlistData[idx];
    audio.src = song.file;
    playerArt.src = song.art;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    renderPlaylist();
    if (play) {
        audio.play();
        isPlaying = true;
        playBtn.textContent = '⏸';
    } else {
        playBtn.textContent = '▶';
    }
}

// Player Controls
playBtn.onclick = () => {
    if (audio.paused) {
        audio.play();
        isPlaying = true;
        playBtn.textContent = '⏸';
    } else {
        audio.pause();
        isPlaying = false;
        playBtn.textContent = '▶';
    }
};
prevBtn.onclick = () => {
    if (playlistData.length === 0) return;
    let idx = (currentTrack - 1 + playlistData.length) % playlistData.length;
    playFromIndex(idx);
};
nextBtn.onclick = () => {
    if (playlistData.length === 0) return;
    let idx = (currentTrack + 1) % playlistData.length;
    playFromIndex(idx);
};

// --- Seek Functionality (click & drag, mouse and touch) ---
let isSeeking = false;

function seekTo(event, container) {
    const rect = container.getBoundingClientRect();
    let x;
    if (event.type.startsWith("touch")) {
        x = event.touches[0].clientX - rect.left;
    } else {
        x = event.offsetX !== undefined ? event.offsetX : event.clientX - rect.left;
    }
    const pct = Math.max(0, Math.min(1, x / container.clientWidth));
    audio.currentTime = pct * audio.duration;
}

progressContainer.addEventListener('mousedown', function(e) {
    isSeeking = true;
    seekTo(e, this);
});
progressContainer.addEventListener('mousemove', function(e) {
    if (isSeeking) seekTo(e, this);
});
document.addEventListener('mouseup', function() {
    isSeeking = false;
});
// Touch support
progressContainer.addEventListener('touchstart', function(e) {
    isSeeking = true;
    seekTo(e, this);
});
progressContainer.addEventListener('touchmove', function(e) {
    if (isSeeking) seekTo(e, this);
});
document.addEventListener('touchend', function() {
    isSeeking = false;
});

audio.ontimeupdate = () => {
    if (audio.duration) {
        progress.style.width = (audio.currentTime / audio.duration) * 100 + '%';
    }
};
audio.onended = () => {
    nextBtn.onclick();
};
volumeSlider.oninput = (e) => {
    audio.volume = e.target.value;
};

// Search functionality (filters playlist)
searchInput.addEventListener('input', function() {
    const q = this.value.trim().toLowerCase();
    if (q === "") {
        filteredPlaylistIndexes = null;
        renderPlaylist();
        return;
    }
    filteredPlaylistIndexes = playlistData.map((song, i) => ({ song, i }))
        .filter(({ song }) =>
            song.title.toLowerCase().includes(q) ||
            song.artist.toLowerCase().includes(q)
        )
        .map(({ i }) => i);
    renderPlaylist();
});

// Filter by artist (filters playlist)
function filterByArtist(artistName) {
    filteredPlaylistIndexes = playlistData.map((song, i) => ({ song, i }))
        .filter(({ song }) => song.artist === artistName)
        .map(({ i }) => i);
    renderPlaylist();
}

// Carousel scroll helper
function scrollCarousel(container, direction) {
    const scrollAmount = 200;
    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Attach carousel arrows after DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('popSongsLeft').onclick = () => {
        const container = document.getElementById('popular-songs');
        scrollCarousel(container, -1);
    };
    document.getElementById('popSongsRight').onclick = () => {
        const container = document.getElementById('popular-songs');
        scrollCarousel(container, 1);
    };
    document.getElementById('popArtistsLeft').onclick = () => {
        const container = document.getElementById('popular-artists');
        scrollCarousel(container, -1);
    };
    document.getElementById('popArtistsRight').onclick = () => {
        const container = document.getElementById('popular-artists');
        scrollCarousel(container, 1);
    };
});

// Initial Render
renderPlaylist();
renderPopularSongs();
renderPopularArtists();
loadTrack(0);
