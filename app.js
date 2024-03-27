const API_KEY = "sk-q1uWbMvyuibv3p8dN0GHii8oXw4U1HmScw1WfYdqngznX4W2";

const submitIcon = document.querySelector("#submit-icon");
const imagesSection = document.querySelector(".images-section");

const inputElement = document.querySelector("#inputPrompt");

const getImages = async () => {
    const promptText = inputElement.value.trim();

    if (!promptText) {
        console.error('Please enter some text prompts.');
        return;
    }

    console.log(JSON.stringify({
        "text_prompts": promptText,
        "n": 4,
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

