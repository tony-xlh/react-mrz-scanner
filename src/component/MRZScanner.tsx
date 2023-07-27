import React, { MutableRefObject, useEffect, useRef } from 'react';
import { CameraEnhancer } from 'dynamsoft-camera-enhancer';

const MRZScanner = (): React.ReactElement => {
  const dce = useRef<CameraEnhancer|null>(null);
  const container: MutableRefObject<HTMLDivElement|null> = useRef(null);
  useEffect((): any => {
    const init = async () => {
        try{
            dce.current = await CameraEnhancer.createInstance();
            await dce.current.setUIElement(container.current as HTMLDivElement);
            //cameraEnhancer.setVideoFit("cover");
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

    return async () => {
      console.log('VideoRecognizer Component Unmount');
    }
  }, []);

  return (
    <div ref={container}>

    </div>
  );
}

export default MRZScanner;