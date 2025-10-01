import { useState, useEffect } from "react";
import { getPokemons, getPokemonByName } from "../services/api";
import CardPokemon from "../components/CardPokemon";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [allPokemonNames, setAllPokemonNames] = useState([]);
  const navigate = useNavigate();
  const limit = 20;

  // Carrega todos os nomes de Pokémon para a busca dinâmica
  useEffect(() => {
    const fetchAllNames = async () => {
      try {
        const res = await getPokemons(1118, 0); // total de Pokémon
        setAllPokemonNames(res.data.results.map((p) => p.name));
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllNames();
  }, []);

  // Função para buscar a lista da página atual
  const fetchPokemons = async () => {
    try {
      setLoading(true);
      const res = await getPokemons(limit, page * limit);
      const results = await Promise.all(
        res.data.results.map(async (p) => {
          const data = await getPokemonByName(p.name);
          return {
            name: data.data.name,
            image: data.data.sprites.front_default,
          };
        })
      );
      setPokemons(results);
    } catch (err) {
      console.error(err);
      setPokemons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search) fetchPokemons();
  }, [page, search]);

  // Função para busca dinâmica por nome ou id
  const handleSearch = async (e) => {
    const value = e.target.value.toLowerCase().trim();
    setSearch(value);

    if (value === "") {
      fetchPokemons(); // volta para a lista paginada
    } else {
      try {
        setLoading(true);
        let results = [];

        // Se for número, busca pelo ID diretamente
        if (!isNaN(value)) {
          try {
            const res = await getPokemonByName(value);
            results = [
              { name: res.data.name, image: res.data.sprites.front_default },
            ];
          } catch {
            results = [];
          }
        } else {
          // Busca dinâmica por nome (começa com)
          const filteredNames = allPokemonNames.filter((name) =>
            name.startsWith(value)
          );
          results = await Promise.all(
            filteredNames.slice(0, 20).map(async (name) => {
              const data = await getPokemonByName(name);
              return {
                name: data.data.name,
                image: data.data.sprites.front_default,
              };
            })
          );
        }

        setPokemons(results);
      } catch (err) {
        setPokemons([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      {/* Input de busca */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          className="search-input"
          type="text"
          placeholder="Buscar Pokémon"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Loading */}
      {loading && <p style={{ textAlign: "center" }}>Carregando...</p>}

      {/* Mensagem de erro */}
      {!loading && pokemons.length === 0 && (
        <p style={{ textAlign: "center" }}>Nenhum Pokémon encontrado.</p>
      )}

      {/* Cards */}
      <div className="cards-container">
        {pokemons.map((p) => (
          <CardPokemon
            key={p.name}
            name={p.name}
            image={p.image}
            onClick={() => navigate(`/pokemon/${p.name}`)}
          />
        ))}
      </div>

      {/* Paginação só aparece se não estiver buscando */}
      {!search && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            Anterior
          </button>
          <button onClick={() => setPage(page + 1)}>Próxima</button>
        </div>
      )}
    </div>
  );
}
