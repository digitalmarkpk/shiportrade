import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function analyzeImage(imagePath: string, prompt: string) {
    try {
        const zai = await ZAI.create();
        
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
        const imageUrl = `data:${mimeType};base64,${base64Image}`;
        
        const response = await zai.chat.completions.createVision({
            model: 'glm-4.6v',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        { type: 'image_url', image_url: { url: imageUrl } }
                    ]
                }
            ],
            thinking: { type: 'disabled' }
        });
        
        return response.choices?.[0]?.message?.content || 'No response';
    } catch (err: any) {
        return `Error: ${err?.message || err}`;
    }
}

async function main() {
    const images = [
        '/home/z/my-project/upload/pasted_image_1771506136904.png',
        '/home/z/my-project/upload/pasted_image_1771962856953.png'
    ];
    
    for (const imagePath of images) {
        if (fs.existsSync(imagePath)) {
            console.log(`\n=== Analyzing: ${path.basename(imagePath)} ===\n`);
            const result = await analyzeImage(
                imagePath,
                "Describe this image in detail. What does it show? Is this a website mockup, design, or screenshot? Describe all the UI elements, colors, layout, text content, and any interactive elements visible."
            );
            console.log(result);
        } else {
            console.log(`\n=== File not found: ${imagePath} ===`);
        }
    }
}

main();
