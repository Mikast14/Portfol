# Test 5: Zoeken op Titel (US-6)

## Testplan

### Gerelateerde User Story
**US-6: Zoeken op Titel**
- Als lezer wil ik pagina's kunnen zoeken op titel zodat ik snel vind wat ik zoek

### Testscenario's
1. **Scenario 5.1: Zoekbalk in navbar**
   - Zoekbalk is aanwezig in navbar en zichtbaar
   - Gerelateerd aan Task #47

2. **Scenario 5.2: Zoeken op exacte titel**
   - Zoekfunctie vindt projecten met exacte titel match
   - Gerelateerd aan Task #48

3. **Scenario 5.3: Zoeken op partial match**
   - Zoekfunctie vindt projecten met partial titel match
   - Gerelateerd aan Task #48

4. **Scenario 5.4: Case-insensitive zoeken**
   - Zoeken werkt ongeacht hoofdletters/kleine letters
   - Gerelateerd aan Task #48

5. **Scenario 5.5: Lege zoekresultaten**
   - Lege zoekresultaten tonen duidelijke melding
   - Gerelateerd aan Task #48

### Samenhang met andere User Stories
- **US-5**: Zoekresultaten moeten consistent zijn met Explore pagina
- **US-2**: Gezochte projecten moeten correct worden getoond

---

## Stap-voor-stap Testinstructies

### Scenario 5.1: Zoekbalk in navbar

**Stappen:**
1. Open de applicatie in de browser
2. Navigeer naar een willekeurige pagina (home, explore, etc.)
3. Controleer dat zoekbalk aanwezig is in navbar:
   - Zoekbalk is zichtbaar
   - Placeholder tekst is aanwezig (bijv. "Zoek projecten...")
   - Zoek icoon is aanwezig
4. Test keyboard navigatie:
   - Tab naar zoekbalk
   - Controleer dat zoekbalk focus krijgt
   - Type tekst in zoekbalk
   - Controleer dat tekst wordt ingevoerd

**Gewenst resultaat:**
- Zoekbalk is toegevoegd aan navbar
- Zoekbalk heeft duidelijk placeholder tekst
- Zoekbalk heeft zoek icoon (indien geïmplementeerd)
- Zoekbalk is toegankelijk via keyboard navigatie
- Zoekbalk is altijd zichtbaar (niet alleen op bepaalde pagina's)

---

### Scenario 5.2: Zoeken op exacte titel

**Voorbereiding:**
- Minimaal 3 projecten moeten bestaan met verschillende titels:
  - Project A: "Ruined"
  - Project B: "Moekoes mangos"
  - Project C: "Skytower"

**Testdata:**
- Zoekterm: `Ruined` (exacte titel van Project A)

**Stappen:**
1. Navigeer naar een pagina met zoekbalk
2. Klik in de zoekbalk
3. Type zoekterm: `Ruined`
4. Druk op Enter of klik op zoek icoon
5. Wacht op zoekresultaten
6. Controleer resultaten:
   - Project A wordt getoond in resultaten
   - Project B en C worden NIET getoond (indien niet relevant)
7. Controleer weergave van resultaten:
   - Resultaten worden getoond in een aparte pagina
8. Klik op een zoekresultaat
9. Controleer dat je naar project detailpagina wordt doorgestuurd

**Gewenst resultaat:**
- Exacte titel match wordt gevonden
- Alleen relevante resultaten worden getoond
- Zoekresultaten worden duidelijk weergegeven
- Klikken op resultaat navigeert naar project detailpagina

**Alternatief pad 5.2a: Meerdere exacte matches**
- Testdata: Twee projecten met zelfde titel
- Gewenst resultaat: Beide projecten worden getoond in resultaten

---

### Scenario 5.3: Zoeken op partial match

**Voorbereiding:**
- Zelfde projecten als scenario 5.2

**Testdata:**
- Zoekterm 1: `Moekoes` (deel van "Moekoes mangos")
- Zoekterm 2: `mangos` (deel van "Moekoes mangos")
- Zoekterm 3: `tower` (deel van "Sky tower")

**Stappen:**
1. Test met zoekterm "Moekoes":
   - Type `Moekoes` in zoekbalk
   - Druk op Enter
   - Controleer: Project A wordt gevonden
2. Test met zoekterm "Portmangosfolio":
   - Type `mangos` in zoekbalk
   - Druk op Enter
   - Controleer: Project A wordt gevonden
3. Test met zoekterm "tower":
   - Type `tower` in zoekbalk
   - Druk op Enter
   - Controleer: Project B wordt gevonden
4. Controleer dat partial matches correct werken:
   - Zoekterm hoeft niet aan begin van titel te staan

**Gewenst resultaat:**
- Partial matches worden correct gevonden
- Zoeken werkt op elk deel van de titel
- Alle relevante resultaten worden getoond


---

### Scenario 5.4: Case-insensitive zoeken

**Voorbereiding:**
- Project met titel: "React Portfolio Website"

**Testdata:**
- Zoekterm 1: `sky tower` (alleen kleine letters)
- Zoekterm 2: `SKY TOWER` (alleen hoofdletters)
- Zoekterm 3: `SkY TOweR` (gemengd)

**Stappen:**
1. Type `sky tower` (kleine letters) in zoekbalk
2. Druk op Enter
3. Controleer: Project wordt gevonden
4. Clear zoekbalk
5. Type `SKY TOWER` (hoofdletters) in zoekbalk
6. Druk op Enter
7. Controleer: Project wordt gevonden
8. Clear zoekbalk
9. Type `SkY TOweR` (gemengd) in zoekbalk
10. Druk op Enter
11. Controleer: Project wordt gevonden

**Gewenst resultaat:**
- Zoeken werkt case-insensitive
- Alle variaties van hoofdletters/kleine letters vinden hetzelfde project
- Resultaten zijn consistent ongeacht case van zoekterm

---

### Scenario 5.5: Lege zoekresultaten

**Testdata:**
- Zoekterm: `DitProjectBestaatNiet12345`

**Stappen:**
1. Type `DitProjectBestaatNiet12345` in zoekbalk
2. Druk op Enter
3. Wacht op resultaten
4. Controleer lege state:
   - Duidelijke melding wordt getoond: "Geen projecten gevonden" of vergelijkbaar
   - Suggestie kan worden getoond (bijv. "Probeer een andere zoekterm")
   - Geen projecten worden getoond

**Gewenst resultaat:**
- Lege zoekresultaten tonen duidelijke melding
- Melding is gebruiksvriendelijk en informatief
- Geen errors worden getoond
- Gebruiker kan eenvoudig opnieuw zoeken


**Alternatief pad 5.5b: Alleen spaties**
- Testdata: Zoekterm met alleen spaties: `   `
- Gewenst resultaat: Wordt behandeld als lege zoekterm

---

## Testrapport

### Resultaten per Scenario

#### Scenario 5.1: Zoekbalk in navbar
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 5.2: Zoeken op exacte titel
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 5.3: Zoeken op partial match
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 5.4: Case-insensitive zoeken
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 5.5: Lege zoekresultaten
- **Status:** ☐ Geslaagd ☑ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - Alles werkten behalven dat de message niet goed is geformat

### Alternatieve Paden

#### Alternatief pad 5.2a: Meerdere exacte matches
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 5.5b: Alleen spaties
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- [Beschrijf algemene bevindingen over zoekfunctionaliteit]