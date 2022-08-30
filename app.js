//todo /get  fetch links with tmdb
const API_KEY = "api_key=88e18d90b805a325569e2f4e56712629";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
//?gener
const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];
var selectedGenre = [];
//?image url
const IMG_URL = "https://image.tmdb.org/t/p/w500/";
//?search
// https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher
const SARCH_URL = BASE_URL + "/search/movie?" + API_KEY;
const form = document.getElementById("form");
const search = document.getElementById("search");
//?select main id
const main = document.getElementById("main");
//?tags
const tagsEl = document.getElementById("tags");
//?body
const body = document.querySelector("body");
//? prev and next
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = "";
var totalPage = 100;

//todo/ fitch API
const getMovies = (url) => {
  lastUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      if (data.results.length !== 0) {
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPage = data.total_pages;

        current.innerText = currentPage;

        if (currentPage <= 1) {
          prev.classList.add("disabled");
          next.classList.remove("disabled");
        } else if (currentPage >= totalPage) {
          prev.classList.remove("disabled");
          next.classList.add("disabled");
        } else {
          prev.classList.remove("disabled");
          next.classList.remove("disabled");
        }

        body.scrollIntoView({ behavior: "smooth" });
      } else {
        main.innerHTML = `<h1 class="noresult">NO RESULTS FOUND 😐</h1>`;
      }
    });
};

getMovies(API_URL);
//todo search
form.addEventListener("submit", (e) => {
  e.preventDefault(); //Clicking on a "Submit" button, prevent it from submitting a form

  const searchTerm = search.value;
  if (searchTerm) {
    getMovies(SARCH_URL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
});
//todo print fitched data in html
const showMovies = (data) => {
  main.innerHTML = " ";

  data.forEach((movie) => {
    const { overview, poster_path, title, vote_average, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
    <img src="${
      poster_path
        ? IMG_URL + poster_path
        : "https://th.bing.com/th/id/OIP.gexn4tTOVSHiFD7d1xXrkgHaE8?pid=ImgDet&rs=1"
    }" alt="${title}" class="movie-img">
                <div class="info">
                    <span>${title}</span>
                    <span class="span ${getColor(
                      vote_average
                    )}">${vote_average}%</span>
                </div>
                <div class="overview">
                    <h3>Overview</h3>
                    <p>${overview}</p>
                    
                  <button class="button-86" id="${id}">Know more</button>


                </div>
    
    
    `;

    main.appendChild(movieEl);

    document.getElementById(id).addEventListener("click", () => {
      console.log(id);
      openNav(movie);
    });
  });
};
//todo chang color in vote
const getColor = (vote) => {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
};

//todo overlay fullscreen
const overlayContent = document.getElementById("overlay-content");

function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + "/movie/" + id + "/videos?" + API_KEY)
    .then((res) => res.json())
    .then((videoData) => {
      console.log(videoData);
      if (videoData) {
        document.getElementById("myNav").style.transform = "scale(1)";
        if (videoData.results.length > 0) {
          var embed = [];
          var dots = [];
          videoData.results.forEach((video, idx) => {
            let { key, name, site } = video;
            if (site == "YouTube") {
              embed.push(`
              
              <iframe width="560" height="315" 
        src="https://www.youtube.com/embed/${key}" 
        title="${name}" class="embed hide" frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write;
         encrypted-media;
         gyroscope; picture-in-picture" allowfullscreen></iframe>
              
        `);

              dots.push(`
              <span class="dot">${idx + 1}</span>
              `);
            }
          });

          var content = `
          <h1 class="noresultt">${movie.original_title}</h1>
          <br/>
          ${embed.join(" ")}
          <br/>
          <div class="dots">${dots.join("")}</div>
          
          `;
          overlayContent.innerHTML = content;
          activeSlide = 0;
          showVideos();
        }
      } else {
        overlay.innerHTML = `<h1 class="noresultt">NO RESULTS FOUND 😐</h1>`;
      }
    });
}

function closeNav() {
  document.getElementById("myNav").style.transform = "scale(0)";
}

var activeSlide = 0;
var totalVideos = 0;

const showVideos = () => {
  let embedClasses = document.querySelectorAll(".embed");
  let dots = document.querySelectorAll(".dot");
  totalVideos = embedClasses.length;

  embedClasses.forEach((embedTag, idx) => {
    if (activeSlide == idx) {
      embedTag.classList.add("show");
      embedTag.classList.remove("hide");
    } else {
      embedTag.classList.remove("show");
      embedTag.classList.add("hide");
    }
  });

  dots.forEach((dot, indx) => {
    if (activeSlide == indx) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
};

const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

leftArrow.addEventListener("click", () => {
  if (activeSlide > 0) {
    activeSlide--;
  } else {
    activeSlide = totalVideos - 1;
  }

  showVideos();
});

rightArrow.addEventListener("click", () => {
  if (activeSlide < totalVideos - 1) {
    activeSlide++;
  } else {
    activeSlide = 0;
  }
  showVideos();
});

//todo catigoures
const setGenre = () => {
  // tagsEl.innerHTML = "";
  genres.forEach((genre) => {
    const t = document.createElement("div");
    t.classList.add("tag");
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener("click", () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));
      highlights();
      //end of event clicked
    });
    tagsEl.append(t);
  });
  //end of function
};
setGenre();
//? color the buttons tag when clicking on it
const highlights = () => {
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    tag.classList.remove("highlight");
  });

  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      const highlightedtag = document.getElementById(id);
      highlightedtag.classList.add("highlight");
    });
  }
};

//todo get the next page
next.addEventListener("click", () => {
  if (nextPage <= totalPage) {
    pageCall(nextPage);
  }
});

const pageCall = (page) => {
  let urlSplite = lastUrl.split("?");
  let queryParams = urlSplite[1].split("&");
  let key = queryParams[queryParams.length - 1].split("=");
  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join("&");
    let url = urlSplite[0] + "?" + b;
    getMovies(url);
  }
};

//!--end

//todo get prevuse page
prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});
