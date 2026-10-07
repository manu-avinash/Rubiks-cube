// Camera And Image
{
  const webcam = document.querySelector("#webcam");
  const image = document.querySelector("#image");
  const input_buttons = document.querySelector(".input");
  let isstream = null;

  // camera

  input_buttons.firstElementChild.addEventListener("click", async () => {
    image.src = null;
    image.style.display = "none";
    if (isstream !== null) {
      const tracks = isstream.getTracks();
      tracks.forEach((track) => track.stop());
      webcam.srcObject = null;
      isstream = null;
      input_buttons.firstElementChild.innerHTML = "Start Camera";
    } else {
      const constraints = {
        video: true,
        audio: false,
      };

      try {
        isstream = await navigator.mediaDevices.getUserMedia(constraints);
        webcam.srcObject = isstream;
      } catch (error) {
        console.error("Error accessing camera: ", error);
        alert("Coudn't access the camera. Please check with permissions.");
      }
      webcam.style.display = "block";

      input_buttons.firstElementChild.innerHTML = "Stop Camera";
    }
  });

  // Image
  input_buttons.lastElementChild.addEventListener("click", async () => {
    if (isstream !== null) {
      const tracks = isstream.getTracks();
      tracks.forEach((track) => track.stop());
      webcam.srcObject = null;
      isstream = null;
      input_buttons.firstElementChild.innerHTML = "Start Camera";
    }
    webcam.style.display = "none";

    try {
      // 1. Open the native file picker
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "Image",
            accept: {
              "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp"],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      });

      // 2. Extract the file data
      const file = await fileHandle.getFile();

      // 3. Process the file (e.g., render a preview)

      image.src = URL.createObjectURL(file);
      image.style.display = "block";
    } catch (err) {
      // Handles cases where the user cancels the picker window
      console.log("User cancelled or browser is unsupported:", err);
    }
  });
}
