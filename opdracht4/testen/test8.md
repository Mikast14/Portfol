# Test 8: Publiek Profiel Pagina (US-11)

## Testplan

### Gerelateerde User Story
**US-11: Publiek Profiel Pagina**
- Als gebruiker wil ik een pagina waar bezoekers mijn profiel kunnen bekijken zodat de bezoeker overview kan hebben van mijn projecten

### Testscenario's
1. **Scenario 8.1: Profiel pagina layout**
   - Profielpagina heeft correcte layout met alle secties
   - Gerelateerd aan Task #89

2. **Scenario 8.2: Gebruikersinformatie weergeven**
   - Gebruikersinformatie wordt correct opgehaald en weergegeven
   - Gerelateerd aan Task #90

3. **Scenario 8.3: Projecten weergeven op profiel**
   - Alle publieke projecten van gebruiker worden getoond
   - Gerelateerd aan Task #90

4. **Scenario 8.4: GitHub informatie weergeven**
   - GitHub informatie wordt getoond indien beschikbaar
   - Gerelateerd aan Task #90

5. **Scenario 8.5: Skill tree weergeven**
   - Skill tree wordt getoond indien geïmplementeerd
   - Gerelateerd aan Task #90

6. **Scenario 8.6: Responsive design**
   - Profielpagina is responsive op verschillende schermformaten
   - Gerelateerd aan Task #89

### Samenhang met andere User Stories
- **US-2**: Projecten aangemaakt via US-2 moeten zichtbaar zijn op profiel
- **US-8**: Klikken op projectcard moet naar project detailpagina navigeren
- **US-13**: GitHub informatie moet worden getoond indien gekoppeld
- **US-14**: Skill tree moet worden getoond indien geïmplementeerd

---

## Stap-voor-stap Testinstructies

### Scenario 8.1: Profiel pagina layout

**Voorbereiding:**
- Minimaal 1 gebruiker moet bestaan met profiel informatie

**Stappen:**
1. Navigeer naar profielpagina van een gebruiker (bijv. `/user/[username]`)
2. Controleer dat de volgende secties aanwezig zijn:
   - Header sectie met gebruikersnaam, bio en profielfoto
   - Sectie voor contactinformatie en links (indien beschikbaar)
   - Sectie voor projecten grid
   - GitHub informatie sectie (indien beschikbaar)
   - Skill tree sectie (indien geïmplementeerd)
3. Controleer de layout:
   - Elementen zijn goed georganiseerd
   - Spacing is consistent
   - Design is professioneel
4. Controleer dat design consistent is met de rest van de applicatie
5. Test navigatie:
   - Klik op links in contactinformatie (indien aanwezig)
   - Controleer dat links werken

**Gewenst resultaat:**
- Profielpagina heeft duidelijke layout met header sectie
- Layout toont gebruikersnaam, bio en profielfoto
- Layout heeft sectie voor contactinformatie en links
- Layout heeft sectie voor projecten grid
- Layout is responsive en gebruiksvriendelijk
- Design is consistent met de rest van de applicatie

**Alternatief pad 8.1a: Gebruiker zonder profiel informatie**
- Testdata: Gebruiker met minimale profiel informatie
- Gewenst resultaat: Pagina werkt nog steeds, lege velden worden niet getoond

---

### Scenario 8.2: Gebruikersinformatie weergeven

**Voorbereiding:**
- Gebruiker met volledige profiel informatie moet bestaan

**Testdata:**
- Gebruikersnaam: `testuser`
- Bio: `Dit is een test bio voor het profiel`
- Profielfoto: [Afbeelding]
- Contactinformatie: Email, website, social media links

**Stappen:**
1. Navigeer naar profielpagina van gebruiker
2. Controleer dat gebruikersinformatie wordt opgehaald uit database:
   - Gebruikersnaam wordt correct getoond
   - Bio wordt correct getoond
   - Profielfoto wordt getoond (indien aanwezig)
3. Controleer contactinformatie:
   - Email wordt getoond (indien publiek) of verborgen
   - Website link werkt (indien aanwezig)
   - Social media links werken (indien aanwezig)
4. Controleer dat informatie correct geformatteerd is:
   - Tekst is leesbaar
   - Links zijn klikbaar
   - Afbeeldingen worden correct weergegeven

**Gewenst resultaat:**
- Gebruikersinformatie wordt opgehaald uit database
- Alle informatie wordt correct weergegeven
- Informatie is correct geformatteerd
- Links werken correct
- Privacy instellingen worden gerespecteerd (email verborgen indien privé)

**Alternatief pad 8.2a: Gebruiker zonder bio**
- Testdata: Gebruiker zonder bio ingevuld
- Gewenst resultaat: Bio sectie wordt niet getoond of toont placeholder

**Alternatief pad 8.2b: Gebruiker zonder profielfoto**
- Testdata: Gebruiker zonder profielfoto
- Gewenst resultaat: Standaard avatar wordt getoond

---

### Scenario 8.3: Projecten weergeven op profiel

**Voorbereiding:**
- Gebruiker moet minimaal 3 publieke projecten hebben

**Stappen:**
1. Navigeer naar profielpagina van gebruiker
2. Zoek projecten sectie op de pagina
3. Controleer dat alle publieke projecten worden getoond:
   - Tel het aantal projectcards
   - Vergelijk met aantal publieke projecten in database
4. Controleer dat private projecten NIET worden getoond:
   - Alleen publieke projecten zijn zichtbaar
5. Controleer project weergave:
   - Projecten worden getoond in grid of lijst
   - Elke projectcard toont:
     - Project titel
     - Project beschrijving (verkort)
     - Thumbnail/afbeelding
   - Projectcards zijn klikbaar
6. Klik op een projectcard
7. Controleer dat je naar project detailpagina wordt doorgestuurd
8. Controleer sortering:
   - Projecten zijn gesorteerd op datum (nieuwste eerst) of andere logica

**Gewenst resultaat:**
- Alle publieke projecten van de gebruiker worden getoond
- Private projecten worden niet getoond
- Projecten worden getoond in grid of lijst weergave
- Elke projectcard toont benodigde informatie
- Klikken op projectcard navigeert naar project detailpagina
- Projecten zijn correct gesorteerd

**Alternatief pad 8.3a: Gebruiker zonder projecten**
- Testdata: Gebruiker heeft geen projecten
- Gewenst resultaat: Lege state wordt getoond: "Deze gebruiker heeft nog geen projecten"

**Alternatief pad 8.3b: Alleen private projecten**
- Testdata: Gebruiker heeft alleen private projecten
- Gewenst resultaat: Lege state wordt getoond (geen projecten zichtbaar)

---

### Scenario 8.4: GitHub informatie weergeven

**Voorbereiding:**
- Gebruiker moet GitHub account gekoppeld hebben

**Stappen:**
1. Navigeer naar profielpagina van gebruiker met GitHub koppeling
2. Zoek GitHub informatie sectie
3. Controleer dat GitHub informatie wordt getoond:
   - GitHub username wordt getoond
   - GitHub avatar wordt getoond (indien beschikbaar)
   - Link naar GitHub profiel werkt
   - Repository statistieken worden getoond (indien geïmplementeerd)
4. Test GitHub link:
   - Klik op GitHub link
   - Controleer dat je naar GitHub profiel wordt doorgestuurd (nieuwe tab)
5. Controleer loading states:
   - GitHub informatie wordt geladen tijdens API call
   - Loading indicator wordt getoond (indien geïmplementeerd)

**Gewenst resultaat:**
- GitHub informatie wordt opgehaald wanneer beschikbaar
- GitHub informatie wordt getoond op het profiel
- Loading states worden getoond tijdens API calls
- Error states worden getoond bij API fouten (indien van toepassing)
- GitHub link werkt correct

**Alternatief pad 8.4a: Gebruiker zonder GitHub koppeling**
- Testdata: Gebruiker heeft geen GitHub gekoppeld
- Gewenst resultaat: GitHub sectie wordt niet getoond

**Alternatief pad 8.4b: GitHub API error**
- Testdata: GitHub API retourneert error
- Gewenst resultaat: Error state wordt getoond of GitHub sectie wordt verborgen

---

### Scenario 8.5: Skill tree weergeven

**Voorbereiding:**
- Gebruiker moet skill tree hebben geconfigureerd (indien geïmplementeerd)

**Stappen:**
1. Navigeer naar profielpagina van gebruiker met skill tree
2. Zoek skill tree sectie
3. Controleer dat skill tree wordt getoond:
   - Skills worden opgehaald uit database
   - Skills worden visueel weergegeven (progress bars, badges, etc.)
   - Vaardigheidsniveau wordt getoond per skill
4. Controleer sortering:
   - Skills zijn gesorteerd op vaardigheidsniveau of alfabetisch
5. Controleer responsive design:
   - Skill tree is zichtbaar op alle schermformaten
   - Layout past zich aan aan schermformaat

**Gewenst resultaat:**
- Skill tree wordt opgehaald uit database
- Skill tree wordt visueel weergegeven op het profiel
- Skills worden gesorteerd op vaardigheidsniveau of alfabetisch
- Skill tree is responsive en zichtbaar op alle schermformaten
- Skill tree is zichtbaar op het publieke profiel

**Alternatief pad 8.5a: Gebruiker zonder skill tree**
- Testdata: Gebruiker heeft geen skills geconfigureerd
- Gewenst resultaat: Skill tree sectie wordt niet getoond

**Alternatief pad 8.5b: Skill tree niet geïmplementeerd**
- Testdata: Functionaliteit niet beschikbaar
- Gewenst resultaat: Sectie wordt niet getoond, geen errors

---

### Scenario 8.6: Responsive design

**Testdata:**
- Verschillende schermformaten:
  - Desktop: 1920x1080
  - Tablet: 768x1024
  - Mobiel: 375x667

**Stappen voor Desktop:**
1. Open profielpagina op desktop (1920x1080)
2. Controleer layout:
   - Alle secties zijn goed zichtbaar
   - Project grid toont meerdere kolommen
   - Informatie is goed georganiseerd

**Stappen voor Tablet:**
1. Stel viewport in op tablet formaat (768x1024)
2. Controleer layout:
   - Layout past zich aan
   - Project grid toont minder kolommen
   - Content blijft leesbaar

**Stappen voor Mobiel:**
1. Stel viewport in op mobiel formaat (375x667)
2. Controleer layout:
   - Layout is geoptimaliseerd voor mobiel
   - Project grid toont 1 kolom
   - Tekst is leesbaar zonder horizontaal scrollen
   - Knoppen zijn groot genoeg om te klikken
   - Profielfoto en header zijn goed zichtbaar

**Gewenst resultaat:**
- Desktop: Alle elementen zijn goed zichtbaar en georganiseerd
- Tablet: Layout past zich aan, content blijft leesbaar
- Mobiel: Layout is geoptimaliseerd, geen horizontaal scrollen
- Alle functionaliteit werkt op alle schermformaten

---

## Testrapport

### Testuitvoering
**Datum:** [Vul datum in]  
**Tester:** [Vul naam in]  
**Applicatie versie:** [Vul versie in]  
**Browser:** [Vul browser in]  
**Geteste gebruikersnaam:** [Username]

### Resultaten per Scenario

#### Scenario 8.1: Profiel pagina layout
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 8.2: Gebruikersinformatie weergeven
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 8.3: Projecten weergeven op profiel
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Aantal projecten getoond:** [Aantal]
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 8.4: GitHub informatie weergeven
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **GitHub gekoppeld:** ☐ Ja ☐ Nee
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 8.5: Skill tree weergeven
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Skill tree geïmplementeerd:** ☐ Ja ☐ Nee
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 8.6: Responsive design
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Desktop:** ☐ Geslaagd ☐ Gefaald
- **Tablet:** ☐ Geslaagd ☐ Gefaald
- **Mobiel:** ☐ Geslaagd ☐ Gefaald
- **Opmerkingen:** 
  - [Vul opmerkingen in]

### Alternatieve Paden

#### Alternatief pad 8.1a: Gebruiker zonder profiel informatie
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 8.2a: Gebruiker zonder bio
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 8.2b: Gebruiker zonder profielfoto
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 8.3a: Gebruiker zonder projecten
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 8.3b: Alleen private projecten
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 8.4a: Gebruiker zonder GitHub
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 8.4b: GitHub API error
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 8.5a: Gebruiker zonder skill tree
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 8.5b: Skill tree niet geïmplementeerd
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- [Beschrijf algemene bevindingen over profielpagina functionaliteit]

**Samenhang met andere User Stories:**
- **US-2 (Projecten)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe projecten van US-2 zichtbaar zijn op profiel]
- **US-8 (Project Detail)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe navigatie werkt naar project detailpagina]
- **US-13 (GitHub)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe GitHub informatie wordt getoond]
- **US-14 (Skill Tree)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe skill tree wordt getoond]

**Aanbevelingen:**
- [Lijst met aanbevelingen]

**Kritieke issues:**
- [Lijst met kritieke problemen]

**Totaal aantal tests:** 6 scenario's + 9 alternatieve paden = 15 tests  
**Geslaagd:** [Aantal]  
**Gefaald:** [Aantal]  
**Niet uitgevoerd:** [Aantal]  
**Succespercentage:** [Percentage]%
