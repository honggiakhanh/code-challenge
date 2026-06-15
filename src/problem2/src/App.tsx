function App() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h5>Swap</h5>
      <label htmlFor="input-amount">Amount to send</label>
      <input id="input-amount" />

      <label htmlFor="output-amount">Amount to receive</label>
      <input id="output-amount" />

      <button type="submit">CONFIRM SWAP</button>
    </form>
  )
}

export default App
