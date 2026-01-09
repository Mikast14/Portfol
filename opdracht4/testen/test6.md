# Test 6: Tags Toevoegen aan Projecten (US-7)

## Testplan

### Gerelateerde User Story
**US-7: Tags Toevoegen aan Projecten**
- Als gebruiker wil ik tags aan een pagina kunnen toevoegen zodat gerelateerde programmeertalen makkelijk te vinden zijn

### Testscenario's
1. **Scenario 6.1: Tags toevoegen aan project formulier**
   - Gebruiker kan tags selecteren of aanmaken bij project aanmaken
   - Gerelateerd aan Task #50

2. **Scenario 6.2: Meerdere tags selecteren**
   - Gebruiker kan meerdere tags toevoegen aan een project
   - Gerelateerd aan Task #50

3. **Scenario 6.3: Nieuwe tags aanmaken**
   - Gebruiker kan nieuwe tags aanmaken tijdens project aanmaken
   - Gerelateerd aan Task #49 en #50

4. **Scenario 6.4: Tags weergeven op project pagina**
   - Tags worden correct weergegeven op project detailpagina
   - Gerelateerd aan Task #50

5. **Scenario 6.5: Tags filteren op Explore pagina**
   - Gebruiker kan projecten filteren op tags
   - Gerelateerd aan Task #51

6. **Scenario 6.6: Tag validatie**
   - Tags worden gevalideerd (geen lege tags, max lengte)
   - Gerelateerd aan Task #49

### Samenhang met andere User Stories
- **US-2**: Tags moeten toegevoegd kunnen worden bij project aanmaken
- **US-5**: Tags moeten gebruikt kunnen worden voor filteren op Explore pagina
- **US-8**: Tags moeten zichtbaar zijn op project detailpagina

---

## Stap-voor-stap Testinstructies

### Scenario 6.1: Tags toevoegen aan project formulier

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Minimaal 3 bestaande tags moeten bestaan in database (bijv. "React", "JavaScript", "Node.js")

**Stappen:**
1. Navigeer naar "Project toevoegen" pagina
2. Controleer dat tag selectie veld aanwezig is:
   - Tag selectie veld is zichtbaar
   - Dropdown/autocomplete is beschikbaar (indien geïmplementeerd)
   - Input veld voor nieuwe tags (indien geïmplementeerd)
3. Klik op tag selectie veld
4. Controleer dat bestaande tags worden getoond:
   - "React" tag is zichtbaar
   - "JavaScript" tag is zichtbaar
   - "Node.js" tag is zichtbaar
5. Selecteer tag "React"
6. Controleer dat tag wordt toegevoegd:
   - Tag verschijnt als chip/badge
   - Tag is visueel onderscheiden
7. Vul rest van project formulier in
8. Klik op submit
9. Controleer dat project wordt aangemaakt met tag

**Gewenst resultaat:**
- Projectformulier heeft tag selectie veld
- Bestaande tags kunnen worden geselecteerd via dropdown/autocomplete
- Geselecteerde tags worden visueel weergegeven als chips/badges
- Tags worden opgeslagen bij project aanmaken
- Tags zijn zichtbaar op project detailpagina

**Alternatief pad 6.1a: Geen bestaande tags**
- Testdata: Geen tags in database
- Gewenst resultaat: Gebruiker kan nieuwe tags aanmaken

---

### Scenario 6.2: Meerdere tags selecteren

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Meerdere tags moeten bestaan

**Testdata:**
- Tags om te selecteren: "React", "TypeScript", "Next.js"

**Stappen:**
1. Navigeer naar "Project toevoegen" pagina
2. Selecteer eerste tag: "React"
3. Controleer dat tag wordt toegevoegd als chip/badge
4. Selecteer tweede tag: "TypeScript"
5. Controleer dat beide tags zichtbaar zijn
6. Selecteer derde tag: "Next.js"
7. Controleer dat alle drie tags zichtbaar zijn
8. Test tag verwijderen:
   - Klik op "X" knop op een tag chip (indien aanwezig)
   - Controleer dat tag wordt verwijderd
9. Vul rest van formulier in
10. Klik op submit
11. Controleer dat alle geselecteerde tags worden opgeslagen

**Gewenst resultaat:**
- Meerdere tags kunnen worden geselecteerd
- Alle geselecteerde tags worden visueel weergegeven
- Tags kunnen worden verwijderd voordat project wordt opgeslagen
- Alle tags worden opgeslagen bij project aanmaken
- Tags zijn zichtbaar op project detailpagina

**Alternatief pad 6.2a: Maximum aantal tags**
- Testdata: Probeer 20+ tags toe te voegen
- Gewenst resultaat: Limiet wordt gehandhaafd of waarschuwing wordt getoond

---

### Scenario 6.3: Nieuwe tags aanmaken

**Voorbereiding:**
- Gebruiker moet ingelogd zijn

**Testdata:**
- Nieuwe tag naam: "Vue.js"
- Nieuwe tag naam: "Angular"

**Stappen:**
1. Navigeer naar "Project toevoegen" pagina
2. Zoek tag input veld
3. Type nieuwe tag naam: "Vue.js"
4. Controleer autocomplete functionaliteit:
   - Als tag niet bestaat, optie om nieuwe tag aan te maken
   - Als tag bestaat, suggestie om bestaande tag te selecteren
5. Maak nieuwe tag aan:
   - Druk op Enter of klik "Toevoegen" knop
   - OF selecteer optie "Maak nieuwe tag aan"
6. Controleer dat nieuwe tag wordt toegevoegd:
   - Tag verschijnt als chip/badge
   - Tag wordt opgeslagen in database
7. Test met tweede nieuwe tag: "Angular"
8. Vul rest van formulier in
9. Klik op submit
10. Controleer dat nieuwe tags zijn opgeslagen:
   - Navigeer naar project detailpagina
   - Controleer dat nieuwe tags zichtbaar zijn
   - Controleer dat tags nu beschikbaar zijn voor andere projecten

**Gewenst resultaat:**
- Gebruiker kan nieuwe tags aanmaken tijdens project aanmaken
- Nieuwe tags worden opgeslagen in database
- Nieuwe tags zijn direct beschikbaar voor andere projecten
- Tag validatie werkt (geen lege tags, max lengte)

**Alternatief pad 6.3a: Tag bestaat al**
- Testdata: Probeer tag aan te maken die al bestaat
- Gewenst resultaat: Bestaande tag wordt geselecteerd in plaats van nieuwe aanmaken

**Alternatief pad 6.3b: Lege tag naam**
- Testdata: Probeer tag aan te maken zonder naam
- Gewenst resultaat: Validatie error wordt getoond

---

### Scenario 6.4: Tags weergeven op project pagina

**Voorbereiding:**
- Project met tags moet bestaan (aangemaakt via scenario 6.1 of 6.2)

**Stappen:**
1. Navigeer naar project detailpagina
2. Zoek tags sectie op de pagina
3. Controleer dat alle tags van het project zichtbaar zijn:
   - Tags worden getoond als chips/badges
   - Tags hebben duidelijke styling (mogelijk met kleuren)
   - Tags zijn klikbaar (indien geïmplementeerd)
4. Test tag klik functionaliteit (indien geïmplementeerd):
   - Klik op een tag
   - Controleer dat je naar gefilterde Explore pagina wordt doorgestuurd
5. Controleer responsive design:
   - Tags zijn goed zichtbaar op mobiel
   - Tags wrappen correct bij lange lijst

**Gewenst resultaat:**
- Alle tags worden correct weergegeven op project detailpagina
- Tags hebben duidelijke visuele styling
- Tags zijn klikbaar en navigeren naar gefilterde pagina (indien geïmplementeerd)
- Layout is responsive en gebruiksvriendelijk

**Alternatief pad 6.4a: Project zonder tags**
- Testdata: Project zonder tags
- Gewenst resultaat: Tags sectie wordt niet getoond of toont "Geen tags"

---

### Scenario 6.5: Tags filteren op Explore pagina

**Voorbereiding:**
- Meerdere projecten met verschillende tags moeten bestaan:
  - Project A: Tags "React", "TypeScript"
  - Project B: Tags "Vue.js", "JavaScript"
  - Project C: Tags "React", "Node.js"

**Testdata:**
- Filter op tag: "React"

**Stappen:**
1. Navigeer naar Explore pagina
2. Zoek tag filter sectie
3. Controleer dat beschikbare tags worden getoond:
   - Populaire tags zijn zichtbaar
   - Alle tags zijn zichtbaar (indien geïmplementeerd)
4. Selecteer tag filter: "React"
5. Controleer gefilterde resultaten:
   - Project A wordt getoond (heeft "React" tag)
   - Project C wordt getoond (heeft "React" tag)
   - Project B wordt NIET getoond (heeft geen "React" tag)
6. Selecteer tweede tag: "TypeScript"
7. Controleer resultaten met meerdere filters:
   - Alleen projecten met beide tags worden getoond (AND logica)
   - OF projecten met één van beide tags (OR logica)
8. Reset filters
9. Controleer dat alle projecten weer zichtbaar zijn

**Gewenst resultaat:**
- Explore pagina heeft tag filter sectie
- Gebruiker kan filteren op één of meerdere tags
- Gefilterde projecten worden correct getoond
- Filter kan worden gereset
- Actieve filters worden visueel aangegeven
- Aantal resultaten wordt getoond (indien geïmplementeerd)

**Alternatief pad 6.5a: Geen resultaten bij filter**
- Testdata: Filter op tag die geen projecten heeft
- Gewenst resultaat: Lege state wordt getoond

**Alternatief pad 6.5b: Meerdere tags combineren**
- Testdata: Filter op "React" EN "TypeScript"
- Gewenst resultaat: Alleen projecten met beide tags worden getoond

---

### Scenario 6.6: Tag validatie

**Testdata voor verschillende validatiefouten:**

**Test 6.6a: Lege tag naam**
- Stappen: Probeer tag aan te maken zonder naam (alleen spaties)
- Gewenst resultaat: Error melding "Tag naam mag niet leeg zijn"

**Test 6.6b: Te lange tag naam**
- Testdata: Tag naam met 50+ karakters
- Gewenst resultaat: Error melding "Tag naam mag maximaal X karakters bevatten"

**Test 6.6c: Ongeldige karakters**
- Testdata: Tag naam met speciale karakters: `tag@#$%`
- Gewenst resultaat: Error melding of speciale karakters worden gefilterd

**Test 6.6d: Duplicate tag**
- Testdata: Probeer tag aan te maken die al bestaat
- Gewenst resultaat: Bestaande tag wordt gebruikt in plaats van nieuwe aanmaken

**Stappen voor elk test:**
1. Navigeer naar project toevoegen pagina
2. Probeer tag aan te maken met testdata
3. Controleer validatie error
4. Corrigeer en probeer opnieuw

**Gewenst resultaat:**
- Tags worden gevalideerd voordat opslaan
- Duidelijke error meldingen worden getoond
- Geen lege tags worden opgeslagen
- Max lengte wordt gehandhaafd
- Duplicate tags worden voorkomen

---

## Testrapport

### Testuitvoering
**Datum:** [Vul datum in]  
**Tester:** [Vul naam in]  
**Applicatie versie:** [Vul versie in]  
**Browser:** [Vul browser in]  
**Aantal tags in database:** [Aantal]

### Resultaten per Scenario

#### Scenario 6.1: Tags toevoegen aan project formulier
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 6.2: Meerdere tags selecteren
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 6.3: Nieuwe tags aanmaken
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 6.4: Tags weergeven op project pagina
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 6.5: Tags filteren op Explore pagina
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 6.6: Tag validatie
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

### Alternatieve Paden

#### Alternatief pad 6.1a: Geen bestaande tags
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 6.2a: Maximum aantal tags
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 6.3a: Tag bestaat al
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 6.3b: Lege tag naam
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 6.4a: Project zonder tags
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 6.5a: Geen resultaten bij filter
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 6.5b: Meerdere tags combineren
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- [Beschrijf algemene bevindingen over tag functionaliteit]

**Samenhang met andere User Stories:**
- **US-2 (Projecten)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe tags werken met projecten aanmaken]
- **US-5 (Explore)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe tag filters werken op Explore pagina]
- **US-8 (Project Detail)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe tags worden weergegeven op project detailpagina]

**Aanbevelingen:**
- [Lijst met aanbevelingen]

**Kritieke issues:**
- [Lijst met kritieke problemen]

**Totaal aantal tests:** 6 scenario's + 7 alternatieve paden = 13 tests  
**Geslaagd:** [Aantal]  
**Gefaald:** [Aantal]  
**Niet uitgevoerd:** [Aantal]  
**Succespercentage:** [Percentage]%
