import ChordProgressionEditor from './components/ChordProgressionEditor/ChordProgressionEditor'
import './App.css'
import { Fretboard } from './components/Fretboard'

function App() {

  return (
    <div className='flex flex-col items-center p-8'>
      <ChordProgressionEditor />
      <Fretboard></Fretboard>
    </div>
  )
}

export default App
