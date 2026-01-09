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

6. **Scenario 5.6: Debouncing en performance**
   - Zoekfunctie heeft debouncing voor performance
   - Gerelateerd aan Task #48

### Samenhang met andere User Stories
- **US-5**: Zoekresultaten moeten consistent zijn met Explore pagina
- **US-8**: Zoekresultaten moeten naar project detailpagina kunnen navigeren
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
   - Zoek icoon is aanwezig (indien geïmplementeerd)
4. Controleer responsive design:
   - Test op desktop: zoekbalk is volledig zichtbaar
   - Test op mobiel: zoekbalk past zich aan (mogelijk kleiner of in menu)
5. Test keyboard navigatie:
   - Tab naar zoekbalk
   - Controleer dat zoekbalk focus krijgt
   - Type tekst in zoekbalk
   - Controleer dat tekst wordt ingevoerd

**Gewenst resultaat:**
- Zoekbalk is toegevoegd aan navbar
- Zoekbalk heeft duidelijk placeholder tekst
- Zoekbalk is responsive en zichtbaar op alle schermformaten
- Zoekbalk heeft zoek icoon (indien geïmplementeerd)
- Zoekbalk is toegankelijk via keyboard navigatie
- Zoekbalk is altijd zichtbaar (niet alleen op bepaalde pagina's)

**Alternatief pad 5.1a: Zoekbalk niet in navbar**
- Testdata: Zoekbalk is op aparte locatie
- Gewenst resultaat: Zoekbalk is duidelijk zichtbaar en toegankelijk

---

### Scenario 5.2: Zoeken op exacte titel

**Voorbereiding:**
- Minimaal 3 projecten moeten bestaan met verschillende titels:
  - Project A: "React Portfolio Website"
  - Project B: "Node.js API Server"
  - Project C: "Vue.js Dashboard"

**Testdata:**
- Zoekterm: `React Portfolio Website` (exacte titel van Project A)

**Stappen:**
1. Navigeer naar een pagina met zoekbalk
2. Klik in de zoekbalk
3. Type zoekterm: `React Portfolio Website`
4. Druk op Enter of klik op zoek icoon
5. Wacht op zoekresultaten
6. Controleer resultaten:
   - Project A wordt getoond in resultaten
   - Project B en C worden NIET getoond (indien niet relevant)
7. Controleer weergave van resultaten:
   - Resultaten worden getoond in dropdown of op aparte pagina
   - Project titel wordt gehighlight (indien geïmplementeerd)
   - Project beschrijving wordt getoond (indien beschikbaar)
8. Klik op een zoekresultaat
9. Controleer dat je naar project detailpagina wordt doorgestuurd

**Gewenst resultaat:**
- Exacte titel match wordt gevonden
- Alleen relevante resultaten worden getoond
- Zoekresultaten worden duidelijk weergegeven
- Klikken op resultaat navigeert naar project detailpagina
- Zoekterm wordt behouden in zoekbalk (indien geïmplementeerd)

**Alternatief pad 5.2a: Meerdere exacte matches**
- Testdata: Twee projecten met zelfde titel
- Gewenst resultaat: Beide projecten worden getoond in resultaten

---

### Scenario 5.3: Zoeken op partial match

**Voorbereiding:**
- Zelfde projecten als scenario 5.2

**Testdata:**
- Zoekterm 1: `React` (deel van "React Portfolio Website")
- Zoekterm 2: `Portfolio` (deel van "React Portfolio Website")
- Zoekterm 3: `API` (deel van "Node.js API Server")

**Stappen:**
1. Test met zoekterm "React":
   - Type `React` in zoekbalk
   - Druk op Enter
   - Controleer: Project A wordt gevonden
2. Test met zoekterm "Portfolio":
   - Type `Portfolio` in zoekbalk
   - Druk op Enter
   - Controleer: Project A wordt gevonden
3. Test met zoekterm "API":
   - Type `API` in zoekbalk
   - Druk op Enter
   - Controleer: Project B wordt gevonden
4. Controleer dat partial matches correct werken:
   - Zoekterm hoeft niet aan begin van titel te staan
   - Zoekterm kan midden in titel staan

**Gewenst resultaat:**
- Partial matches worden correct gevonden
- Zoeken werkt op elk deel van de titel
- Alle relevante resultaten worden getoond
- Resultaten zijn correct gesorteerd (indien geïmplementeerd)

**Alternatief pad 5.3a: Zoekterm in midden van titel**
- Testdata: Zoekterm "Portfolio" in "React Portfolio Website"
- Gewenst resultaat: Project wordt gevonden

**Alternatief pad 5.3b: Meerdere partial matches**
- Testdata: Zoekterm "js" (vindt "Node.js" en "Vue.js")
- Gewenst resultaat: Beide projecten worden gevonden

---

### Scenario 5.4: Case-insensitive zoeken

**Voorbereiding:**
- Project met titel: "React Portfolio Website"

**Testdata:**
- Zoekterm 1: `react portfolio website` (alleen kleine letters)
- Zoekterm 2: `REACT PORTFOLIO WEBSITE` (alleen hoofdletters)
- Zoekterm 3: `ReAcT pOrTfOlIo` (gemengd)

**Stappen:**
1. Type `react portfolio website` (kleine letters) in zoekbalk
2. Druk op Enter
3. Controleer: Project wordt gevonden
4. Clear zoekbalk
5. Type `REACT PORTFOLIO WEBSITE` (hoofdletters) in zoekbalk
6. Druk op Enter
7. Controleer: Project wordt gevonden
8. Clear zoekbalk
9. Type `ReAcT pOrTfOlIo` (gemengd) in zoekbalk
10. Druk op Enter
11. Controleer: Project wordt gevonden

**Gewenst resultaat:**
- Zoeken werkt case-insensitive
- Alle variaties van hoofdletters/kleine letters vinden hetzelfde project
- Resultaten zijn consistent ongeacht case van zoekterm

**Alternatief pad 5.4a: Speciale karakters**
- Testdata: Zoekterm met speciale karakters
- Gewenst resultaat: Zoeken werkt correct of toont error melding

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
5. Test met lege zoekterm:
   - Laat zoekbalk leeg
   - Druk op Enter
   - Controleer: Error melding of alle projecten worden getoond

**Gewenst resultaat:**
- Lege zoekresultaten tonen duidelijke melding
- Melding is gebruiksvriendelijk en informatief
- Geen errors worden getoond
- Gebruiker kan eenvoudig opnieuw zoeken

**Alternatief pad 5.5a: Lege zoekterm**
- Testdata: Geen tekst ingevoerd
- Gewenst resultaat: Error melding of alle projecten worden getoond

**Alternatief pad 5.5b: Alleen spaties**
- Testdata: Zoekterm met alleen spaties: `   `
- Gewenst resultaat: Wordt behandeld als lege zoekterm

---

### Scenario 5.6: Debouncing en performance

**Voorbereiding:**
- Veel projecten in database (20+)

**Stappen:**
1. Open browser developer tools (F12)
2. Ga naar Network tab
3. Navigeer naar pagina met zoekbalk
4. Type langzaam in zoekbalk: `R` → wacht → `e` → wacht → `a` → wacht → `c` → wacht → `t`
5. Observeer network requests:
   - Controleer of niet bij elke toetsaanslag een request wordt gedaan
   - Controleer of debouncing werkt (wacht tot gebruiker stopt met typen)
6. Test met snel typen:
   - Type snel `React` zonder te stoppen
   - Controleer: Slechts 1 request wordt gedaan (na debounce delay)
7. Test performance:
   - Meet tijd tussen Enter drukken en resultaten tonen
   - Controleer dat resultaten snel worden getoond (< 1 seconde)

**Gewenst resultaat:**
- Debouncing is geïmplementeerd (geen request bij elke toetsaanslag)
- Zoekfunctie is performant (snel resultaten)
- Database queries zijn geoptimaliseerd (indexen gebruikt)
- Geen onnodige requests worden gedaan
- Loading state wordt getoond tijdens zoeken (indien geïmplementeerd)

**Alternatief pad 5.6a: Geen debouncing**
- Testdata: Debouncing niet geïmplementeerd
- Gewenst resultaat: Functionaliteit werkt nog steeds, maar kan trager zijn

**Alternatief pad 5.6b: Real-time zoeken**
- Testdata: Zoeken gebeurt tijdens typen (met debouncing)
- Gewenst resultaat: Resultaten worden bijgewerkt tijdens typen

---

## Testrapport

### Testuitvoering
**Datum:** [Vul datum in]  
**Tester:** [Vul naam in]  
**Applicatie versie:** [Vul versie in]  
**Browser:** [Vul browser in]  
**Aantal projecten in database:** [Aantal]

### Resultaten per Scenario

#### Scenario 5.1: Zoekbalk in navbar
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 5.2: Zoeken op exacte titel
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 5.3: Zoeken op partial match
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 5.4: Case-insensitive zoeken
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 5.5: Lege zoekresultaten
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 5.6: Debouncing en performance
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Response tijd:** [Tijd] ms
- **Opmerkingen:** 
  - [Vul opmerkingen in]

### Alternatieve Paden

#### Alternatief pad 5.1a: Zoekbalk locatie
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 5.2a: Meerdere exacte matches
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 5.3a: Zoekterm in midden
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 5.3b: Meerdere partial matches
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 5.4a: Speciale karakters
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 5.5a: Lege zoekterm
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 5.5b: Alleen spaties
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 5.6a: Geen debouncing
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 5.6b: Real-time zoeken
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- [Beschrijf algemene bevindingen over zoekfunctionaliteit]

**Samenhang met andere User Stories:**
- **US-5 (Explore)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe zoeken werkt met Explore pagina]
- **US-8 (Project Detail)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe navigatie werkt naar project detailpagina vanuit zoekresultaten]
- **US-2 (Projecten)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe gezochte projecten worden getoond]

**Performance metrics:**
- **Gemiddelde zoektijd:** [Tijd] ms
- **Database query optimalisatie:** ☐ Geoptimaliseerd ☐ Niet geoptimaliseerd
- **Debouncing delay:** [Tijd] ms

**Aanbevelingen:**
- [Lijst met aanbevelingen]

**Kritieke issues:**
- [Lijst met kritieke problemen]

**Totaal aantal tests:** 6 scenario's + 9 alternatieve paden = 15 tests  
**Geslaagd:** [Aantal]  
**Gefaald:** [Aantal]  
**Niet uitgevoerd:** [Aantal]  
**Succespercentage:** [Percentage]%
