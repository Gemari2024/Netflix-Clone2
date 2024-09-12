import React, { useEffect, useState } from "react";
import "./row.css";
import axios from "../../../utils/axios";
import movieTrailer from "movie-trailer";
// import YouTube from "@mui/icons-material/YouTube";
import YouTube from "react-youtube";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const base_url = "https://image.tmdb.org/t/p/original";

  useEffect(() => {
    (async () => {
      try {
        // console.log(fetchUrl);
        const request = await axios.get(fetchUrl);
        // console.log(request);
        setMovies(request.data.results);
      } catch (error) {
        console.log("error", error);
      }
    })();
  }, [fetchUrl]);
  const handleClick = (movies) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movies?.title || movies?.name || movies?.original_name).then(
        (url) => {
          console.log(url);
          const urlParams = new URLSearchParams(new URL(url).search);
          console.log(urlParams);
          console.log(urlParams.get("v"));
          setTrailerUrl(urlParams.get("v"));
        }
      );
    }
  };
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };
  return (
    <>
      <div className="row">
        <h1>{title}</h1>
        <div className="row_posters">
          {movies?.map((movie, index) => {
            const imagePath = isLargeRow
              ? movie.poster_path
              : movie.backdrop_path;
            return imagePath ? (
              <img
                onClick={() => handleClick(movie)}
                key={index}
                src={`${base_url}${imagePath}`}
                alt={movie.name || "movie image"}
                className={`row_poster ${isLargeRow && "row_posterLarge"}`}
              />
            ) : null;
          })}
        </div>
        <dive style={{ padding: "40px" }}>
          {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </dive>
      </div>
    </>
  );
}

export default Row;
