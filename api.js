import axios from "axios";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

export const getPokemons = (limit = 20, offset = 0) =>
  api.get(`/pokemon?limit=${limit}&offset=${offset}`);

export const getPokemonByName = (name) => api.get(`/pokemon/${name}`);
