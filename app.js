const API_KEY = "sk-26bcY9xYmBCgN8KyIOov6faWV68nyIVOHJuCxh7A55wyXYqG";
const submitIcon = document.querySelector("#submit-icon");
const regenerateButton = document.querySelector("#regenerate-button");
const imagesSection = document.querySelector(".images-section");
const inputElement = document.querySelector("#inputPrompt");

const getImages = async () => {
    const promptText = inputElement.value.trim();

    if (!promptText) {
        console.error('Please enter some text prompts.');
        return;
    }

    // Show loading indicator
    const loadingIndicator = document.querySelector('#loading-indicator');
    loadingIndicator.style.display = 'block';

    console.log(JSON.stringify({
        "text_prompts": promptText,
        "n": 1,
        "size": "512x512"
    }));

    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "engine_id": "stable-diffusion-xl-1024-v1-0",
            "height": 1024,
            "width": 1024,
            "text_prompts": [
                {
                    "text": promptText,
                    "weight": 0.5
                }
            ],
            "cfg_scale": 7,
            "clip_guidance_preset": "NONE",
            "samples": 1,
            "seed": 0,
            "steps": 30,
            "style_preset": "photographic",
        })
    };

    try {
        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', options);
        const data = await response.json();

        console.log(data); // Log the response data

        // Hide loading indicator after fetching response
        loadingIndicator.style.display = 'none';

        if (response.ok) {
            console.log(data);
            if (data.artifacts && data.artifacts.length > 0) {
                imagesSection.innerHTML = '';
                data.artifacts.forEach(artifact => {
                    const img = document.createElement('img');
                    img.src = `data:image/png;base64,${artifact.base64}`;
                    imagesSection.appendChild(img);
                });
            } else {
                console.log('No images found in the API response');
            }
        } else {
            console.error(`Error: ${data.name} - ${data.message}`);
            console.error(`ID: ${data.id}`);
        }
    } catch (error) {
        console.error(error);
    }
};

submitIcon.addEventListener('click', getImages);

regenerateButton.addEventListener('click', () => {
    // Clear the images section
    imagesSection.innerHTML = '';
    
    // Reset the input field
    inputElement.value = '';
});

// Add event listener for Enter key press
inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission behavior
        getImages(); // Call the getImages function when Enter is pressed
    }
});
