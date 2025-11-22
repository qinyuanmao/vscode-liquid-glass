const { createCanvas } = require('canvas');
const fs = require('fs');

function createLogo() {
    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background gradient (purple to pink)
    const bgGradient = ctx.createLinearGradient(0, 0, 0, size);
    bgGradient.addColorStop(0, '#667eea');
    bgGradient.addColorStop(0.5, '#764ba2');
    bgGradient.addColorStop(1, '#f093fb');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, size, size);

    // Glass layers
    const layers = [
        { x: 80, y: 80, size: 352, opacity: 0.25, blur: 15 },
        { x: 100, y: 100, size: 312, opacity: 0.20, blur: 10 },
        { x: 120, y: 120, size: 272, opacity: 0.15, blur: 8 }
    ];

    layers.forEach(layer => {
        ctx.save();
        ctx.globalAlpha = layer.opacity;

        const gradient = ctx.createRadialGradient(
            layer.x + layer.size/2, layer.y + layer.size/2, 0,
            layer.x + layer.size/2, layer.y + layer.size/2, layer.size/2
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

        ctx.fillStyle = gradient;
        ctx.shadowBlur = layer.blur;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';

        // Rounded rectangle
        const radius = 35;
        ctx.beginPath();
        ctx.moveTo(layer.x + radius, layer.y);
        ctx.lineTo(layer.x + layer.size - radius, layer.y);
        ctx.quadraticCurveTo(layer.x + layer.size, layer.y, layer.x + layer.size, layer.y + radius);
        ctx.lineTo(layer.x + layer.size, layer.y + layer.size - radius);
        ctx.quadraticCurveTo(layer.x + layer.size, layer.y + layer.size, layer.x + layer.size - radius, layer.y + layer.size);
        ctx.lineTo(layer.x + radius, layer.y + layer.size);
        ctx.quadraticCurveTo(layer.x, layer.y + layer.size, layer.x, layer.y + layer.size - radius);
        ctx.lineTo(layer.x, layer.y + radius);
        ctx.quadraticCurveTo(layer.x, layer.y, layer.x + radius, layer.y);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    });

    // Code brackets symbol
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';

    const centerX = size / 2;
    const centerY = size / 2;
    const bracketSize = 50;

    // Left bracket <
    ctx.beginPath();
    ctx.moveTo(centerX - bracketSize + 10, centerY - 40);
    ctx.lineTo(centerX - bracketSize - 35, centerY);
    ctx.lineTo(centerX - bracketSize + 10, centerY + 40);
    ctx.stroke();

    // Right bracket >
    ctx.beginPath();
    ctx.moveTo(centerX + bracketSize - 10, centerY - 40);
    ctx.lineTo(centerX + bracketSize + 35, centerY);
    ctx.lineTo(centerX + bracketSize - 10, centerY + 40);
    ctx.stroke();

    // Slash /
    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY + 45);
    ctx.lineTo(centerX + 10, centerY - 45);
    ctx.stroke();

    ctx.restore();

    // Add sparkle effects
    const sparkles = [
        { x: 130, y: 130, size: 10 },
        { x: 390, y: 120, size: 8 },
        { x: 140, y: 380, size: 9 },
        { x: 380, y: 370, size: 11 },
        { x: 256, y: 100, size: 7 }
    ];

    sparkles.forEach(sparkle => {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
        ctx.fill();

        // Add star points
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = 4;
        for (let i = 0; i < 4; i++) {
            ctx.save();
            ctx.translate(sparkle.x, sparkle.y);
            ctx.rotate((Math.PI / 2) * i);
            ctx.beginPath();
            ctx.moveTo(0, -sparkle.size * 1.5);
            ctx.lineTo(sparkle.size * 0.3, 0);
            ctx.lineTo(0, sparkle.size * 0.4);
            ctx.lineTo(-sparkle.size * 0.3, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        ctx.restore();
    });

    // Save main icon
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('icon.png', buffer);
    console.log('✓ Logo created: icon.png (512x512)');

    // Create smaller versions
    const sizes = [
        { size: 128, name: 'icon-128.png' },
        { size: 64, name: 'icon-64.png' }
    ];

    sizes.forEach(({ size: targetSize, name }) => {
        const smallCanvas = createCanvas(targetSize, targetSize);
        const smallCtx = smallCanvas.getContext('2d');
        smallCtx.drawImage(canvas, 0, 0, targetSize, targetSize);
        const smallBuffer = smallCanvas.toBuffer('image/png');
        fs.writeFileSync(name, smallBuffer);
        console.log(`✓ Created: ${name} (${targetSize}x${targetSize})`);
    });

    console.log('\n🎨 All logos created successfully!');
}

createLogo();
