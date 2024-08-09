import { useEffect, useState } from 'react';
import './App.css';
import Card from './components/Card/Card';
import { getAllPokemon, getPokemon } from './utils/pokemon';
import Navbar from './components/Navbar/Navbar';

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState('');
  const [prevURL, setPrevURL] = useState('');


  // ブラウザロード時に一回だけ呼び出す⇒第二引数は空の配列
  useEffect(() => {
    const fetchPokemonData = async () => {
      // 全てのポケモンデータを取得（するまで待ってもらう）
      let res = await getAllPokemon(initialURL);
      // 各ポケモンの詳細なデータを取得
      loadPokemon(res.results);
      console.log(res.next);
      // 自動的に次の20匹のURLを設定
      setNextURL(res.next);
      // 最初はnullだから条件分岐必要
      setPrevURL(res.previous);
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  // data：処理前の全てのポケモンのデータ
  // pending：まだ全データを取ってこれていない⇒async, awaitをつける
  const loadPokemon = async (data) => {
    // ポケモンそれぞれのURLを取ってくる（のが終わるまで待つ）
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        // console.log(pokemon);
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  // console.log(pokemonData);

  const handlePrevPage = async () => {
    if (!prevURL) {
      return;
    } else {
    setLoading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
    }
  }

  const handleNextPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    console.log(data);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中・・・</h1>
        ) : (
          <>
            <div className='pokemonCardContainer'>
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon}></Card>
              })}
            </div>
            <div className='btn'>
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default App;
