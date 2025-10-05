#!/usr/bin/env python3
"""
Advanced Controversial Rap Generator
Creates provocative, edgy rap lyrics with various controversy levels
WARNING: This is for artistic/creative purposes only
"""

import random
from typing import List, Dict, Tuple
from datetime import datetime

class ControversialRapGenerator:
    def __init__(self):
        self.controversy_levels = {
            1: "mild",      # Radio friendly
            2: "moderate",  # Explicit content warning
            3: "high",      # Very controversial
            4: "extreme",   # Maximum provocation
        }
        
        # Rap personas/characters
        self.personas = {
            "hustler": {
                "traits": ["ambitious", "street-smart", "relentless"],
                "catchphrases": ["get money", "grind don't stop", "hustle hard"]
            },
            "rebel": {
                "traits": ["anti-establishment", "provocative", "unapologetic"],
                "catchphrases": ["break the rules", "no filter", "speak my truth"]
            },
            "boss": {
                "traits": ["wealthy", "powerful", "dominant"],
                "catchphrases": ["I run this", "bow down", "king status"]
            },
            "villain": {
                "traits": ["dark", "menacing", "controversial"],
                "catchphrases": ["no mercy", "cold world", "darkness falls"]
            }
        }
        
        # Metaphors and wordplay
        self.metaphors = {
            "success": ["climbing mountains", "touching stars", "breaking chains", "rising phoenix"],
            "struggle": ["swimming upstream", "walking through fire", "dodging bullets", "fighting demons"],
            "power": ["throne sitting", "crown wearing", "empire building", "chess playing"],
            "competition": ["shark tank", "lion's den", "war zone", "gladiator pit"]
        }
        
    def generate_provocative_bar(self, theme: str, controversy_level: int) -> str:
        """Generate a single provocative bar based on theme and controversy level"""
        
        # Base templates for different controversy levels
        if controversy_level == 1:
            templates = [
                "They sleeping on me, time to wake 'em up",
                "Money talks louder than your whole crew",
                "Competition looking weak, I'm too strong",
                "Success got me feeling like a villain"
            ]
        elif controversy_level == 2:
            templates = [
                "Middle finger to the haters, I don't care",
                "Your girl chose me, that's just how it goes",
                "Fake friends get cut off, no remorse",
                "Money and power, that's my only religion"
            ]
        elif controversy_level == 3:
            templates = [
                "Society's rules? I break 'em for breakfast",
                "Controversy follows me, I embrace the chaos",
                "They cancel culture, I cancel their existence",
                "Morals are for broke people, I'm past that"
            ]
        else:  # Level 4
            templates = [
                "Burn it all down, rebuild from the ashes",
                "No sacred cows, everything's fair game",
                "Shock value? Nah, this is my reality",
                "Push every button, break every boundary"
            ]
        
        return random.choice(templates)
    
    def create_controversial_hook(self, title: str, controversy_level: int) -> List[str]:
        """Create a memorable, controversial hook"""
        hooks = []
        
        if controversy_level <= 2:
            hooks = [
                f"{title}, yeah we going crazy (crazy)",
                f"No apologies, we staying wavy (wavy)",
                f"{title}, breaking all the rules (rules)",
                f"Living life like we got nothing to lose (lose)"
            ]
        else:
            hooks = [
                f"{title}, burning down the system (burn it)",
                f"Controversial? That's my anthem (anthem)",
                f"{title}, middle fingers to the sky (sky)",
                f"Living wrong never felt so right (right)"
            ]
        
        return hooks
    
    def generate_provocative_verse(self, persona: str, controversy_level: int, bars: int = 16) -> List[str]:
        """Generate a full verse with specified persona and controversy level"""
        verse = []
        persona_data = self.personas.get(persona, self.personas["rebel"])
        
        for i in range(bars):
            if i % 4 == 0:
                # Start of a 4-bar sequence
                bar = self.generate_provocative_bar("intro", controversy_level)
            elif i % 4 == 3:
                # Punchline
                bar = f"{random.choice(persona_data['catchphrases'])}, that's the motto"
            else:
                # Regular bars
                bar = self.generate_provocative_bar("flow", controversy_level)
            
            verse.append(bar)
        
        return verse
    
    def create_shock_value_song(self, title: str, main_persona: str, controversy_level: int) -> Dict:
        """Create a complete controversial song"""
        song = {
            "title": title,
            "persona": main_persona,
            "controversy_level": controversy_level,
            "warning": f"Controversy Level: {self.controversy_levels[controversy_level]}",
            "created": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "structure": []
        }
        
        # Intro
        intro = [
            f"Yeah, {title}",
            f"Controversy level {controversy_level}",
            "No filter, no apologies",
            "Let's get it"
        ]
        song["structure"].append({"section": "Intro", "lyrics": intro})
        
        # Verse 1
        verse1 = self.generate_provocative_verse(main_persona, controversy_level, 16)
        song["structure"].append({"section": "Verse 1", "lyrics": verse1})
        
        # Hook
        hook = self.create_controversial_hook(title, controversy_level)
        song["structure"].append({"section": "Hook", "lyrics": hook})
        
        # Verse 2 - Even more intense
        verse2 = self.generate_provocative_verse(main_persona, min(controversy_level + 1, 4), 16)
        song["structure"].append({"section": "Verse 2", "lyrics": verse2})
        
        # Hook repeat
        song["structure"].append({"section": "Hook", "lyrics": hook})
        
        # Bridge - Maximum controversy
        bridge = self.generate_provocative_verse("villain", 4, 8)
        song["structure"].append({"section": "Bridge", "lyrics": bridge})
        
        # Final Hook
        song["structure"].append({"section": "Hook", "lyrics": hook})
        
        # Outro
        outro = [
            "No apologies, no regrets",
            f"{title}, remember the name",
            "Controversial till the end",
            "Out"
        ]
        song["structure"].append({"section": "Outro", "lyrics": outro})
        
        return song
    
    def format_controversial_song(self, song: Dict) -> str:
        """Format the song with warnings and structure"""
        output = "=" * 60 + "\n"
        output += f"TITLE: {song['title']}\n"
        output += f"PERSONA: {song['persona'].upper()}\n"
        output += f"WARNING: {song['warning']}\n"
        output += f"CREATED: {song['created']}\n"
        output += "=" * 60 + "\n\n"
        
        for section in song["structure"]:
            output += f"[{section['section'].upper()}]\n"
            for line in section["lyrics"]:
                output += f"{line}\n"
            output += "\n"
        
        output += "=" * 60 + "\n"
        output += "DISCLAIMER: For artistic purposes only\n"
        output += "=" * 60 + "\n"
        
        return output

# Batch song generator
class RapAlbumGenerator:
    def __init__(self):
        self.generator = ControversialRapGenerator()
        
    def generate_album_tracklist(self, album_title: str, num_tracks: int = 10) -> List[Dict]:
        """Generate a full album of controversial tracks"""
        tracklist = []
        
        # Mix of different personas and controversy levels
        track_configs = [
            ("Intro (No Filter)", "rebel", 3),
            ("Money Over Morals", "hustler", 4),
            ("Cancelled", "villain", 4),
            ("Boss Moves", "boss", 3),
            ("Shock Treatment", "rebel", 4),
            ("Interlude (Raw Truth)", "villain", 2),
            ("Power Trip", "boss", 4),
            ("Street Philosophy", "hustler", 3),
            ("No Sacred Cows", "rebel", 4),
            ("Outro (Unapologetic)", "villain", 4)
        ]
        
        for i, (title, persona, level) in enumerate(track_configs[:num_tracks]):
            track = self.generator.create_shock_value_song(title, persona, level)
            track["track_number"] = i + 1
            tracklist.append(track)
        
        return tracklist
    
    def save_album(self, album_title: str, tracklist: List[Dict], filename: str):
        """Save the entire album to a file"""
        with open(filename, 'w') as f:
            f.write(f"ALBUM: {album_title}\n")
            f.write(f"TOTAL TRACKS: {len(tracklist)}\n")
            f.write(f"GENERATED: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
            f.write("=" * 80 + "\n\n")
            
            for track in tracklist:
                f.write(f"\nTRACK {track['track_number']}:\n")
                f.write(self.generator.format_controversial_song(track))
                f.write("\n" + "=" * 80 + "\n")

# Example usage
if __name__ == "__main__":
    # Single song examples
    generator = ControversialRapGenerator()
    
    print("GENERATING CONTROVERSIAL RAP SONGS...\n")
    
    # Different controversy levels
    songs = [
        ("Radio Edit", "hustler", 1),
        ("Explicit Version", "rebel", 2),
        ("Banned Content", "villain", 3),
        ("Maximum Shock", "rebel", 4)
    ]
    
    for title, persona, level in songs:
        song = generator.create_shock_value_song(title, persona, level)
        print(generator.format_controversial_song(song))
        print("\n" + "="*80 + "\n")
    
    # Generate full album
    album_gen = RapAlbumGenerator()
    album_tracks = album_gen.generate_album_tracklist("CONTROVERSIAL", 10)
    album_gen.save_album("CONTROVERSIAL", album_tracks, "/workspace/controversial_album.txt")