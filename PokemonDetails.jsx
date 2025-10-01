import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPokemonByName } from "../services/api";

export default function PokemonDetails() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPokemonByName(name)
      .then((res) => setPokemon(res.data))
      .finally(() => setLoading(false));
  }, [name]);

  if (loading) return <p style={{ textAlign: "center" }}>Carregando...</p>;
  if (!pokemon)
    return <p style={{ textAlign: "center" }}>Pokémon não encontrado!</p>;

  return (
    <div className="details-container">
      <h2>{pokemon.name.toUpperCase()}</h2>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <p>Altura: {pokemon.height}</p>
      <p>Peso: {pokemon.weight}</p>
      <p>Tipos: {pokemon.types.map((t) => t.type.name).join(", ")}</p>
      <Link to="/">Voltar</Link>
    </div>
  );
}
