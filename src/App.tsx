import { DLRLineResult } from 'dynamsoft-label-recognizer';
import './App.css'
import MRZScanner from './component/MRZScanner'
import { useState } from 'react';

function App() {
  const [scanning, setScanning] = useState(false);
  const [MRZLineResults, setMRZLineResults] = useState<DLRLineResult[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const showConfirmationModal = (results:DLRLineResult[]) => {
    if (scanning === true) {
      setConfirmed(false);
      setScanning(false);
      setShowConfirmation(true);
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
    setConfirmed(true);
    setShowConfirmation(false);
    setShowScanner(false);
  }

  const rescan = () => {
    setShowConfirmation(false);
    setScanning(true);
  }

  const startScanner = () => {
    setShowConfirmation(false);
    setScanning(true);
    setShowScanner(true);
  }

  const stopScanner = () => {
    setScanning(false);
    setShowScanner(false);
  }
  return (
    <div>
      {!showScanner &&
        <>
          <h2>MRZ Scanner</h2>
          <button onClick={()=>startScanner()}>Start Scanning MRZ</button>
          {confirmed && MRZLineResults.length>0 &&
            <pre>{MRZString()}</pre>
          }
          <div style={{marginTop:"20px"}}>Powered by <a target="_blank" href="https://www.dynamsoft.com/label-recognition/overview/">Dynamsoft Label Recognizer</a></div>
        </>
      }
      {showScanner && 
        <MRZScanner
          scanning={scanning}
          onResourcesLoadStarted={()=>setShowProgress(true)}
          onResourcesLoadProgress={(_resourcesPath,_progress)=>{
            const percent = (_progress.loaded/_progress.total*100).toFixed(2);
            setProgress(parseInt(percent));
          }}
          onResourcesLoaded={()=>{
            setShowProgress(false);
            setProgress(0);
          }}
          onScanned={(results)=>(showConfirmationModal(results))}
        >
          {showConfirmation && 
            <div className="confirmation modal">
              <pre>
                {MRZString()}
              </pre>
              <button onClick={()=>correct()}>Correct</button>
              <button onClick={()=>rescan()} >Rescan</button>
            </div>
          }
          {showProgress && 
            <div className="progress modal">
              <div>Loading the model...</div>
              <div>
                Progress: <span>{progress}</span>%
              </div>
            </div>
          }
          <button className="close-button" onClick={()=>stopScanner()}>Close</button>
        </MRZScanner>
      }
    </div>
  )
}

export default App
