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

4. **Scenario 8.4: Skill tree weergeven**
   - Skill tree wordt getoond
   - Gerelateerd aan Task #90

### Samenhang met andere User Stories
- **US-2**: Projecten aangemaakt via US-2 moeten zichtbaar zijn op profiel
- **US-8**: Klikken op projectcard moet naar project detailpagina navigeren
- **US-14**: Skill tree moet worden getoond indien geïmplementeerd

---

## Stap-voor-stap Testinstructies

### Scenario 8.1: Profiel pagina layout

**Voorbereiding:**
- Minimaal 1 gebruiker moet bestaan met profiel informatie

**Stappen:**
1. Navigeer naar profielpagina van een gebruiker (bijv. `/user/[username]`)
2. Controleer dat de volgende secties aanwezig zijn:
   - Header sectie met gebruikersnaam en profielfoto
   - Sectie voor projecten grid
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
- Layout toont gebruikersnaam en profielfoto
- Layout heeft sectie voor projecten grid
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
- Profielfoto: [Afbeelding]

**Stappen:**
1. Navigeer naar profielpagina van gebruiker
2. Controleer dat gebruikersinformatie wordt opgehaald uit database:
   - Gebruikersnaam wordt correct getoond
   - Profielfoto wordt getoond (indien aanwezig)
3. Controleer dat informatie correct geformatteerd is:
   - Tekst is leesbaar
   - Links zijn klikbaar
   - Afbeeldingen worden correct weergegeven

**Gewenst resultaat:**
- Gebruikersinformatie wordt opgehaald uit database
- Alle informatie wordt correct weergegeven
- Informatie is correct geformatteerd

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
4. Controleer project weergave:
   - Projecten worden getoond in grid of lijst
   - Elke projectcard toont:
     - Project titel
     - Project beschrijving (verkort)
     - Thumbnail/afbeelding
   - Projectcards zijn klikbaar
5. Klik op een projectcard
6. Controleer dat je naar project detailpagina wordt doorgestuurd
7. Controleer sortering:
   - Projecten zijn gesorteerd op datum (nieuwste eerst) of andere logica

**Gewenst resultaat:**
- Alle publieke projecten van de gebruiker worden getoond
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

### Scenario 8.4: Skill tree weergeven

**Stappen:**
1. Navigeer naar profielpagina van gebruiker met skill tree
2. Zoek skill tree sectie
3. Controleer dat skill tree wordt getoond:
   - Skills worden opgehaald uit database
   - Skills worden visueel weergegeven
   - Vaardigheidsniveau wordt getoond per skill
4. Controleer sortering:
   - Skills zijn gesorteerd op vaardigheidsniveau of alfabetisch

**Gewenst resultaat:**
- Skill tree wordt opgehaald uit database
- Skill tree wordt visueel weergegeven op het profiel
- Skills worden gesorteerd op vaardigheidsniveau
- Skill tree is zichtbaar op het publieke profiel

---

## Testrapport

### Resultaten per Scenario

#### Scenario 8.1: Profiel pagina layout
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 8.2: Gebruikersinformatie weergeven
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 8.3: Projecten weergeven op profiel
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Aantal projecten getoond:** [Aantal]
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 8.4: Skill tree weergeven
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Skill tree geïmplementeerd:** ☐ Ja ☐ Nee
- **Opmerkingen:** 
  - [Vul opmerkingen in]

### Alternatieve Paden

#### Alternatief pad 8.1a: Gebruiker zonder profiel informatie
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 8.2b: Gebruiker zonder profielfoto
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 8.3a: Gebruiker zonder projecten
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 8.3b: Alleen private projecten
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- [Beschrijf algemene bevindingen over profielpagina functionaliteit]