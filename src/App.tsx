import './App.css'
import MRZScanner from './component/MRZScanner'
import { useState } from 'react';

function App() {
  const [scanning, setScanning] = useState(false);
  return (
    <div>
      {!scanning &&
        <>
          <h2>MRZ Scanner</h2>
          <button onClick={()=>setScanning(true)}>Start Scanning MRZ</button>
        </>
      }
      {scanning && 
        <MRZScanner
          onScanned={(results)=>(console.log(results))}
        ></MRZScanner>
      }
    </div>
  )
}

export default App
