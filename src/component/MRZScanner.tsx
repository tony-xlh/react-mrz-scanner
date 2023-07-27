import React, { MutableRefObject, useEffect, useRef } from 'react';
import { CameraEnhancer } from 'dynamsoft-camera-enhancer';
import './MRZScanner.css';

const MRZScanner = (): React.ReactElement => {
  const dce = useRef<CameraEnhancer|null>(null);
  const container: MutableRefObject<HTMLDivElement|null> = useRef(null);
  useEffect((): any => {
    const init = async () => {
        try{
            dce.current = await CameraEnhancer.createInstance();
            await dce.current.setUIElement(container.current as HTMLDivElement);
            dce.current.setVideoFit("cover");
            dce.current.open(true);
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
  }, []);

  return (
    <div ref={container}>
      <svg className="dce-bg-loading" viewBox="0 0 1792 1792"><path d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z" /></svg>
      <svg className="dce-bg-camera" viewBox="0 0 2048 1792"><path d="M1024 672q119 0 203.5 84.5t84.5 203.5-84.5 203.5-203.5 84.5-203.5-84.5-84.5-203.5 84.5-203.5 203.5-84.5zm704-416q106 0 181 75t75 181v896q0 106-75 181t-181 75h-1408q-106 0-181-75t-75-181v-896q0-106 75-181t181-75h224l51-136q19-49 69.5-84.5t103.5-35.5h512q53 0 103.5 35.5t69.5 84.5l51 136h224zm-704 1152q185 0 316.5-131.5t131.5-316.5-131.5-316.5-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5z" /></svg>
      <div className="dce-video-container"></div>
      <div className="dce-scanarea">
        <div className="dce-scanlight"></div>
      </div>
      <div className="sel-container">
        <select className="dce-sel-camera"></select>
        <select className="dce-sel-resolution"></select>
      </div>
    </div>
  );
}

export default MRZScanner;