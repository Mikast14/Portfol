# Test 4: Explore Page (US-5)

## Testplan

### Gerelateerde User Story
**US-5: Explore Page**
- Als lezer wil ik een explore page zodat ik projecten kan vinden

### Testscenario's
1. **Scenario 4.1: Explore pagina layout**
   - Explore pagina heeft correcte layout met project grid
   - Gerelateerd aan Task #70

2. **Scenario 4.2: Projecten weergeven op Explore pagina**
   - Alle publieke projecten worden getoond op Explore pagina
   - Gerelateerd aan Task #71

3. **Scenario 4.3: Filter functionaliteit**
   - Gebruiker kan projecten filteren op verschillende criteria
   - Gerelateerd aan Task #70

4. **Scenario 4.4: Sorteer functionaliteit**
   - Gebruiker kan projecten sorteren op verschillende criteria
   - Gerelateerd aan Task #70

5. **Scenario 4.5: Paginering of lazy loading**
   - Projecten worden geladen met paginering of lazy loading
   - Gerelateerd aan Task #71

6. **Scenario 4.6: Lege state**
   - Lege state wordt getoond wanneer er geen projecten zijn
   - Gerelateerd aan Task #71

### Samenhang met andere User Stories
- **US-2**: Projecten aangemaakt via US-2 moeten zichtbaar zijn op Explore pagina
- **US-8**: Klikken op projectcard moet naar project detailpagina navigeren
- **US-6**: Zoekfunctie moet werken op Explore pagina (indien geïmplementeerd)
- **US-7**: Tag filters moeten werken op Explore pagina

---

## Stap-voor-stap Testinstructies

### Scenario 4.1: Explore pagina layout

**Stappen:**
1. Navigeer naar de Explore pagina (via navbar of directe URL: `/explore`)
2. Controleer dat de volgende elementen aanwezig zijn:
   - Project grid of lijst weergave
   - Filter sectie (indien geïmplementeerd)
   - Sorteer opties (indien geïmplementeerd)
   - Zoekbalk (indien geïmplementeerd)
3. Controleer de layout:
   - Elementen zijn goed georganiseerd
   - Project grid is duidelijk zichtbaar
   - Filters/sorteer opties zijn toegankelijk
4. Controleer dat design consistent is met de rest van de applicatie
5. Controleer responsive design:
   - Test op desktop, tablet en mobiel
   - Layout past zich aan aan schermformaat

**Gewenst resultaat:**
- Explore pagina heeft duidelijke layout met project grid
- Filter en sorteer opties zijn zichtbaar en gebruiksvriendelijk
- Layout is responsive en werkt op alle schermformaten
- Design is consistent met de rest van de applicatie
- Loading states worden getoond tijdens data ophalen (indien van toepassing)

**Alternatief pad 4.1a: Geen filters geïmplementeerd**
- Testdata: Filters zijn niet beschikbaar
- Gewenst resultaat: Pagina werkt zonder filters, alle projecten worden getoond

---

### Scenario 4.2: Projecten weergeven op Explore pagina

**Voorbereiding:**
- Minimaal 3 publieke projecten moeten bestaan in database

**Stappen:**
1. Navigeer naar Explore pagina
2. Wacht tot projecten geladen zijn
3. Controleer dat alle publieke projecten zichtbaar zijn:
   - Tel het aantal projectcards
   - Vergelijk met aantal projecten in database
4. Controleer dat elke projectcard bevat:
   - Project titel
   - Project beschrijving (verkort)
   - Thumbnail/afbeelding (indien aanwezig)
   - Auteur informatie
   - Tags/technologieën (indien aanwezig)
   - Like count (indien aanwezig)
5. Controleer project weergave:
   - Projecten worden getoond in grid of lijst
   - Projectcards zijn klikbaar
6. Klik op een projectcard
7. Controleer dat je naar project detailpagina wordt doorgestuurd

**Gewenst resultaat:**
- Alle publieke projecten worden opgehaald uit database
- Projecten worden correct weergegeven (willekeurig of gesorteerd)
- Elke projectcard toont alle benodigde informatie
- Klikken op projectcard navigeert naar project detailpagina
- Projecten zijn goed georganiseerd en leesbaar

**Alternatief pad 4.2a: Alleen eigen projecten zichtbaar**
- Testdata: Gebruiker is ingelogd
- Gewenst resultaat: Alle publieke projecten zijn zichtbaar, niet alleen eigen projecten

**Alternatief pad 4.2b: Private projecten niet zichtbaar**
- Testdata: Er zijn private projecten in database
- Gewenst resultaat: Private projecten worden NIET getoond op Explore pagina

---

### Scenario 4.3: Filter functionaliteit

**Voorbereiding:**
- Verschillende projecten met verschillende tags/technologieën moeten bestaan

**Testdata:**
- Filter op tag: `React`
- Filter op technologie: `JavaScript`
- Filter op auteur: [Specifieke gebruikersnaam]

**Stappen voor Tag Filter:**
1. Navigeer naar Explore pagina
2. Zoek tag filter sectie
3. Selecteer tag: `React`
4. Controleer dat alleen projecten met deze tag worden getoond
5. Selecteer tweede tag: `Node.js`
6. Controleer dat projecten met beide tags worden getoond (indien AND logica)
   OF projecten met één van beide tags (indien OR logica)
7. Reset filter
8. Controleer dat alle projecten weer zichtbaar zijn

**Stappen voor Technologie Filter:**
1. Selecteer technologie filter
2. Kies technologie: `JavaScript`
3. Controleer gefilterde resultaten
4. Reset filter

**Gewenst resultaat:**
- Filter sectie is zichtbaar en gebruiksvriendelijk
- Gebruiker kan filteren op één of meerdere criteria
- Gefilterde projecten worden correct getoond
- Filter kan worden gereset
- Actieve filters worden visueel aangegeven
- Aantal resultaten wordt getoond (indien geïmplementeerd)

**Alternatief pad 4.3a: Geen resultaten bij filter**
- Testdata: Filter op tag die niet bestaat
- Gewenst resultaat: Lege state wordt getoond met bericht "Geen projecten gevonden"

**Alternatief pad 4.3b: Meerdere filters combineren**
- Testdata: Tag filter + Technologie filter
- Gewenst resultaat: Filters werken correct samen

---

### Scenario 4.4: Sorteer functionaliteit

**Testdata:**
- Sorteer opties: Nieuwste eerst, Oudste eerst, Meeste likes, Alfabetisch

**Stappen:**
1. Navigeer naar Explore pagina
2. Zoek sorteer dropdown/optie
3. Test elke sorteer optie:
   - Selecteer "Nieuwste eerst"
     - Controleer: Projecten zijn gesorteerd op datum (nieuwste bovenaan)
   - Selecteer "Oudste eerst"
     - Controleer: Projecten zijn gesorteerd op datum (oudste bovenaan)
   - Selecteer "Meeste likes"
     - Controleer: Projecten zijn gesorteerd op aantal likes (hoogste eerst)
   - Selecteer "Alfabetisch"
     - Controleer: Projecten zijn gesorteerd alfabetisch op titel
4. Controleer dat sortering correct werkt na filteren

**Gewenst resultaat:**
- Sorteer opties zijn zichtbaar en toegankelijk
- Elke sorteer optie werkt correct
- Projecten worden correct gesorteerd volgens gekozen optie
- Sortering werkt samen met filters
- Sorteer optie wordt visueel aangegeven

**Alternatief pad 4.4a: Geen sorteer opties**
- Testdata: Sorteer functionaliteit niet geïmplementeerd
- Gewenst resultaat: Projecten worden getoond in standaard volgorde

---

### Scenario 4.5: Paginering of lazy loading

**Voorbereiding:**
- Minimaal 20+ projecten moeten bestaan om paginering te testen

**Stappen voor Paginering:**
1. Navigeer naar Explore pagina
2. Controleer of paginering aanwezig is:
   - Pagina nummers of "Volgende/Vorige" knoppen
3. Controleer aantal projecten per pagina:
   - Tel projecten op eerste pagina
   - Controleer of dit overeenkomt met verwachte aantal (bijv. 12 per pagina)
4. Klik op "Volgende" of pagina 2
5. Controleer dat nieuwe projecten worden geladen
6. Controleer dat URL wordt bijgewerkt (indien geïmplementeerd)
7. Klik op "Vorige" of terug naar pagina 1
8. Controleer dat oorspronkelijke projecten worden getoond

**Stappen voor Lazy Loading:**
1. Navigeer naar Explore pagina
2. Scroll naar beneden
3. Controleer dat nieuwe projecten automatisch worden geladen
4. Controleer loading indicator (indien aanwezig)
5. Scroll verder naar beneden
6. Controleer dat meer projecten worden geladen

**Gewenst resultaat:**
- Paginering of lazy loading is geïmplementeerd
- Projecten worden correct geladen per pagina of bij scrollen
- Performance is goed (geen lange laadtijden)
- Loading states worden getoond tijdens laden
- Gebruiker kan navigeren tussen pagina's (bij paginering)

**Alternatief pad 4.5a: Weinig projecten**
- Testdata: Minder dan 12 projecten
- Gewenst resultaat: Alle projecten worden getoond, geen paginering nodig

**Alternatief pad 4.5b: Geen paginering/lazy loading**
- Testdata: Functionaliteit niet geïmplementeerd
- Gewenst resultaat: Alle projecten worden getoond op één pagina (kan traag zijn bij veel projecten)

---

### Scenario 4.6: Lege state

**Voorbereiding:**
- Database moet leeg zijn of geen publieke projecten bevatten

**Stappen:**
1. Zorg dat er geen publieke projecten zijn in database
   (OF gebruik testomgeving zonder projecten)
2. Navigeer naar Explore pagina
3. Wacht tot pagina geladen is
4. Controleer lege state:
   - Bericht wordt getoond: "Nog geen projecten beschikbaar" of vergelijkbaar
   - Call-to-action kan worden getoond (bijv. "Maak je eerste project")
   - Geen projectcards worden getoond

**Gewenst resultaat:**
- Lege state wordt getoond wanneer er geen projecten zijn
- Bericht is duidelijk en gebruiksvriendelijk
- Geen errors worden getoond
- Design is consistent met de rest van de applicatie

**Alternatief pad 4.6a: Alleen private projecten**
- Testdata: Alleen private projecten in database
- Gewenst resultaat: Lege state wordt getoond (private projecten niet zichtbaar)

---

## Testrapport

### Testuitvoering
**Datum:** [Vul datum in]  
**Tester:** [Vul naam in]  
**Applicatie versie:** [Vul versie in]  
**Browser:** [Vul browser in]  
**Aantal projecten in database:** [Aantal]

### Resultaten per Scenario

#### Scenario 4.1: Explore pagina layout
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 4.2: Projecten weergeven op Explore pagina
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Aantal projecten getoond:** [Aantal]
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 4.3: Filter functionaliteit
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 4.4: Sorteer functionaliteit
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 4.5: Paginering of lazy loading
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Type:** ☐ Paginering ☐ Lazy Loading ☐ Geen
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 4.6: Lege state
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

### Alternatieve Paden

#### Alternatief pad 4.1a: Geen filters
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 4.2a: Alleen eigen projecten
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 4.2b: Private projecten
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 4.3a: Geen resultaten bij filter
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 4.3b: Meerdere filters combineren
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 4.4a: Geen sorteer opties
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 4.5a: Weinig projecten
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 4.5b: Geen paginering
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 4.6a: Alleen private projecten
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- [Beschrijf algemene bevindingen over Explore pagina functionaliteit]

**Samenhang met andere User Stories:**
- **US-2 (Projecten)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe projecten van US-2 zichtbaar zijn op Explore]
- **US-8 (Project Detail)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe navigatie werkt naar project detailpagina]
- **US-6 (Zoeken)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe zoekfunctie werkt op Explore pagina]
- **US-7 (Tags)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe tag filters werken]

**Performance:**
- **Laadtijd Explore pagina:** [Tijd] seconden
- **Laadtijd bij filteren:** [Tijd] seconden
- **Laadtijd bij paginering:** [Tijd] seconden

**Aanbevelingen:**
- [Lijst met aanbevelingen]

**Kritieke issues:**
- [Lijst met kritieke problemen]

**Totaal aantal tests:** 6 scenario's + 9 alternatieve paden = 15 tests  
**Geslaagd:** [Aantal]  
**Gefaald:** [Aantal]  
**Niet uitgevoerd:** [Aantal]  
**Succespercentage:** [Percentage]%
