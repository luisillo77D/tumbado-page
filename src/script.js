let sliderInner = document.querySelector(".slider-inner");

let images = sliderInner.querySelectorAll("img");

let index = 1;

setInterval(function () {
  let percent = index * -100;
  sliderInner.style.transform = `translateX(${percent}%)`;
  index++;
  if (index === images.length) {
    index = 0;
  }
}, 2000);

const clientId = "5f49bb2bd6d24e96a3cbfdeffb9071f8";
const clientSecret = "b579f422e44f4b289ec5cecb40e1d208";

// Función para obtener un token de acceso
async function obtenerTokenAcceso() {
  const respuesta = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const datos = await respuesta.json();
  console.log(datos);
  return datos.access_token;
}

// Función para obtener los álbumes de un artista
async function obtenerAlbumes(idArtista, tokenAcceso) {
  const respuesta = await fetch(
    `https://api.spotify.com/v1/artists/${idArtista}/albums?include_groups=album`,
    {
      headers: {
        Authorization: "Bearer " + tokenAcceso,
      },
    }
  );
  const datos = await respuesta.json();
  return datos.items;
}

async function obtenerCanciones(idAlbum, tokenAcceso) {
  const respuesta = await fetch(
    `https://api.spotify.com/v1/albums/${idAlbum}/tracks`,
    {
      headers: {
        Authorization: "Bearer " + tokenAcceso,
      },
    }
  );
  const datos = await respuesta.json();
  return datos.items;
}

async function obtenerTopCanciones(idArtista, tokenAcceso) {
  const respuesta = await fetch(
    `https://api.spotify.com/v1/artists/${idArtista}/top-tracks?market=MX`,
    {
      headers: {
        Authorization: "Bearer " + tokenAcceso,
      },
    }
  );
  const datos = await respuesta.json();
  return datos.tracks;
}

async function obtenerIconicTracks(tracks, tokenAcceso) {
  const respuesta = await fetch(
    `https://api.spotify.com/v1/tracks?ids=${tracks.join(",")}`,
    {
      headers: {
        Authorization: "Bearer " + tokenAcceso,
      },
    }
  );
  const datos = await respuesta.json();
  return datos.tracks;
}

// ID del artista
const idArtista = "0elWFr7TW8piilVRYJUe4P";
let accessToken;
const tracks = [
  "5NCBP3ivrIDcHEtzHSW3k0",
  "4QcFr52iHF3tqlPRdXjRF6",
  "5HD1VkxQlGGEXhwQ2REBY2",
  "3MP9oRQ2LVNzgzgS1aRU2d",
  "3dfU4Gby9MXckEQVa68TDC",
  "0sOU3cHMpAG7FvJGFwChSD",
  "7rp5s1fEFuu42FoeHrrPyx",
  "71YaqakPUZh3cnMYmuE5Oh",
];

// Obtener el token de acceso
obtenerTokenAcceso().then((tokenAcceso) => {
  // Obtener los álbumes del artista
  accessToken = tokenAcceso;
  obtenerAlbumes(idArtista, tokenAcceso).then((albumes) => {
    // Mostrar la información de los álbumes
    console.log(albumes);

    const listaAlbumes = document
      .getElementById("albumes-artista")
      .querySelector("ul");
    listaAlbumes.innerHTML = "";

    for (const album of albumes) {
      const itemAlbum = document.createElement("li");
      itemAlbum.classList.add(
        "bg-slate-200",
        "hover:bg-slate-600",
        "hover:text-slate-200",
        "duration-500",
        "pb-4",
        "rounded-lg",
        "shadow-md",
        "shadow-slate-300",
        "mb-4",
        "relative",
        "transition",
        "transform",
        "duration-500",
        "ease-in-out",
        "hover:scale-105"
      );

      // divs para la parte de enfrente y atras del album
      const albumFront = document.createElement("div");
      albumFront.classList.add("flex", "items-center", "flex-col");

      const albumBack = document.createElement("div");
      albumBack.classList.add(
        "hidden",
        "rounded-lg",
        "flex",
        "items-center",
        "bg-gray-100",
        "bg-opacity-10",
        "overflow-auto",
        "pl-4",
        "pt-4"
      );

      // parte de enfrente del album
      const albumCover = document.createElement("img");
      albumCover.src = `${album.images[0].url}`;
      albumCover.alt = `${album.name}`;
      albumCover.classList.add("album-cover", "rounded-t-lg", "shadow-lg");
      albumFront.appendChild(albumCover);

      const albumInfo = document.createElement("div");
      albumInfo.classList.add(
        "album-info",
        "flex",
        "flex-col",
        "w-full",
        "justify-center",
        "text-center",
        "p-4"
      );
      const albumTitle = document.createElement("h3");
      albumTitle.classList.add("text-3xl", "py-2");
      albumTitle.textContent = album.name;
      albumInfo.appendChild(albumTitle);

      const albumMini = document.createElement("div");
      albumMini.classList.add("flex", "justify-between", "pt-4");

      const yearAndTracks = document.createElement("div");
      yearAndTracks.classList.add(
        "flex",
        "justify-around",
        "flex-col",
        "text-start",
        "gap-4"
      );

      const albumYear = document.createElement("span");
      albumYear.classList.add("album-year");
      albumYear.textContent = album.release_date.split("-")[0];
      const albumCanciones = document.createElement("span");
      albumCanciones.classList.add("album-canciones");
      albumCanciones.textContent = `${album.total_tracks} canciones`;
      yearAndTracks.appendChild(albumYear);
      yearAndTracks.appendChild(albumCanciones);
      albumMini.appendChild(yearAndTracks);

      const albumLink = document.createElement("a");
      albumLink.href = album.external_urls.spotify;
      albumLink.target = "_blank";
      albumLink.textContent = "Escuchar en Spotify";
      albumLink.classList.add(
        "bg-green-600",
        "hover:bg-green-800",
        "duration-500",
        "p-2",
        "rounded-full",
        "text-white",
        "transition",
        "transform",
        "duration-1000",
        "ease-in-out",
        "text-center",
        "flex",
        "items-center",
        "text-wrap",
        "w-1/2"
      );
      albumMini.appendChild(albumLink);
      albumInfo.appendChild(albumMini);

      albumFront.appendChild(albumInfo);

      // parte de atras del album con la tracklist
      const songList = document.createElement("div");
      songList.classList.add("cancion-lista", "flex", "flex-col");

      obtenerCanciones(album.id, tokenAcceso).then((canciones) => {
        for (const cancion of canciones) {
          const songItem = document.createElement("div");
          songItem.classList.add("cancion");

          const songNumberAndTitle = document.createElement("span");
          songNumberAndTitle.classList.add("text-md");
          songNumberAndTitle.textContent = `${cancion.track_number}. ${cancion.name}`;

          const songDuration = document.createElement("span");
          songDuration.classList.add("text-sm");
          let duracion = (cancion.duration_ms / 60000).toFixed(2);
          songDuration.textContent = ` ${duracion} min`;

          songItem.appendChild(songNumberAndTitle);
          songItem.appendChild(songDuration);
          // songItem.appendChild(songAudio);
          //songItem.appendChild(audioError);

          songList.appendChild(songItem);
        }
      });

      albumBack.appendChild(songList);

      itemAlbum.appendChild(albumFront);
      itemAlbum.appendChild(albumBack);

      let isAlbumClickEnabled = true;

      // Agregar el evento de clic al elemento itemAlbum
      itemAlbum.addEventListener("click", () => {
        if (isAlbumClickEnabled) {
          itemAlbum.classList.toggle("animate-flip-out-x");
          setTimeout(() => {
            itemAlbum.classList.toggle("animate-flip-out-x");
            itemAlbum.classList.toggle("animate-flip-in-x");
            albumFront.classList.toggle("hidden");
            albumBack.classList.toggle("hidden");
          }, 250);
        }
      });

      // Agregar el evento de clic al enlace albumLink
      albumLink.addEventListener("click", (event) => {
        event.preventDefault();
        isAlbumClickEnabled = false;
        window.open(albumLink.href, "_blank");
        // Volver a habilitar el evento clic del itemAlbum después de un breve retraso
        setTimeout(() => {
          isAlbumClickEnabled = true;
        }, 500);
      });

      listaAlbumes.appendChild(itemAlbum);
    }
  });

  obtenerTopCanciones(idArtista, tokenAcceso).then((canciones) => {
    console.log(canciones);
    const listaCanciones = document.getElementById("top-tracks-list");
    listaCanciones.innerHTML = "";

    for (const cancion of canciones) {
      const itemCancion = document.createElement("li");
      itemCancion.classList.add(
        "w-full", 
        "bg-slate-200",
        "hover:bg-slate-600",
        "hover:text-slate-200",
        "duration-500",
        "rounded-lg",
        "shadow-md",
        "shadow-slate-300",
        "mb-4",
        "relative",
        "transition",
        "transform",
        "duration-500",
        "ease-in-out",
        "hover:scale-105",
        "md:w-2/3",
        "overflow-hidden",
        "text-justify",
        "text-wrap"
      );

      const cancionFront = document.createElement("div");
      cancionFront.classList.add("flex", "items-center");

      const cancionCover = document.createElement("img");
      cancionCover.src = `${cancion.album.images[2].url}`;
      cancionCover.alt = `${cancion.name}`;

      cancionCover.classList.add("album-cover", "rounded-l-lg", "shadow-lg");
      cancionFront.appendChild(cancionCover);

      const cancionInfo = document.createElement("div");
      cancionInfo.classList.add(
        "album-info",
        "flex",
        "gap-4",
        "w-full",
        "justify-around",
        "text-left",
        "px-4"
      );
      const conteinerSingerTitle = document.createElement("div");
      conteinerSingerTitle.classList.add(
        "flex",
        "items-start",
        "flex-col",
        "w-3/4",
        "justify-start",
        "text-left"
      );

      const cancionSingers = document.createElement("span");
      cancionSingers.classList.add("text-sm");
      //agregar todos los artistas de la cancion
      for (const artista of cancion.artists) {
        //agregar una coma si no es el ultimo artista
        if (cancion.artists.indexOf(artista) !== cancion.artists.length - 1) {
          cancionSingers.textContent += `${artista.name}, `;
        } else {
          cancionSingers.textContent += `${artista.name}`;
        }
      }

      const cancionTitle = document.createElement("h3");
      cancionTitle.classList.add("text-lg");
      cancionTitle.textContent = cancion.name;
      conteinerSingerTitle.appendChild(cancionTitle);
      conteinerSingerTitle.appendChild(cancionSingers);
      cancionInfo.appendChild(conteinerSingerTitle);

      const cancionMini = document.createElement("div");
      cancionMini.classList.add(
        "flex",
        "justify-between",
        "items-center",
        "w-1/4"
      );

      const cancionYear = document.createElement("span");
      cancionYear.classList.add("album-year", "text-lg");
      cancionYear.textContent = cancion.album.release_date.split("-")[0];
      cancionMini.appendChild(cancionYear);

      cancionFront.appendChild(cancionInfo);

      const audioPlayer = document.createElement("audio");
      audioPlayer.src = cancion.preview_url;
      //setear el atributo de volumen a la mitad
      audioPlayer.volume = 0.2;
      audioPlayer.controls = false;
      audioPlayer.classList.add("hidden");

      const cancionLink = document.createElement("img");
      cancionLink.src = "img/play.png";
      cancionLink.alt = "Reproducir";
      cancionLink.style.width = "50px";
      cancionLink.style.height = "50px";
      cancionLink.classList.add(
        "btn-play-track",
        "bg-green-600",
        "hover:bg-green-800",
        "duration-500",
        "p-2",
        "rounded-full",
        "text-white",
        "transition",
        "transform",
        "duration-1000",
        "ease-in-out",
        "text-center",
        "flex",
        "items-center",
        "text-wrap",
        "cursor-pointer"
      );
      cancionMini.appendChild(cancionLink);
      cancionMini.appendChild(audioPlayer);
      cancionInfo.appendChild(cancionMini);
      itemCancion.appendChild(cancionFront);
      listaCanciones.appendChild(itemCancion);

      let isSongClickEnabled = true;

      cancionLink.addEventListener("click", () => {
        if (isSongClickEnabled) {
          if (audioPlayer.paused) {
            //pausar todas las canciones antes de reproducir una nueva
            const canciones = document.querySelectorAll("audio");
            for (const cancion of canciones) {
              cancion.pause();
            }
            const botones = document.querySelectorAll(".btn-play-track");
            for (const boton of botones) {
              boton.src = "img/play.png";
            }
            audioPlayer.play();
            cancionLink.src = "img/pause.png";
          } else {
            audioPlayer.pause();
            cancionLink.src = "img/play.png";
          }
        }
      });

      audioPlayer.addEventListener("ended", () => {
        cancionLink.src = "img/play.png";
      });
    }
  });

  obtenerIconicTracks(tracks, tokenAcceso).then((tracks) => {
    console.log(tracks);
    const listaTracks = document.getElementById("iconic-tracks-list");
    listaTracks.innerHTML = "";

    for (const track of tracks) {
      const itemTrack = document.createElement("div");
      itemTrack.classList.add(
        "item-track",
        "bg-slate-200",
        "text-zinc-900",
        "rounded-lg",
        "shadow-md",
        "shadow-slate-300",
        "pb-4",
        "md:w-full",
        "overflow-hidden",
        "text-justify",
        "text-wrap",
      );

      const trackFront = document.createElement("div");
      trackFront.classList.add("flex", "items-center", "flex-col");

      const trackCover = document.createElement("img");
      trackCover.src = `${track.album.images[0].url}`;
      trackCover.alt = `${track.name}`;

      trackCover.classList.add(
        "album-cover",
        "rounded-lg",
        "shadow-lg",
        "w-11/12",
        "mt-4"
      );
      trackFront.appendChild(trackCover);

      const trackInfo = document.createElement("div");
      trackInfo.classList.add(
        "album-info",
        "flex",
        "gap-4",
        "w-full",
        "justify-start",
        "text-left",
        "px-4"
      );
      const containerSingerTitle = document.createElement("div");
      containerSingerTitle.classList.add(
        "flex",
        "items-start",
        "flex-col",
        "w-3/4",
        "justify-start",
        "text-left"
      );

      const trackSingers = document.createElement("span");
      trackSingers.classList.add("text-sm");
      // Agregar todos los artistas de la canción
      for (const artista of track.artists) {
        // Agregar una coma si no es el último artista
        if (track.artists.indexOf(artista) !== track.artists.length - 1) {
          trackSingers.textContent += `${artista.name}, `;
        } else {
          trackSingers.textContent += `${artista.name}`;
        }
      }

      const trackTitle = document.createElement("h3");
      trackTitle.classList.add("text-lg");
      trackTitle.textContent = track.name;
      containerSingerTitle.appendChild(trackTitle);
      containerSingerTitle.appendChild(trackSingers);
      trackInfo.appendChild(containerSingerTitle);
      trackFront.appendChild(trackInfo);
      itemTrack.appendChild(trackFront);

      const audioPlayer = document.createElement("audio");
      audioPlayer.src = track.preview_url;
      // Setear el atributo de volumen a la mitad
      audioPlayer.volume = 0.2;
      audioPlayer.controls = false;
      audioPlayer.classList.add("hidden");
      audioPlayer.addEventListener("ended", () => {
        playButton.src = "img/play.png";
      });

      // Agregar botones "Anterior" y "Siguiente" a cada itemTrack
      const prevButton = document.createElement("img");
      prevButton.src = "img/prev.webp";
      prevButton.classList.add(
        "cursor-pointer",
        "w-14",
        "h-14",
        "rounded-full"
      );
      prevButton.addEventListener("click", () => {
        // Pausar todas las canciones antes de reproducir una nueva
        pauseAllSongs();
        movetoLeft();
      });

      const playButton = document.createElement("img");
      playButton.src = "img/play.png";
      playButton.classList.add(
        "cursor-pointer",
        "w-14",
        "h-14",
        "rounded-full",
        "btn-play-track"
      );

      const nextButton = document.createElement("img");
      nextButton.src = "img/next.webp";
      nextButton.classList.add(
        "cursor-pointer",
        "w-14",
        "h-14",
        "rounded-full"
      );
      nextButton.addEventListener("click", () => {
        movetoRigth();
        // Pausar todas las canciones antes de reproducir una nueva
        pauseAllSongs();
      });

      playButton.addEventListener("click", () => {
        if (audioPlayer.paused) {
          // Pausar todas las canciones antes de reproducir una nueva
          pauseAllSongs();
          audioPlayer.play();
          playButton.src = "img/pause.png";
        } else {
          audioPlayer.pause();
          playButton.src = "img/play.png";
        }
      });

      const buttonsContainer = document.createElement("div");
      buttonsContainer.classList.add("flex", "justify-evenly", "mt-4");
      buttonsContainer.appendChild(audioPlayer);
      buttonsContainer.appendChild(prevButton);
      buttonsContainer.appendChild(playButton);
      buttonsContainer.appendChild(nextButton);
      itemTrack.appendChild(buttonsContainer);

      listaTracks.appendChild(itemTrack);
    }
  });
});

//funcion para pausa todas las canciones y cambiar el icono de play a pause
function pauseAllSongs() {
  const canciones = document.querySelectorAll("audio");
  for (const cancion of canciones) {
    cancion.pause();
  }
  const botones = document.querySelectorAll(".btn-play-track");
  for (const boton of botones) {
    boton.src = "img/play.png";
  }
}

const iconicTracksList = document.getElementById("iconic-tracks-list");
let counter = 0;
let trans = 0;
const totalTracks = tracks.length;
trackPercentage = 100 / totalTracks;

function movetoRigth() {
  if (counter >= totalTracks - 1) {
    trans = 0;
    iconicTracksList.style.transform = `translateX(-${trans}%)`;
    counter = 0;
  } else {
    counter++;
    trans += trackPercentage;
    iconicTracksList.style.transform = `translateX(-${trans}%)`;
  }
}

function movetoLeft() {
  counter--;
  if (counter < 0) {
    counter = totalTracks - 1;
    trans = trackPercentage * counter;
    iconicTracksList.style.transform = `translateX(-${trans}%)`;
  } else {
    trans -= trackPercentage;
    iconicTracksList.style.transform = `translateX(-${trans}%)`;
  }
}
