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

4. **Scenario 4.4: Lege state**
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
   - Filter sectie
   - Zoekbalk
3. Controleer de layout:
   - Elementen zijn goed georganiseerd
   - Project grid is duidelijk zichtbaar
   - Filters zijn toegankelijk
4. Controleer dat design consistent is met de rest van de applicatie

**Gewenst resultaat:**
- Explore pagina heeft duidelijke layout met project grid
- Filter opties zijn zichtbaar en gebruiksvriendelijk
- Design is consistent met de rest van de applicatie

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
   - Thumbnail/afbeelding
   - Auteur informatie
   - Like count
5. Controleer project weergave:
   - Projecten worden getoond in grid
   - Projectcards zijn klikbaar
6. Klik op een projectcard
7. Controleer dat je naar project detailpagina wordt doorgestuurd

**Gewenst resultaat:**
- Alle publieke projecten worden opgehaald uit database
- Projecten worden correct weergegeven (willekeurig)
- Elke projectcard toont alle benodigde informatie
- Klikken op projectcard navigeert naar project detailpagina
- Projecten zijn goed georganiseerd en leesbaar

**Alternatief pad 4.2a: Alleen eigen projecten zichtbaar**
- Testdata: Gebruiker is ingelogd
- Gewenst resultaat: Alle publieke projecten zijn zichtbaar, niet alleen eigen projecten

---

### Scenario 4.3: Filter functionaliteit

**Voorbereiding:**
- Verschillende projecten met verschillende tags moeten bestaan

**Testdata:**
- Filter op tag: `app`
- Filter op auteur (via zoekbalk): [Specifieke gebruikersnaam]

**Stappen voor Tag Filter:**
1. Navigeer naar Explore pagina
2. Zoek tag filter sectie
3. Selecteer tag: `app`
4. Controleer dat alleen projecten met deze tag worden getoond
5. Selecteer tweede tag: `windows`
6. Controleer dat projecten met beide tags worden getoond (indien AND logica)
   OF projecten met één van beide tags (indien OR logica)
7. Reset filter
8. Controleer dat alle projecten weer zichtbaar zijn


**Gewenst resultaat:**
- Filter sectie is zichtbaar en gebruiksvriendelijk
- Gebruiker kan filteren op één of meerdere criteria
- Gefilterde projecten worden correct getoond
- Filter kan worden gereset
- Actieve filters worden visueel aangegeven

---

### Scenario 4.4: Lege state

**Voorbereiding:**
- Database moet leeg zijn of geen publieke projecten bevatten

**Stappen:**
1. Zorg dat er geen publieke projecten zijn in database
   (OF gebruik testomgeving zonder projecten)
2. Navigeer naar Explore pagina
3. Wacht tot pagina geladen is
4. Controleer lege state:
   - Bericht wordt getoond: "Nog geen projecten beschikbaar" of vergelijkbaar
   - Geen projectcards worden getoond

**Gewenst resultaat:**
- Lege state wordt getoond wanneer er geen projecten zijn
- Bericht is duidelijk en gebruiksvriendelijk
- Geen errors worden getoond
- Design is consistent met de rest van de applicatie

---

## Testrapport

### Resultaten per Scenario

#### Scenario 4.1: Explore pagina layout
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 4.2: Projecten weergeven op Explore pagina
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Aantal projecten getoond:** [Aantal]
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 4.3: Filter functionaliteit
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 4.4: Lege state
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

### Alternatieve Paden

#### Alternatief pad 4.1a: Geen filters
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 4.2a: Alleen eigen projecten
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- [Beschrijf algemene bevindingen over Explore pagina functionaliteit]
