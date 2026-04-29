const submitBtn = document.getElementById("submitBtn");
const loading = document.getElementById("loading");
const resultArea = document.getElementById("resultArea");
const reportContent = document.getElementById("reportContent");

submitBtn.addEventListener("click", generateRecipe);

async function generateRecipe() {
  const catType = document.getElementById("catType").value.trim();
  const catWeight = document.getElementById("catWeight").value.trim();
  const catAge = document.getElementById("catAge").value.trim();
  const catHobby = document.getElementById("catHobby").value.trim();
  const catNotes = document.getElementById("catNotes").value.trim();

  if (!catType || !catHobby) {
    alert("Please provide at least a description and a hobby for thorough analysis.");
    return;
  }

  submitBtn.disabled = true;
  loading.style.display = "block";
  resultArea.style.display = "none";

  try {
    const response = await fetch("/api/generate-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        catType,
        catWeight,
        catAge,
        catHobby,
        catNotes
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    reportContent.innerHTML = data.html;
    resultArea.style.display = "block";
  } catch (error) {
    console.error(error);
    reportContent.innerHTML = `
      <p style="color:var(--google-red)">
        The Kitchen is currently busy!: ${error.message}
      </p>
    `;
    resultArea.style.display = "block";
  } finally {
    submitBtn.disabled = false;
    loading.style.display = "none";
    resultArea.scrollIntoView({ behavior: "smooth" });
  }
}

//For music purposes
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const musicIcon = document.getElementById("musicIcon");

music.muted = true;
musicIcon.innerHTML = '<i class="bi bi-volume-mute-fill"></i>'

musicBtn.addEventListener("click", async () => {
  if (music.muted) {
    // Unmute (music playing)
    music.muted = false

    try {
      await music.play();
    } catch (e) {}
    musicIcon.innerHTML = '<i class="bi bi-volume-up-fill"></i>';

  } else {
    music.muted = true;
    musicIcon.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
  }
});