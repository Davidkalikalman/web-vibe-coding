#!/usr/bin/env python3
"""
Rap Lyrics Generator - Provocative Style
Generates controversial rap lyrics with various themes and intensity levels
"""

import random
from typing import List, Dict, Tuple

class ProvocativeRapGenerator:
    def __init__(self):
        # Themes and elements for controversial rap
        self.themes = {
            "street_life": {
                "keywords": ["block", "hustle", "grind", "corner", "trap", "streets"],
                "phrases": [
                    "Started from the bottom, now we here",
                    "Money over everything, that's the code",
                    "Trust nobody, keep the circle tight",
                    "Real recognize real, fake stay invisible"
                ]
            },
            "wealth_flex": {
                "keywords": ["chains", "whip", "bands", "racks", "ice", "drip"],
                "phrases": [
                    "Counting money till my fingers hurt",
                    "Diamonds dancing on my wrist",
                    "Foreign whips, I got a fleet",
                    "Money talks, broke boys can't speak"
                ]
            },
            "competition": {
                "keywords": ["beef", "ops", "haters", "fake", "clout", "cap"],
                "phrases": [
                    "They talking but they ain't walking",
                    "Keyboard warriors, real life cowards",
                    "My success got them in their feelings",
                    "Stay mad while I stay paid"
                ]
            },
            "lifestyle": {
                "keywords": ["party", "bottles", "models", "VIP", "penthouse", "jet"],
                "phrases": [
                    "Living like tomorrow don't exist",
                    "Party till the sun come up",
                    "VIP, that's the only way",
                    "Life's a movie, I'm the star"
                ]
            }
        }
        
        # Rhyme patterns
        self.rhyme_schemes = ["AABB", "ABAB", "AAAA", "ABCB"]
        
        # Flow patterns
        self.flow_patterns = [
            "short_punchy",  # Short, aggressive lines
            "storytelling",  # Longer, narrative style
            "punchline",     # Setup and punchline format
            "repetitive"     # Repetitive hook style
        ]
    
    def generate_hook(self, theme: str, intensity: int = 5) -> List[str]:
        """Generate a catchy hook based on theme and intensity"""
        hook_lines = []
        theme_data = self.themes.get(theme, self.themes["street_life"])
        
        # Create a repetitive, catchy hook
        main_phrase = random.choice(theme_data["phrases"])
        keyword = random.choice(theme_data["keywords"])
        
        hook_lines.append(f"{main_phrase} (yeah)")
        hook_lines.append(f"All about the {keyword}, that's the way (uh)")
        hook_lines.append(f"{main_phrase} (yeah)")
        hook_lines.append(f"Every single day, no delay (let's go)")
        
        return hook_lines
    
    def generate_verse(self, theme: str, bars: int = 16, intensity: int = 5) -> List[str]:
        """Generate a verse with specified number of bars"""
        verse_lines = []
        theme_data = self.themes.get(theme, self.themes["street_life"])
        
        for i in range(0, bars, 4):
            # Mix different elements
            if i % 8 == 0:
                # Start with a strong statement
                line1 = f"Listen up, let me tell you 'bout the {random.choice(theme_data['keywords'])}"
                line2 = f"Every day grinding, never stop the hustle"
                line3 = f"Competition looking weak, they can't touch this"
                line4 = f"Stay focused on the money, that's the motto"
            else:
                # Continue with theme-specific content
                keyword = random.choice(theme_data["keywords"])
                phrase = random.choice(theme_data["phrases"])
                
                line1 = f"Got the {keyword} on me, feeling like a king"
                line2 = f"{phrase}, that's the thing"
                line3 = f"Haters gonna hate, let them talk their talk"
                line4 = f"Meanwhile I'm getting paid, taking stock"
            
            verse_lines.extend([line1, line2, line3, line4])
        
        return verse_lines[:bars]  # Ensure we return exact number of bars
    
    def generate_full_song(self, title: str, primary_theme: str, intensity: int = 5) -> Dict[str, any]:
        """Generate a complete song structure"""
        song = {
            "title": title,
            "theme": primary_theme,
            "intensity": intensity,
            "structure": []
        }
        
        # Song structure: Intro - Verse 1 - Hook - Verse 2 - Hook - Bridge - Hook - Outro
        
        # Intro (4 bars)
        intro = [
            f"Yeah, yeah, {title}",
            "Let's get it, uh",
            f"This that {primary_theme} music",
            "Turn me up, let's go"
        ]
        song["structure"].append({"section": "Intro", "lyrics": intro})
        
        # Verse 1 (16 bars)
        verse1 = self.generate_verse(primary_theme, 16, intensity)
        song["structure"].append({"section": "Verse 1", "lyrics": verse1})
        
        # Hook (4 bars)
        hook = self.generate_hook(primary_theme, intensity)
        song["structure"].append({"section": "Hook", "lyrics": hook})
        
        # Verse 2 (16 bars) - Mix with another theme
        secondary_theme = random.choice([t for t in self.themes.keys() if t != primary_theme])
        verse2 = self.generate_verse(secondary_theme, 16, intensity)
        song["structure"].append({"section": "Verse 2", "lyrics": verse2})
        
        # Hook repeat
        song["structure"].append({"section": "Hook", "lyrics": hook})
        
        # Bridge (8 bars)
        bridge = self.generate_verse(primary_theme, 8, intensity + 2)  # More intense
        song["structure"].append({"section": "Bridge", "lyrics": bridge})
        
        # Hook final
        song["structure"].append({"section": "Hook", "lyrics": hook})
        
        # Outro (4 bars)
        outro = [
            f"Yeah, {title}, we out",
            "You already know what it is",
            f"{primary_theme.replace('_', ' ').title()} life",
            "Peace"
        ]
        song["structure"].append({"section": "Outro", "lyrics": outro})
        
        return song
    
    def format_song(self, song: Dict) -> str:
        """Format song dictionary into readable lyrics"""
        output = f"Title: {song['title']}\n"
        output += f"Theme: {song['theme']}\n"
        output += f"Intensity: {song['intensity']}/10\n"
        output += "=" * 50 + "\n\n"
        
        for section in song["structure"]:
            output += f"[{section['section']}]\n"
            for line in section["lyrics"]:
                output += f"{line}\n"
            output += "\n"
        
        return output

# Example usage
if __name__ == "__main__":
    generator = ProvocativeRapGenerator()
    
    # Generate different style songs
    songs = [
        ("Money Talks", "wealth_flex", 7),
        ("Street Code", "street_life", 8),
        ("No Competition", "competition", 9),
        ("Living Fast", "lifestyle", 6)
    ]
    
    for title, theme, intensity in songs:
        print(f"\n{'='*60}")
        song = generator.generate_full_song(title, theme, intensity)
        print(generator.format_song(song))