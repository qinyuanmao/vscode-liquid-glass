#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math

def create_logo():
    # Create image
    size = 512
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background gradient (purple to pink)
    for y in range(size):
        r = int(102 + (240 - 102) * (y / size))
        g = int(126 + (147 - 126) * (y / size))
        b = int(234 + (251 - 234) * (y / size))
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
    
    # Create glass layers
    glass_layer = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    glass_draw = ImageDraw.Draw(glass_layer)
    
    # Main glass rectangle
    margin = 80
    glass_rect = [margin, margin, size - margin, size - margin]
    radius = 40
    
    # Draw rounded rectangle with gradient effect
    for i in range(3):
        offset = i * 15
        alpha = int(80 - i * 20)
        glass_draw.rounded_rectangle(
            [margin + offset, margin + offset, size - margin - offset, size - margin - offset],
            radius=radius - i * 5,
            fill=(255, 255, 255, alpha)
        )
    
    # Apply blur for glass effect
    glass_layer = glass_layer.filter(ImageFilter.GaussianBlur(8))
    
    # Composite
    img = Image.alpha_composite(img, glass_layer)
    
    # Add VSCode-inspired icon overlay
    overlay = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    # Draw simplified brackets/code symbol
    center_x, center_y = size // 2, size // 2
    bracket_size = 60
    line_width = 12
    
    # Left bracket
    overlay_draw.line(
        [(center_x - bracket_size, center_y - 30),
         (center_x - bracket_size - 20, center_y - 30)],
        fill=(255, 255, 255, 200), width=line_width
    )
    overlay_draw.line(
        [(center_x - bracket_size - 20, center_y - 30),
         (center_x - bracket_size - 30, center_y)],
        fill=(255, 255, 255, 200), width=line_width
    )
    overlay_draw.line(
        [(center_x - bracket_size - 30, center_y),
         (center_x - bracket_size - 20, center_y + 30)],
        fill=(255, 255, 255, 200), width=line_width
    )
    overlay_draw.line(
        [(center_x - bracket_size - 20, center_y + 30),
         (center_x - bracket_size, center_y + 30)],
        fill=(255, 255, 255, 200), width=line_width
    )
    
    # Right bracket
    overlay_draw.line(
        [(center_x + bracket_size, center_y - 30),
         (center_x + bracket_size + 20, center_y - 30)],
        fill=(255, 255, 255, 200), width=line_width
    )
    overlay_draw.line(
        [(center_x + bracket_size + 20, center_y - 30),
         (center_x + bracket_size + 30, center_y)],
        fill=(255, 255, 255, 200), width=line_width
    )
    overlay_draw.line(
        [(center_x + bracket_size + 30, center_y),
         (center_x + bracket_size + 20, center_y + 30)],
        fill=(255, 255, 255, 200), width=line_width
    )
    overlay_draw.line(
        [(center_x + bracket_size + 20, center_y + 30),
         (center_x + bracket_size, center_y + 30)],
        fill=(255, 255, 255, 200), width=line_width
    )
    
    # Add sparkle effects
    sparkles = [
        (150, 150, 8), (380, 140, 6), (160, 370, 7),
        (370, 360, 9), (256, 120, 5), (256, 390, 6)
    ]
    
    for x, y, size in sparkles:
        overlay_draw.ellipse([x - size, y - size, x + size, y + size],
                           fill=(255, 255, 255, 150))
    
    # Composite overlay
    img = Image.alpha_composite(img, overlay)
    
    # Save
    img.save('/Users/qinyuanmao/vscode/vscode-liquid-glass/icon.png')
    print("Logo saved as icon.png")
    
    # Also create smaller versions for VSCode
    img_128 = img.resize((128, 128), Image.Resampling.LANCZOS)
    img_128.save('/Users/qinyuanmao/vscode/vscode-liquid-glass/icon-128.png')
    
    img_64 = img.resize((64, 64), Image.Resampling.LANCZOS)
    img_64.save('/Users/qinyuanmao/vscode/vscode-liquid-glass/icon-64.png')
    
    print("Additional sizes created: icon-128.png, icon-64.png")

if __name__ == '__main__':
    create_logo()
