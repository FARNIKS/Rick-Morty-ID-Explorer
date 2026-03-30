import "./App.css"; // Cambié index por App por convención
import { useEffect, useState } from "react";

function App() {
  // 1. Inicializa como null si es un solo objeto, ayuda a las validaciones
  const [character, setCharacter] = useState(null);
  const [characterId, setCharacterId] = useState(1);
  const [debouncedCharacterId, setDebouncedCharacterId] = useState(1);

  // 2. Mueve la función dentro de un useEffect o pásale el ID por parámetro
  const getCharacters = (id) => {
    if (!id) return; // Seguridad extra

    fetch(`https://rickandmortyapi.com/api/character/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Personaje no encontrado");
        }
        return response.json();
      })
      .then((data) => {
        setCharacter(data); // Aquí llega el personaje real
      })
      .catch((error) => {
        console.log("Error:", error.message);
        setCharacter(null); // Limpiamos el estado para que se active el mensaje de error
      });
  };

  // LÓGICA DEL DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => {
      // Solo actualizamos si hay un ID válido
      if (characterId > 0) {
        setDebouncedCharacterId(characterId);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [characterId]);

  // LÓGICA DEL FETCH (Se dispara cuando el debounce termina)
  useEffect(() => {
    getCharacters(debouncedCharacterId);
  }, [debouncedCharacterId]);

  return (
    <div className="container">
      <h1>Rick and Morty Explorer</h1>
      <input
        type="number"
        value={characterId || ""}
        min="1"
        max="826"
        onChange={(e) => setCharacterId(Number(e.target.value))}
      />

      {/* 3. RENDERIZADO CONDICIONAL: Solo muestra la card si hay datos */}
      {character && character.name ? (
        <div className="card">
          <h2>{character.name}</h2>
          <img src={character.image} alt={character.name} />
          <p>
            <b>Status:</b> {character.status}
          </p>
          <p>
            <b>Species:</b> {character.species}
          </p>
          {/* Uso de Optional Chaining para evitar errores si la propiedad no existe */}
          <p>
            <b>Origin:</b> {character.origin?.name}
          </p>
          <p>
            <b>Location:</b> {character.location?.name}
          </p>
        </div>
      ) : (
        <div>
          <p>
            Ingrese otro dato ese no existe en la API solo hay characters del 1
            al 826
          </p>
          <div>
            <img
              src="https://i.pinimg.com/736x/9a/96/41/9a96412268b77bb6e87e9d429ecc5c56.jpg"
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
