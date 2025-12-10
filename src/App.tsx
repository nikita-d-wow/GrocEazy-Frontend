import './App.css';

function App() {
  const check = () => {
    // console.log('check console logs on commit');
  };
  return (
    <>
      <button
        onClick={check}
        className="text-5xl text-center text-primary my-40"
      >
        GROCEAZY
      </button>
    </>
  );
}

export default App;
