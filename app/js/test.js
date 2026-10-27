// API url
const API_URL = "http://0.0.0.0:8000";

// Camera And Image
{
  const result = document.querySelector(".result");
  const webcam = document.querySelector("#webcam");
  const image = document.querySelector("#image");
  const input_buttons = document.querySelector(".input");
  let isstream = null;

  // camera
  input_buttons.firstElementChild.addEventListener("click", async () => {
    // Disable image if present
    image.src = "";
    image.style.display = "none";
    // Turning stream and video display on the window
    if (isstream !== null) {
      const tracks = isstream.getTracks();
      tracks.forEach((track) => track.stop());
      webcam.srcObject = null;
      isstream = null;
      input_buttons.firstElementChild.innerHTML = "Start Camera";
      result.firstElementChild.innerHTML = "Predicted : None";
      result.lastElementChild.innerHTML = "Confidence : -----";
    } else {
      const constraints = {
        video: true,
        audio: false,
      };

      try {
        isstream = await navigator.mediaDevices.getUserMedia(constraints);
        webcam.srcObject = isstream;
        webcam.style.display = "block";
        input_buttons.firstElementChild.innerHTML = "Stop Camera";
        //Config for stream image capture and upload to API endpoint
        const videoSequence = isstream.getVideoTracks()[0];
        const imgCapture = new ImageCapture(videoSequence);
        // Stream image push to API endpoint function
        (async () => {
          while (isstream) {
            try {
              //Raw image at an instance
              const blob = await imgCapture.takePhoto();
              // Check for not streaming
              if (!isstream) break;
              // Designing a form to be POSTed to endpoint
              const form = new FormData();
              form.append("img", blob);
              // Request to API endpoint with form
              const endpoint = API_URL + "/push";
              const response = await fetch(endpoint, {
                method: "POST",
                body: form,
              });
              const data = await response.json();
              console.log("Uploaded successfully", data);
              result.firstElementChild.innerHTML =
                "Predicted : " + data["state"];
              result.lastElementChild.innerHTML =
                "Confidence : " + (data["confidence"]).toFixed(2)+'%';
            } catch (error) {
              console.error("Failed to upload or capture:", error);
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        })();
      } catch (error) {
        console.error("Error accessing camera: ", error);
        alert("Couldn't access the camera. Please check with permissions.");
      }
    }
  });

  // Image
  input_buttons.lastElementChild.addEventListener("click", async () => {
    // Disable Stream if enabled
    if (isstream !== null) {
      const tracks = isstream.getTracks();
      tracks.forEach((track) => track.stop());
      webcam.srcObject = null;
      isstream = null;
      input_buttons.firstElementChild.innerHTML = "Start Camera";
      result.firstElementChild.innerHTML = "Predicted : None";
      result.lastElementChild.innerHTML = "Confidence : -----";
    }
    // Removing webcam obj to make room for image
    webcam.style.display = "none";

    try {
      // Choosing the image file from the system
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "Image",
            accept: {
              "image/*": [".png", ".jpeg", ".jpg"],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      });

      const file = await fileHandle.getFile();

      image.src = URL.createObjectURL(file);
      image.style.display = "block";

      try {
        // Form for image upload
        const form = new FormData();
        form.append("img", file);
        // API request for POST
        const endpoint = API_URL + "/push";
        const response = await fetch(endpoint, {
          method: "POST",
          body: form,
        });

        const data = await response.json();
        console.log("Uploaded successfully", data);
        result.firstElementChild.innerHTML = "Predicted : " + data["state"];
        result.lastElementChild.innerHTML =
          "Confidence : " + Math.round(data["confidence"])+'%';
      } catch (uploadError) {
        console.error("Failed to upload chosen file", uploadError);
      }
    } catch (err) {
      console.log("User cancelled or browser is unsupported:", err);
    }
  });
}
