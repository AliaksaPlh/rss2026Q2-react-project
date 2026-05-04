import { SearchBar } from './components/SearchBar/SearchBar';
import './App.css';

function App() {
  return (
    <>
      <section id="center">
        <SearchBar
          value={''}
          onChange={() => {}}
          onSearch={() => {
            alert('Search button clicked!');
          }}
        />
      </section>

      <div className="ticks"></div>

      <section id="next-steps"> </section>

      <div className="ticks"></div>
    </>
  );
}

export default App;
