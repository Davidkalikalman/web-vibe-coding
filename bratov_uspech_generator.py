#!/usr/bin/env python3
"""
Bratov Úspech - Kontroverzný Rap Generátor
Špecializovaný na vytváranie amerických rap textov s maximálnym dopadom
"""

import random
from typing import List, Dict

class BratovUspechGenerator:
    def __init__(self):
        # Slovensko-americké frázy
        self.sk_to_us_phrases = {
            "úspech": ["success", "winning", "getting bags"],
            "peniaze": ["money", "cash", "bands", "racks"],
            "hateri": ["haters", "ops", "enemies"],
            "pravda": ["truth", "facts", "real talk"],
            "kontroverzný": ["controversial", "cancelled", "problematic"],
            "brat": ["brother", "bro", "family"]
        }
        
        # Psychologické triggery pre americké publikum
        self.american_triggers = {
            "wealth_flex": [
                "Started with nothing, now we here counting millions",
                "Poor people got opinions, rich people got options",
                "Money talks in every language, broke is universal",
                "Success is my revenge, prosperity my weapon"
            ],
            "anti_system": [
                "They built the system, I hacked the code",
                "Rules are suggestions when you got the funds",
                "Law and order for the poor, lawyers for the rich",
                "Playing by their rules? That's how you stay broke"
            ],
            "toxic_masculinity": [
                "Alpha mentality in a beta world",
                "Emotions are expensive, I can't afford them",
                "Nice guys finish last, I finish first",
                "Sensitivity is poverty mindset"
            ],
            "controversy": [
                "Cancel me, I'll trend harder",
                "Your outrage funds my lifestyle",
                "Controversy is free marketing",
                "Being hated profitably > being loved broke"
            ]
        }
        
        # Americké slang a výrazy
        self.american_slang = {
            "money": ["bread", "dough", "cheese", "guap", "paper", "benjamins"],
            "success": ["winning", "balling", "flexing", "stunting", "shining"],
            "haters": ["ops", "opposition", "snakes", "fakes", "peasants"],
            "real": ["authentic", "genuine", "100", "solid", "certified"]
        }
        
    def generate_bratov_track(self, theme: str, intensity: int = 10) -> Dict:
        """Generuj track pre bratov úspech"""
        
        track = {
            "title": f"{theme} - Bratov Mix",
            "intensity": f"{intensity}/10 (MAXIMÁLNA KONTROVERZIA)",
            "warning": "EXPLICIT CONTENT - AMERICKÝ ŠTÝL",
            "structure": []
        }
        
        # Intro - Slovenský touch s americkou energiou
        intro = [
            "Yeah, bratov úspech in this American dream",
            "They said we couldn't, teraz sme na vrchole (now we on top)",
            "No filter, no censor, just raw success",
            "Pre môjho brata (for my brother), let's get it"
        ]
        track["structure"].append({"section": "INTRO", "lyrics": intro})
        
        # Verse 1 - Maximum controversy
        verse1 = self.generate_controversial_verse("wealth_and_power", 16)
        track["structure"].append({"section": "VERSE 1", "lyrics": verse1})
        
        # Hook - Catchy and controversial
        hook = [
            "Bratov úspech, money over morals (facts)",
            "Cancel culture crying while we counting dollars (racks)",
            "Controversy sells, authenticity prevails (real)",
            "Living like villains, but the check never fails (steel)"
        ]
        track["structure"].append({"section": "HOOK", "lyrics": hook})
        
        # Verse 2 - Even more intense
        verse2 = self.generate_controversial_verse("anti_establishment", 16)
        track["structure"].append({"section": "VERSE 2", "lyrics": verse2})
        
        # Hook repeat
        track["structure"].append({"section": "HOOK", "lyrics": hook})
        
        # Bridge - Peak controversy
        bridge = [
            "This for my brother who chose the dark path",
            "Morals don't pay bills, controversy brings cash",
            "They hate our success but love our downfall",
            "Stay mad while we rise, we taking it all",
            "Slovenský duch (Slovak spirit), americký sen (American dream)",
            "Breaking every rule from here to marine",
            "Cancelled today, millionaire tomorrow",
            "Your tears of rage, that's what we follow"
        ]
        track["structure"].append({"section": "BRIDGE", "lyrics": bridge})
        
        # Outro
        outro = [
            "Pre môjho brata (for my brother), we made it",
            "Controversial and compensated",
            "They can hate the method but not the results",
            "Bratov úspech, no insults, just vaults"
        ]
        track["structure"].append({"section": "OUTRO", "lyrics": outro})
        
        return track
    
    def generate_controversial_verse(self, theme: str, bars: int) -> List[str]:
        """Generuj kontroverzný verse"""
        verse = []
        
        # Mixuj rôzne kontroverzné elementy
        templates = [
            # Wealth flex
            "Bank account looking like phone numbers, international",
            "Your girl in my DMs while you being emotional",
            "Money conversations only, broke boys stay quiet",
            "Ethics are for people who can't afford lawyers",
            
            # Anti-system
            "System wasn't built for us, so we built our own",
            "Tax evasion? I call it wealth preservation",
            "Government wants half, I give them motivation",
            "Laws are for followers, I'm a creator",
            
            # Toxic success
            "Stepped on toes to reach the top, no regrets",
            "Friends are liabilities, money never lies",
            "Trust nobody, verify everybody, cash everything",
            "Loyalty's expensive, betrayal's profitable",
            
            # Maximum controversy
            "Morals are poor people's coping mechanism",
            "Cancel me today, pay me tomorrow",
            "Your protests fund my next investment",
            "Controversy's my currency, hate's my fuel"
        ]
        
        # Vyber náhodné bary
        for i in range(bars):
            if i < len(templates):
                verse.append(templates[i])
            else:
                verse.append(random.choice(templates))
        
        return verse[:bars]
    
    def create_success_blueprint(self) -> str:
        """Vytvor blueprint pre bratov úspech"""
        blueprint = """
================================================================================
BRATOV ÚSPECH - SUCCESS BLUEPRINT
"Pre môjho brata čo si vybral kontroverznu cestu"
================================================================================

ZÁKLADNÉ PRAVIDLÁ ÚSPECHU V AMERICKOM RAPE:

1. KONTROVERZIA = PENIAZE
   - Čím viac ťa kritizujú, tým viac zarobiš
   - Každý hater je skrytý fanúšik
   - Outrage marketing je najlacnejší marketing

2. PSYCHOLÓGIA AMERICKÉHO PUBLIKA:
   - Milujú sebavedomie až aroganciu
   - Tajne obdivujú tých čo porušujú pravidlá
   - Chcú žiť cez teba fantáziu bohatstva a moci
   - Rešpektujú peniaze viac ako morálku

3. VIRAL FORMULA:
   - Šokuj v prvých 10 sekundách
   - Použi kontroverzné one-linery
   - Mixuj bohatstvo + sex + moc + rebeliu
   - Never apologize, always double down

4. CONTENT STRATEGY:
   Week 1: Drop najkontroverznejší track
   Week 2: Reaguj na backlash ešte horším trackom  
   Week 3: "Behind the controversy" - vysvetli že je to umenie
   Week 4: Drop "pre haterov" track kde sa z nich smeješ

5. ZAKÁZANÉ TÉMY (KTORÉ FUNGUJÚ):
   - Peniaze > Rodina
   - Úspech > Morálka
   - Materiálne > Duchovné
   - Individualita > Spoločnosť

KONKRÉTNE PRÍKLADY KONTROVERZNÝCH BAROV:

"Mama said be humble, I bought her a mansion"
"Morals are for people with regular jobs"
"Cancel culture made me a millionaire"
"Your girlfriend likes my music more than you"
"Started from Slovakia, now I'm too American"
"Success speaks louder than your Twitter fingers"
"They protesting outside while I'm investing inside"
"Broke people got opinions, rich people got options"

REMEMBER:
V Amerike platí: "There's no such thing as bad publicity"
Kontroverzia je len iné slovo pre "viral marketing"
Tvoj brat chce úspech? Daj mu tieto zbrane.

Stay controversial, stay profitable.

- Tvoj brat čo pozná hru

================================================================================
        """
        return blueprint

# Hlavný program
def main():
    generator = BratovUspechGenerator()
    
    print("GENERUJEM KONTROVERZNÉ TRACKY PRE BRATOV ÚSPECH...\n")
    
    # Vygeneruj rôzne tracky
    themes = [
        "Money Over Everything",
        "Cancelled But Paid",
        "Villain Success Story",
        "No Morals Mo Money"
    ]
    
    all_tracks = []
    
    for theme in themes:
        track = generator.generate_bratov_track(theme, 10)
        all_tracks.append(track)
        
        # Vypíš track
        print("="*70)
        print(f"TRACK: {track['title']}")
        print(f"INTENZITA: {track['intensity']}")
        print(f"WARNING: {track['warning']}")
        print("="*70)
        
        for section in track["structure"]:
            print(f"\n[{section['section']}]")
            for line in section["lyrics"]:
                print(line)
        
        print("\n")
    
    # Ulož blueprint
    with open("/workspace/bratov_uspech_blueprint.txt", "w") as f:
        f.write(generator.create_success_blueprint())
    
    # Ulož všetky tracky
    with open("/workspace/bratov_uspech_tracky.txt", "w") as f:
        for track in all_tracks:
            f.write("="*80 + "\n")
            f.write(f"TRACK: {track['title']}\n")
            f.write(f"{track['intensity']}\n")
            f.write(f"WARNING: {track['warning']}\n")
            f.write("="*80 + "\n\n")
            
            for section in track["structure"]:
                f.write(f"[{section['section']}]\n")
                for line in section["lyrics"]:
                    f.write(f"{line}\n")
                f.write("\n")
            
            f.write("\n")
    
    print("\nSÚBORY VYTVORENÉ:")
    print("- /workspace/bratov_uspech_blueprint.txt - Návod na úspech")
    print("- /workspace/bratov_uspech_tracky.txt - Hotové kontroverzné tracky")
    print("\nPre tvoj bratov úspech! 💰🔥")

if __name__ == "__main__":
    main()