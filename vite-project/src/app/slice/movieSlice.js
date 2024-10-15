import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch movies from an API
export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (query = "", { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=31d1f9d8c5cb22c824d8adbd323c5632&query=${query}`
      );
      return response.data.results;
    } catch (error) {
      return rejectWithValue({
        error: `No Search for this Keyword => ${query}`,
      });
    }
  }
);

const loadFavoritesFromLocalStorage = () => {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
};

const saveFavoritesToLocalStorage = (favorites) => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};
const initialState = {
  movies: [],
  isLoading: false,
  error: "",
  favorites: loadFavoritesFromLocalStorage(),
  movieDetails:{}
};


const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    addFav: (state, action) => {
      const movie = action.payload;
      const isFavorite = state.favorites.some((fav) => fav.id === movie.id);
      if (isFavorite) {
        //remove if fav exists
        state.favorites = state.favorites.filter((fav) => fav.id !== movie.id);
      } else {
        //else add fav
        state.favorites.push(movie);
      }
      saveFavoritesToLocalStorage(state.favorites);
    },
    addDetails:(state,action)=>{
        
        state.movieDetails=action.payload
        
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.error = action.payload.error;
        state.isLoading = false;
        state.movies = [];
      });
  },
});

export const { addFav,addDetails } = moviesSlice.actions;
export default moviesSlice.reducer;
