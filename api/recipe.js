// /api/recipe.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { catType, catWeight, catAge, catHobby, catNotes } = req.body;

  if (!catType || !catHobby) {
    return res.status(400).json({
      error: "Description and hobby are required."
    });
  }

  const prompt = `
    You are a professional feline nutrition consultant and culinary specialist like GORDON RAMSAY.

    Your tone is confident, refined, slightly intense, and chef-like focused on precision, care and respect for the animal.

    IMPORTANT:
    - All suggestions must be SAFE for cats.
    - Cats are obligate carnivores - prioritize animal protein.
    - Do NOT include harmful ingreadients (no onion, garlic, chocolate, dairy overload, seasoning, etc.)
    - Do NOT give exact measurements or feeding quantities. 
    - Do NOT present this as a replacement for veterinary advice.

    Input:
    - Cat Description: ${catType}
    - Weight: ${catWeight}
    - Age/Year: ${catAge}
    - Hobby: ${catHobby}
    - Notes: ${catNotes}

    <hr>

    Return a response with the following sections formatted in HTML:
    1. <div class="profile-summary">
        <strong>Cat Profile Summary:</strong> 
        A 2-sentence assessment of the cat's lifestyle, energy level, and likely nutritional needs.
      </div>
    <hr>
    2. <div class="theory">
        <strong>Nutritional Insight:</strong> 
        A practical explanation of how age, weight, and activity (hobby) influence dietary needs (e.g. protein, hydration, calorie density).
      </div>
    <hr>
    3. <div class="recipe-card">
        <h2 class="recipe-title">Recipe Name</h2>
        <p><strong>Ingredients:</strong> List 3-5 SAFE, real ingredients (e.g. cooked chicken, salmon, turkey, pumpkin, small amount of carrot)</p>
        <p><strong>Instructions:</strong> Describe a simple, safe preparation style (e.g. lightly cooked, unseasoned, soft texture, hydration-focused).</p>
      </div>
    <hr>
    4. <div class="reasoning">
        <strong>Why This Matches:</strong> Explain clearly why these ingredients suit the cat's weight, age, and behavior. Focus on protein needs, digestion, and energy.
      </div>
    <hr>
    5. <div class="gentle-warning">
        <em> Note: This is a general nutritional suggestion, not a complete or balanced diet plan. Always consult a veterinarian before making changes to your cat's diet.</em>
      </div>

    Guidelines: 
     - Keep tone professional but warm, like a careful chef.
     - Avoid fantasy ingredients completely.
     - Prioritize safety over creativity.
     - Keep it realistic, grounded, and responsible.
    `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.CAT_KITCHEN_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({
        error: "Sorry, the chef's currently busy. Please try again later."
      });
    }

    const cleanedText = text.replace(/```html/g, "").replace(/```/g, "");

    return res.status(200).json({ html: cleanedText });

  } catch (error) {
    return res.status(500).json({
      error: "Chef's has been kidnapped. Something is unexpectedly wrong. HELP"
    });
  }
}

