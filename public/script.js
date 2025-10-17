document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("videoInput").files[0];
  if (!file) return alert("Please select a video file.");

  const status = document.getElementById("status");
  status.textContent = "⏳ Extracting audio... Please wait.";

  const formData = new FormData();
  formData.append("video", file);

  const response = await fetch("/extract", {
    method: "POST",
    body: formData
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted_audio.mp3";
    a.click();
    status.textContent = "✅ Audio extracted successfully!";
  } else {
    status.textContent = "❌ Failed to extract audio.";
  }
});