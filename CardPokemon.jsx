export default function CardPokemon({ name, onClick, image }) {
  return (
    <div className="card" onClick={onClick}>
      {image && <img src={image} alt={name} />}
      <h3>{name.toUpperCase()}</h3>
    </div>
  );
}
