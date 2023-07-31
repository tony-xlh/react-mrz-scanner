import React, { MutableRefObject, ReactNode, useEffect, useRef } from 'react';
import { CameraEnhancer, DrawingItem } from 'dynamsoft-camera-enhancer';
import { DLRLineResult, LabelRecognizer } from 'dynamsoft-label-recognizer';
import './MRZScanner.css';

const defaultDCEEngineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-camera-enhancer@3.3.4/dist/";
const defaultDLRengineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-label-recognizer@2.2.30/dist/";

export interface ScannerProps {
  license?: string;
  dceEngineResourcePath?: string;
  dlrEngineResourcePath?: string;
  children?: ReactNode;
  hideSelect?: boolean;
  scanning:boolean;
  onInitialized?: (dce:CameraEnhancer,dlr:LabelRecognizer) => void;
  onScanned: (results:DLRLineResult[]) => void;
  onResourcesLoadStarted?: () => void;
  onResourcesLoadProgress?: (resourcesPath:string, progress:{loaded: number; total: number;}) => void;
  onResourcesLoaded?: () => void;
}

const MRZScanner = (props:ScannerProps): React.ReactElement => {
  const dce = useRef<CameraEnhancer|null>(null);
  const dlr = useRef<LabelRecognizer|null>(null);
  const licenseSet = useRef(false);
  const container: MutableRefObject<HTMLDivElement|null> = useRef(null);
  useEffect(() => {
    const init = async () => {
      try{
        if (LabelRecognizer.isWasmLoaded() === false && licenseSet.current === false) {
          CameraEnhancer.engineResourcePath = props.dceEngineResourcePath ?? defaultDCEEngineResourcePath;
          LabelRecognizer.engineResourcePath = props.dlrEngineResourcePath ?? defaultDLRengineResourcePath;
          LabelRecognizer.license = props.license ?? "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==";
          licenseSet.current = true;
        }
        LabelRecognizer.onResourcesLoadStarted = () => { 
          if (props.onResourcesLoadStarted) {
            props.onResourcesLoadStarted();
          }
        }
        LabelRecognizer.onResourcesLoadProgress = (resourcesPath, progress)=>{
          if (props.onResourcesLoadProgress) {
            if (resourcesPath && progress) {
              props.onResourcesLoadProgress(resourcesPath,progress);
            }
          }
        };
        LabelRecognizer.onResourcesLoaded = async () => { 
          if (props.onResourcesLoaded) {
            props.onResourcesLoaded();
          }
        }

        dlr.current = await LabelRecognizer.createInstance();
        dce.current = await CameraEnhancer.createInstance();
        await dlr.current.setImageSource(dce.current, {resultsHighlightBaseShapes: DrawingItem});
        await dlr.current.updateRuntimeSettingsFromString("video-mrz");
        await dce.current.setUIElement(container.current as HTMLDivElement);
        dce.current.setVideoFit("cover");
        dlr.current.onMRZRead = async (_txt, results) => {
          props.onScanned(results);
        }
        if (props.scanning) {
          dlr.current.startScanning(true);
        }
        if (props.onInitialized) {
          props.onInitialized(dce.current,dlr.current);
        }
      } catch(ex:any) {
        let errMsg: string;
        if (ex.message.includes("network connection error")) {
          errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
        } else {
          errMsg = ex.message||ex;
        }
        console.error(errMsg);
        alert(errMsg);
      }
    }
    init();
    return () => {
      if (dlr.current && dce.current) {
        dlr.current.destroyContext();
        dce.current.dispose(true);
      }
    }
  }, []);

  useEffect(() => {
    if (dlr.current) {
      if (props.scanning) {
        if ((dlr.current as any)._bPauseScan) {
          dlr.current.resumeScanning();
        }else{
          dlr.current.startScanning(true);
        }
      }else{
        dlr.current.pauseScanning();
      }
    }
  }, [props.scanning]);

  return (
    <div ref={container}>
      <svg className="dce-bg-loading" viewBox="0 0 1792 1792"><path d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z" /></svg>
      <svg className="dce-bg-camera" viewBox="0 0 2048 1792"><path d="M1024 672q119 0 203.5 84.5t84.5 203.5-84.5 203.5-203.5 84.5-203.5-84.5-84.5-203.5 84.5-203.5 203.5-84.5zm704-416q106 0 181 75t75 181v896q0 106-75 181t-181 75h-1408q-106 0-181-75t-75-181v-896q0-106 75-181t181-75h224l51-136q19-49 69.5-84.5t103.5-35.5h512q53 0 103.5 35.5t69.5 84.5l51 136h224zm-704 1152q185 0 316.5-131.5t131.5-316.5-131.5-316.5-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5z" /></svg>
      <div className="dce-video-container"></div>
      
      <div className="dce-scanarea">
        <div className="dce-scanlight"></div>
      </div>
      {!props.hideSelect &&
        <div className="sel-container">
          <select className="dce-sel-camera"></select>
          <select className="dce-sel-resolution"></select>
        </div>
      }
      {props.children}
    </div>
  );
}

export default MRZScanner;