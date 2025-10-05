#!/usr/bin/env python3
"""
Psychological Impact Rap Generator
Uses psychological triggers and controversial elements for maximum audience impact
Based on understanding of what makes content viral and memorable
"""

import random
from typing import List, Dict, Tuple
import json

class PsychologicalRapEngine:
    def __init__(self):
        # Psychological triggers that resonate with audiences
        self.psychological_triggers = {
            "rebellion": {
                "description": "Anti-authority, breaking rules",
                "keywords": ["system", "rules", "rebel", "break", "defy"],
                "impact": "Appeals to desire for freedom and independence"
            },
            "superiority": {
                "description": "Being better than others",
                "keywords": ["above", "king", "throne", "peasants", "levels"],
                "impact": "Feeds ego and competitive nature"
            },
            "shock": {
                "description": "Unexpected, controversial statements",
                "keywords": ["controversial", "cancelled", "savage", "ruthless"],
                "impact": "Creates memorable moments, generates discussion"
            },
            "taboo": {
                "description": "Topics society avoids",
                "keywords": ["forbidden", "dark", "secret", "hidden", "real"],
                "impact": "Curiosity and forbidden fruit effect"
            },
            "power": {
                "description": "Dominance and control",
                "keywords": ["control", "power", "boss", "empire", "conquer"],
                "impact": "Power fantasy fulfillment"
            }
        }
        
        # Viral formula elements
        self.viral_elements = {
            "quotable_lines": [
                "They hate us 'cause they ain't us",
                "Sleep is for people who are broke",
                "I don't have friends, I have family... and money",
                "Success is my only option, failure's not",
                "I'm not a businessman, I'm a business, man"
            ],
            "controversial_hooks": [
                "Money over everything, even family",
                "Morals are expensive, I can afford them",
                "Nice guys finish last, I finish first",
                "Love is temporary, money is forever"
            ],
            "shock_statements": [
                "Your opinion died when my bank account thrived",
                "I'd sell my soul but the devil can't afford me",
                "Feelings are for people with empty pockets",
                "Trust nobody, not even nobody"
            ]
        }
        
        # Audience psychology profiles
        self.audience_profiles = {
            "young_rebels": {
                "age": "16-24",
                "triggers": ["rebellion", "shock", "taboo"],
                "wants": "To feel different, edgy, unique"
            },
            "success_seekers": {
                "age": "20-35",
                "triggers": ["superiority", "power", "wealth"],
                "wants": "Motivation, success mindset, alpha mentality"
            },
            "controversy_lovers": {
                "age": "18-40",
                "triggers": ["shock", "taboo", "extreme"],
                "wants": "Entertainment, discussion topics, viral content"
            }
        }
        
    def analyze_impact_score(self, lyrics: List[str]) -> Dict[str, float]:
        """Analyze psychological impact score of lyrics"""
        scores = {
            "controversy": 0,
            "memorability": 0,
            "virality": 0,
            "shock_value": 0,
            "quotability": 0
        }
        
        for line in lyrics:
            line_lower = line.lower()
            
            # Check for controversial elements
            for trigger_type, trigger_data in self.psychological_triggers.items():
                for keyword in trigger_data["keywords"]:
                    if keyword in line_lower:
                        scores["controversy"] += 1
                        if trigger_type in ["shock", "taboo"]:
                            scores["shock_value"] += 2
            
            # Check quotability (short, punchy lines)
            if len(line) < 50 and line.count(",") <= 1:
                scores["quotability"] += 1
            
            # Virality check (controversial + quotable)
            if scores["controversy"] > 0 and scores["quotability"] > 0:
                scores["virality"] += 2
        
        # Normalize scores
        max_score = max(len(lyrics), 1)
        for key in scores:
            scores[key] = min(scores[key] / max_score * 10, 10)
        
        return scores
    
    def generate_psychological_hook(self, target_audience: str, impact_level: str = "high") -> List[str]:
        """Generate hook targeting specific audience psychology"""
        audience = self.audience_profiles.get(target_audience, self.audience_profiles["controversy_lovers"])
        
        if impact_level == "extreme":
            hook_base = random.choice(self.viral_elements["shock_statements"])
            hooks = [
                hook_base,
                "That's just how I feel, no cap (no cap)",
                hook_base.replace(",", ", yeah,"),
                "Deal with it or get dealt with (facts)"
            ]
        elif impact_level == "high":
            hook_base = random.choice(self.viral_elements["controversial_hooks"])
            hooks = [
                hook_base + " (yeah)",
                "Living by my rules, not yours (never)",
                hook_base + " (uh)",
                "That's the code, that's the motto (let's go)"
            ]
        else:
            hook_base = random.choice(self.viral_elements["quotable_lines"])
            hooks = [
                hook_base,
                "Remember that, write it down",
                hook_base + ", facts",
                "No debate, case closed"
            ]
        
        return hooks
    
    def create_viral_verse(self, psychological_triggers: List[str], bars: int = 16) -> List[str]:
        """Create verse with specific psychological triggers"""
        verse = []
        
        # Intro bars - set the tone
        intro_templates = [
            "Listen close, I'm about to hurt some feelings",
            "Truth hurts, but lies hurt more",
            "Cancel me, I'll cancel your whole existence",
            "Politically incorrect and financially correct"
        ]
        
        # Body bars - incorporate triggers
        body_templates = {
            "rebellion": [
                "Rules are made to be broken, I'm the proof",
                "System trying to box me in, I broke out",
                "They want me to conform, I'd rather transform",
                "Mainstream thinking for mainstream people"
            ],
            "superiority": [
                "Different tax bracket, different conversation",
                "You're playing checkers, I'm playing chess",
                "Levels to this game, you're still tutorial",
                "My worst day beats your best day"
            ],
            "shock": [
                "Say what they thinking but scared to say",
                "Uncomfortable truths over comfortable lies",
                "If you're offended, you're the target audience",
                "Controversy is just honesty without filter"
            ],
            "power": [
                "I don't ask permission, I grant it",
                "Power moves only, no lateral steps",
                "King of my domain, you're just visiting",
                "Control the narrative, control the game"
            ]
        }
        
        # Build verse
        verse.append(random.choice(intro_templates))
        
        for i in range(1, bars):
            if i % 4 == 0:
                # Punchline every 4 bars
                verse.append("That's facts, no printer")
            else:
                trigger = random.choice(psychological_triggers)
                if trigger in body_templates:
                    verse.append(random.choice(body_templates[trigger]))
                else:
                    verse.append(f"Living life with no {trigger} filter")
        
        return verse[:bars]
    
    def generate_maximum_impact_song(self, title: str, target_audience: str = "controversy_lovers") -> Dict:
        """Generate song designed for maximum psychological impact"""
        audience = self.audience_profiles[target_audience]
        
        song = {
            "title": title,
            "target_audience": target_audience,
            "psychological_profile": audience,
            "impact_analysis": {},
            "structure": []
        }
        
        # Intro - Hook them immediately
        intro = [
            f"Warning: {title}",
            "Explicit content, implicit message",
            "If you're easily offended, press skip",
            "For everyone else, let's begin"
        ]
        song["structure"].append({"section": "Intro", "lyrics": intro})
        
        # Verse 1 - Build controversy
        verse1 = self.create_viral_verse(audience["triggers"], 16)
        song["structure"].append({"section": "Verse 1", "lyrics": verse1})
        
        # Hook - Maximum impact
        hook = self.generate_psychological_hook(target_audience, "extreme")
        song["structure"].append({"section": "Hook", "lyrics": hook})
        
        # Verse 2 - Escalate
        verse2 = self.create_viral_verse(["shock", "taboo", "power"], 16)
        song["structure"].append({"section": "Verse 2", "lyrics": verse2})
        
        # Hook repeat
        song["structure"].append({"section": "Hook", "lyrics": hook})
        
        # Bridge - Most controversial part
        bridge = [
            "This the part that gets me cancelled",
            "But being cancelled made me richer",
            "Controversy sells, authenticity prevails",
            "They love to hate me, I love their hatred",
            "Every hater is a fan in denial",
            "My success is their biggest trigger",
            "Living proof that nice guys finish last",
            "Villain role pays better than the hero"
        ]
        song["structure"].append({"section": "Bridge", "lyrics": bridge})
        
        # Final Hook
        song["structure"].append({"section": "Hook", "lyrics": hook})
        
        # Outro
        outro = [
            "If you made it this far, you're real",
            "Everyone else, stay mad",
            f"{title}, remember where you heard it",
            "Controversial and proud"
        ]
        song["structure"].append({"section": "Outro", "lyrics": outro})
        
        # Analyze impact
        all_lyrics = []
        for section in song["structure"]:
            all_lyrics.extend(section["lyrics"])
        
        song["impact_analysis"] = self.analyze_impact_score(all_lyrics)
        
        return song
    
    def format_impact_song(self, song: Dict) -> str:
        """Format song with psychological impact analysis"""
        output = "="*70 + "\n"
        output += f"TITLE: {song['title']}\n"
        output += f"TARGET AUDIENCE: {song['target_audience']}\n"
        output += f"AUDIENCE PROFILE: {json.dumps(song['psychological_profile'], indent=2)}\n"
        output += "="*70 + "\n\n"
        
        # Impact scores
        output += "PSYCHOLOGICAL IMPACT ANALYSIS:\n"
        for metric, score in song['impact_analysis'].items():
            output += f"  {metric.upper()}: {'█' * int(score)} {score:.1f}/10\n"
        output += "\n"
        
        # Lyrics
        for section in song["structure"]:
            output += f"[{section['section'].upper()}]\n"
            for line in section["lyrics"]:
                output += f"{line}\n"
            output += "\n"
        
        output += "="*70 + "\n"
        output += "VIRAL POTENTIAL: "
        avg_score = sum(song['impact_analysis'].values()) / len(song['impact_analysis'])
        if avg_score > 7:
            output += "EXTREMELY HIGH ⚡⚡⚡"
        elif avg_score > 5:
            output += "HIGH ⚡⚡"
        else:
            output += "MODERATE ⚡"
        output += "\n"
        output += "="*70 + "\n"
        
        return output

# Song collection generator
class ViralRapCollection:
    def __init__(self):
        self.engine = PsychologicalRapEngine()
        
    def generate_viral_mixtape(self, mixtape_name: str) -> List[Dict]:
        """Generate a collection of songs optimized for virality"""
        tracks = []
        
        # Different songs for different audiences and moods
        track_configs = [
            ("No Apologies", "young_rebels"),
            ("Cancelled Culture", "controversy_lovers"),
            ("Money Talks", "success_seekers"),
            ("Villain Origin Story", "controversy_lovers"),
            ("Truth Hurts", "young_rebels"),
            ("Power Moves Only", "success_seekers"),
            ("Shock Therapy", "controversy_lovers"),
            ("Breaking Bad", "young_rebels"),
            ("Success Is Revenge", "success_seekers"),
            ("Unfiltered", "controversy_lovers")
        ]
        
        for i, (title, audience) in enumerate(track_configs):
            track = self.engine.generate_maximum_impact_song(title, audience)
            track["track_number"] = i + 1
            tracks.append(track)
        
        return tracks
    
    def save_mixtape_analysis(self, mixtape_name: str, tracks: List[Dict]):
        """Save mixtape with full psychological analysis"""
        filename = f"/workspace/{mixtape_name.lower().replace(' ', '_')}_analysis.txt"
        
        with open(filename, 'w') as f:
            f.write(f"MIXTAPE: {mixtape_name}\n")
            f.write(f"TOTAL TRACKS: {len(tracks)}\n")
            f.write("="*80 + "\n\n")
            
            # Overall statistics
            total_scores = {
                "controversy": 0,
                "memorability": 0,
                "virality": 0,
                "shock_value": 0,
                "quotability": 0
            }
            
            for track in tracks:
                f.write(f"\nTRACK {track['track_number']}:\n")
                f.write(self.engine.format_impact_song(track))
                f.write("\n")
                
                # Add to totals
                for metric, score in track['impact_analysis'].items():
                    total_scores[metric] += score
            
            # Mixtape summary
            f.write("\n" + "="*80 + "\n")
            f.write("MIXTAPE PSYCHOLOGICAL IMPACT SUMMARY:\n")
            f.write("="*80 + "\n")
            
            for metric, total in total_scores.items():
                avg = total / len(tracks)
                f.write(f"{metric.upper()} AVERAGE: {avg:.1f}/10\n")
            
            overall_avg = sum(total_scores.values()) / (len(total_scores) * len(tracks))
            f.write(f"\nOVERALL VIRAL POTENTIAL: {overall_avg:.1f}/10")
            
            if overall_avg > 7:
                f.write(" - EXTREMELY HIGH! 🔥🔥🔥")
            elif overall_avg > 5:
                f.write(" - HIGH! 🔥🔥")
            else:
                f.write(" - MODERATE 🔥")
            
            f.write("\n" + "="*80 + "\n")

# Example usage
if __name__ == "__main__":
    # Single songs
    engine = PsychologicalRapEngine()
    
    print("GENERATING PSYCHOLOGICALLY OPTIMIZED RAP SONGS...\n")
    
    # Generate for different audiences
    audiences = ["young_rebels", "success_seekers", "controversy_lovers"]
    
    for audience in audiences:
        song = engine.generate_maximum_impact_song(f"Target: {audience}", audience)
        print(engine.format_impact_song(song))
        print("\n")
    
    # Generate full mixtape
    collection = ViralRapCollection()
    mixtape_tracks = collection.generate_viral_mixtape("MAXIMUM IMPACT")
    collection.save_mixtape_analysis("MAXIMUM IMPACT", mixtape_tracks)