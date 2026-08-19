"""
Simple script to generate placeholder icons for the WhatsApp Contact Extractor extension.
Requires: pip install pillow
"""

from PIL import Image, ImageDraw, ImageFont

def create_whatsapp_icon(size, filename):
    """
    Create a WhatsApp-themed icon with the specified size.
    
    Args:
        size: Icon size in pixels (square)
        filename: Output filename
    """
    # WhatsApp green color
    bg_color = '#25D366'
    
    # Create image with WhatsApp green background
    img = Image.new('RGB', (size, size), color=bg_color)
    draw = ImageDraw.Draw(img)
    
    # Calculate dimensions
    padding = size // 8
    
    # Draw a white circle (phone icon background)
    circle_size = size - (2 * padding)
    circle_pos = [padding, padding, size - padding, size - padding]
    draw.ellipse(circle_pos, fill='white')
    
    # Draw "WA" text or a simple phone icon
    try:
        # Try to use a font, fall back to default if not available
        font_size = size // 3
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        text = "WA"
        
        # Get text bounding box
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Center the text
        text_x = (size - text_width) // 2
        text_y = (size - text_height) // 2 - padding // 4
        
        # Draw text
        draw.text((text_x, text_y), text, fill=bg_color, font=font)
        
    except Exception as e:
        print(f"Warning: Could not add text to icon: {e}")
        # If text fails, just use the circle
        pass
    
    # Save the image
    img.save(filename, 'PNG')
    print(f"Created: {filename} ({size}x{size})")

def create_simple_icon(size, filename):
    """
    Create a simpler icon version (just colored square with text).
    
    Args:
        size: Icon size in pixels (square)
        filename: Output filename
    """
    # WhatsApp green
    img = Image.new('RGB', (size, size), color='#25D366')
    draw = ImageDraw.Draw(img)
    
    # Add white border
    border = max(1, size // 16)
    draw.rectangle(
        [border, border, size - border - 1, size - border - 1],
        outline='white',
        width=border
    )
    
    # Try to add text
    try:
        font_size = size // 3
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        text = "WA"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        text_x = (size - text_width) // 2
        text_y = (size - text_height) // 2
        
        draw.text((text_x, text_y), text, fill='white', font=font)
    except:
        pass
    
    img.save(filename, 'PNG')
    print(f"Created: {filename} ({size}x{size})")

def main():
    """Generate all required icon sizes."""
    print("Generating icons for WhatsApp Contact Extractor...")
    print("-" * 50)
    
    # Generate the fancy version (with circle)
    print("\nGenerating fancy icons with circle design:")
    try:
        create_whatsapp_icon(16, 'icon16.png')
        create_whatsapp_icon(48, 'icon48.png')
        create_whatsapp_icon(128, 'icon128.png')
        print("\n✅ Successfully generated all icons!")
    except Exception as e:
        print(f"\n❌ Error generating fancy icons: {e}")
        print("\nTrying simple icon generation...")
        
        # Fallback to simple version
        try:
            create_simple_icon(16, 'icon16.png')
            create_simple_icon(48, 'icon48.png')
            create_simple_icon(128, 'icon128.png')
            print("\n✅ Successfully generated simple icons!")
        except Exception as e:
            print(f"\n❌ Error: {e}")
            print("\nPlease install Pillow: pip install pillow")
            return
    
    print("\n" + "-" * 50)
    print("Icons are ready! You can now load the extension in Chrome.")
    print("\nNext steps:")
    print("1. Go to chrome://extensions/")
    print("2. Enable 'Developer mode'")
    print("3. Click 'Load unpacked'")
    print("4. Select the folder containing these files")

if __name__ == "__main__":
    main()