import { DLRLineResult } from 'dynamsoft-label-recognizer';
import './App.css'
import MRZScanner from './component/MRZScanner'
import { useState } from 'react';

function App() {
  const [scanning, setScanning] = useState(false);
  const [MRZLineResults, setMRZLineResults] = useState<DLRLineResult[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const showConfirmationModal = (results:DLRLineResult[]) => {
    if (scanning === true) {
      setScanning(false);
      setShowModal(true);
      setMRZLineResults(results);
    }
  }

  const MRZString = () => {
    let str = "";
    for (let index = 0; index < MRZLineResults.length; index++) {
      const lineResult = MRZLineResults[index];
      str = str + lineResult.text;
      if (index != MRZLineResults.length - 1) {
        str = str + "\n";
      }
    }
    return str;
  }

  const correct = () => {
    setShowModal(false);
    setShowScanner(false);
  }

  const rescan = () => {
    setShowModal(false);
    setScanning(true);
  }

  const startScanner = () => {
    setScanning(true);
    setShowScanner(true);
  }
  return (
    <div>
      {!showScanner &&
        <>
          <h2>MRZ Scanner</h2>
          <button onClick={()=>startScanner()}>Start Scanning MRZ</button>
          {MRZLineResults.length>0 &&
            <pre>{MRZString()}</pre>
          }
        </>
      }
      {showScanner && 
        <MRZScanner
          scanning={scanning}
          hideSelect={true}
          onScanned={(results)=>(showConfirmationModal(results))}
        >
          {showModal && 
            <div className="confirmation-modal">
              <div className="overflow">
                <pre>{MRZString()}</pre>
              </div>
              <button onClick={()=>correct()}>Correct</button>
              <button onClick={()=>rescan()} >Rescan</button>
            </div>
          }
          <button className="close-button" onClick={()=>setScanning(false)}>Close</button>
        </MRZScanner>
      }
    </div>
  )
}

export default App
