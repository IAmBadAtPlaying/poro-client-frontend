import {useRef, useState} from "react";
import * as Globals from "../../globals";

export default function BackgroundUpload() {

    const uploadFileForm = useRef();
    const uploadFileStatus = useRef();

    const [displayButton, setDisplayButton] = useState(false);

    const ACCEPTED_STRING = "image/png, image/jpeg, image/jpg, video/mp4, video/webm";

    const reloadSite = () => {
        //Force window to clear cache
        window.location.reload();
    }

    const uploadFile = () => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", Globals.REST_PREFIX+"/dynamic/userdata/background", true);

        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                if (uploadFileStatus.current === undefined) return;
                const percent = (event.loaded / event.total) * 100;
                uploadFileStatus.current.innerHTML = `Uploading: ${percent.toFixed(2)}%`;
            }
        };

        xhr.onload = function () {
            if (uploadFileStatus.current === undefined) return;
            if (xhr.status === 200) {
                uploadFileStatus.current.innerHTML = "Upload successful!";
                setDisplayButton(true)
            } else {
                uploadFileStatus.current.innerHTML = "Upload failed!";
            }
        };

        const formData = new FormData(uploadFileForm.current);
        xhr.send(formData);
    }

    const onFileChange = () => {
        if (uploadFileStatus.current === undefined) return;
        uploadFileStatus.current.innerHTML = "Click the button to upload the file!";
    }

    return (
        <div>
            <form ref={uploadFileForm} encType="multipart/form-data">
                <input type="file" name="file" id="file" accept={ACCEPTED_STRING} onChange={onFileChange}/>
                <input type="button" value="Upload" onClick={uploadFile}/>
            </form>
            <div ref={uploadFileStatus}>
                <div>

                </div>
                {
                    displayButton ? <button onClick={reloadSite}>Reload Site</button> : <></>
                }
            </div>
        </div>
    )
}