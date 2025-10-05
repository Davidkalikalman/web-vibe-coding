#!/usr/bin/env python3
"""
Interactive Controversial Rap Creator
Customizable generator for creating provocative rap lyrics
"""

import json
from datetime import datetime
from psychological_rap_generator import PsychologicalRapEngine
from advanced_rap_generator import ControversialRapGenerator

class InteractiveRapStudio:
    def __init__(self):
        self.psych_engine = PsychologicalRapEngine()
        self.controversy_engine = ControversialRapGenerator()
        self.custom_templates = {}
        
    def create_custom_song(self, config):
        """Create a custom song based on configuration"""
        song = {
            "title": config["title"],
            "artist": config.get("artist", "Anonymous"),
            "created": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "config": config,
            "lyrics": []
        }
        
        # Generate based on style
        if config["style"] == "psychological":
            return self.psych_engine.generate_maximum_impact_song(
                config["title"], 
                config.get("target_audience", "controversy_lovers")
            )
        else:
            return self.controversy_engine.create_shock_value_song(
                config["title"],
                config.get("persona", "rebel"),
                config.get("controversy_level", 3)
            )
    
    def generate_custom_bars(self, theme, keywords, num_bars=4):
        """Generate custom bars with specific keywords"""
        bars = []
        
        templates = [
            f"They said I couldn't, now I'm {keywords[0]}",
            f"Money, power, {keywords[1]}, that's the trinity",
            f"No {keywords[2]}, just results and receipts",
            f"Living like a {keywords[0]}, thinking like a {keywords[1]}"
        ]
        
        for i in range(num_bars):
            if i < len(templates):
                bars.append(templates[i])
            else:
                bars.append(f"Custom flow with {keywords[i % len(keywords)]}")
        
        return bars

# Main configuration and examples
def main():
    studio = InteractiveRapStudio()
    
    # Example configurations for different songs
    song_configs = [
        {
            "title": "Americký Sen (American Dream)",
            "style": "psychological",
            "target_audience": "success_seekers",
            "controversy_level": 3,
            "themes": ["wealth", "power", "rebellion"],
            "keywords": ["dollars", "empire", "system", "revolution"]
        },
        {
            "title": "Bez Cenzúry (No Censorship)",
            "style": "controversial",
            "persona": "rebel",
            "controversy_level": 4,
            "themes": ["freedom", "truth", "controversy"],
            "keywords": ["truth", "freedom", "cancelled", "real"]
        },
        {
            "title": "Kráľ Ulice (Street King)",
            "style": "psychological",
            "target_audience": "young_rebels",
            "controversy_level": 4,
            "themes": ["street", "hustle", "respect"],
            "keywords": ["streets", "hustle", "respect", "crown"]
        }
    ]
    
    # Generate and save songs
    output = "="*80 + "\n"
    output += "CUSTOM CONTROVERSIAL RAP COLLECTION\n"
    output += f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
    output += "="*80 + "\n\n"
    
    for config in song_configs:
        song = studio.create_custom_song(config)
        
        output += f"\nSONG: {config['title']}\n"
        output += f"STYLE: {config['style']}\n"
        output += f"CONTROVERSY LEVEL: {config.get('controversy_level', 3)}/4\n"
        output += "-"*60 + "\n"
        
        if isinstance(song, dict) and 'structure' in song:
            if 'impact_analysis' in song:
                output += studio.psych_engine.format_impact_song(song)
            else:
                output += studio.controversy_engine.format_controversial_song(song)
        else:
            output += str(song)
        
        output += "\n" + "="*80 + "\n"
    
    # Save to file
    with open("/workspace/custom_rap_collection.txt", "w") as f:
        f.write(output)
    
    # Create a special "Brother's Success" mixtape
    brothers_mixtape = """
================================================================================
MIXTAPE: "BROTHER'S SUCCESS" 
For: My Brother Who Chose The Controversial Path
================================================================================

TRACK 1: "No Apologies Intro"
[Psychological Impact: Maximum]

Look, bro, they gonna hate regardless
So we might as well give them something to talk about
Success through controversy, that's the new wave
Let me show you how it's done...

[VERSE]
They want me humble, I want a Lambo
They want me quiet, I speak in capitals  
They want me cancelled, I'm uncancellable
Money talks louder than Twitter handles

Society's rules? I use them as kindling
Building my empire while they're still thinking
Morals are luxury items, and I can afford them
But I choose chaos, it pays better, check the Forbes list

[HOOK]
No apologies, that's how we living (no cap)
Take what's mine, no permission (facts)
Controversy sells, authenticity prevails (yeah)
Brother's success, different trails (let's go)

TRACK 2: "Villain Era"
[Target Audience: Controversy Seekers]

[VERSE]
Playing the villain 'cause the hero's broke
Nice guys finish last, that's not a joke
Every hater's comment is a dollar sign
Their anger funds my lavish lifestyle, divine

Cancelled? That's free marketing, appreciate it
Trending topics, while my bank account's inflated
They discuss my morals while I discuss investments
Their outrage is my monthly dividends

[HOOK]
Villain era, profits over feelings (cash)
Breaking hearts and glass ceilings (smash)
Bad guy winning, good guys crying (facts)
Success tastes better when they're denying (racks)

TRACK 3: "American Nightmare"
[Controversy Level: EXTREME]

[VERSE]
American Dream? Nah, American Scheme
Take what you want, by any means
They sell you hope, I sell you truth
Success ain't pretty, here's the proof

Ethics are for people with trust funds
I had nothing, now I stunt
Stepped on toes to reach the top
Now I'm here, and I won't stop

Fake friends, fake love, real money though
Cut them off, let the cash flow
Loyalty's expensive, I invest in myself
Mental health? I count my wealth

[HOOK]
American Nightmare, living the dark dream (dark)
Nothing's off limits, no in-between (stark)
Morals in the rearview, money in the front (clear)
Give the people what they really want (hear)

TRACK 4: "Success Psychology"
[Maximum Viral Potential]

[VERSE]
Study the psychology, give them what they crave
Controversy and confidence, watch them rave
They say they hate it, but they can't look away
Car crash content, and it pays

Push every button, break every taboo
That's how you make it, thought you knew
They want the truth but can't handle facts
So I give them both, watch their reactions

Social media loves a villain story
Turn their hate into my glory
Every tweet against me is engagement
Every protest is my entertainment

[HOOK]
Psychology of success, controversy edition (facts)
Give them what they want, but not permission (tax)
Living rent-free in their heads, that's the mission (stacks)
Brother's winning, against tradition (max)

TRACK 5: "Outro: Letter to My Brother"

Yo bro, this the blueprint right here
They gonna hate you anyway
Might as well get paid for it
Controversy is currency in 2024
Stack your money, ignore the noise
Success is the best revenge
And revenge pays dividends

Remember:
- Every hater is a fan in denial
- Controversy creates conversation
- Conversation creates cash flow
- Cash flow creates freedom
- Freedom lets you be yourself

So be the villain they need
Not the hero they want
Get your money, live your truth
Even if that truth offends

Your brother got your back
Through every controversial track
Through every Twitter attack
We getting money, and that's facts

[FINAL BARS]
Middle fingers up, bank account up
Morals down, but the money's up
They can cancel everything except the check
Brother's success, show them respect

================================================================================

BONUS TRACKS CONCEPTS:

6. "Trigger Warning" - Maximum shock value content
7. "Cancelled Culture Club" - Embracing the controversy
8. "Moral Bankruptcy" - Trading ethics for wealth
9. "Public Enemy #1" - Being the villain they love to hate
10. "No Sacred Cows" - Breaking every taboo

MARKETING STRATEGY:
- Release most controversial track first
- Let the outrage build organic buzz
- Drop response track to the backlash
- Monetize every negative comment
- Turn protests into profit

PSYCHOLOGICAL TACTICS:
- Say what others think but won't say
- Push boundaries just enough to trend
- Create quotable, memeable content
- Always stay one step ahead of cancel culture
- Never apologize, double down instead

Remember: In the attention economy, 
controversy is the most valuable currency.

================================================================================
    """
    
    with open("/workspace/brothers_success_mixtape.txt", "w") as f:
        f.write(brothers_mixtape)
    
    print("Custom rap collection created!")
    print("Files generated:")
    print("- /workspace/custom_rap_collection.txt")
    print("- /workspace/brothers_success_mixtape.txt")
    print("- /workspace/controversial_album.txt")
    print("- /workspace/MAXIMUM IMPACT_analysis.txt")

if __name__ == "__main__":
    main()