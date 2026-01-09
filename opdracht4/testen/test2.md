# Test 2: Projecten Aanmaken en Bewerken (US-2)

## Testplan

### Gerelateerde User Story
**US-2: Projecten Aanmaken en Bewerken**
- Als gebruiker wil ik projecten kunnen aanmaken en bewerken op de website zodat bezoekers mijn projecten actueel kan houden

### Testscenario's
1. **Scenario 2.1: Project aanmaken met alle velden**
   - Gebruiker kan een volledig project aanmaken met alle benodigde informatie
   - Gerelateerd aan Task #37 en #38

2. **Scenario 2.2: Project aanmaken met afbeelding upload**
   - Gebruiker kan afbeeldingen uploaden bij project aanmaken
   - Gerelateerd aan Task #40

3. **Scenario 2.3: Projecten weergeven op gebruikerspagina**
   - Aangemaakte projecten worden getoond op de gebruikerspagina
   - Gerelateerd aan Task #39

4. **Scenario 2.4: Project bewerken**
   - Gebruiker kan een bestaand project bewerken
   - Gerelateerd aan Task #55

5. **Scenario 2.5: Validatiefouten bij project aanmaken**
   - Formulier toont errors bij ongeldige input
   - Gerelateerd aan Task #37

6. **Scenario 2.6: Autorisation check - alleen eigenaar kan bewerken**
   - Alleen de eigenaar van een project kan het bewerken
   - Gerelateerd aan Task #55

### Samenhang met andere User Stories
- **US-1**: Gebruiker moet ingelogd zijn om projecten aan te maken
- **US-5**: Projecten moeten zichtbaar zijn op Explore pagina
- **US-8**: Projecten moeten een detailpagina hebben
- **US-11**: Projecten moeten zichtbaar zijn op profielpagina

---

## Stap-voor-stap Testinstructies

### Scenario 2.1: Project aanmaken met alle velden

**Voorbereiding:**
- Gebruiker moet ingelogd zijn

**Testdata:**
- Titel: `Mijn Eerste Portfolio Project`
- Beschrijving: `Dit is een testproject om de functionaliteit te testen. Het project bevat verschillende features en technologieën.`
- Technologieën: `React, Node.js, MongoDB`
- GitHub link: `https://github.com/gebruiker/mijn-project`
- Live demo link: `https://mijn-project.example.com`
- Tags: `web-development, portfolio`

**Stappen:**
1. Navigeer naar de "Project toevoegen" pagina (via navbar of profiel)
2. Controleer dat het projectformulier zichtbaar is met alle benodigde velden:
   - Titel veld
   - Beschrijving veld (textarea)
   - Technologieën veld
   - GitHub link veld
   - Live demo link veld
   - Tags selectie
   - Submit knop
3. Vul het titel veld in: `Mijn Eerste Portfolio Project`
4. Vul de beschrijving in: `Dit is een testproject om de functionaliteit te testen. Het project bevat verschillende features en technologieën.`
5. Vul technologieën in: `React, Node.js, MongoDB`
6. Vul GitHub link in: `https://github.com/gebruiker/mijn-project`
7. Vul live demo link in: `https://mijn-project.example.com`
8. Selecteer of voeg tags toe: `web-development, portfolio`
9. Klik op de submit knop
10. Wacht op de response

**Gewenst resultaat:**
- Success melding wordt getoond: "Project succesvol aangemaakt"
- Gebruiker wordt doorgestuurd naar project detailpagina of gebruikerspagina
- Project wordt opgeslagen in database met alle ingevulde gegevens
- Project is gekoppeld aan de ingelogde gebruiker
- Timestamps (created_at, updated_at) zijn toegevoegd
- Project is zichtbaar op gebruikerspagina

**Alternatief pad 2.1a: Alleen verplichte velden**
- Testdata: Alleen titel en beschrijving ingevuld
- Gewenst resultaat: Project wordt aangemaakt met alleen verplichte velden

---

### Scenario 2.2: Project aanmaken met afbeelding upload

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Bereid testafbeeldingen voor (JPG, PNG, max 5MB)

**Testdata:**
- Titel: `Project met Afbeeldingen`
- Beschrijving: `Dit project heeft meerdere afbeeldingen`
- Afbeelding 1: `test-image.jpg` (2MB, JPG formaat)
- Afbeelding 2: `test-image.png` (1MB, PNG formaat)

**Stappen:**
1. Navigeer naar de "Project toevoegen" pagina
2. Vul basis project informatie in (titel, beschrijving)
3. Zoek het afbeelding upload veld
4. Klik op "Bestand kiezen" of drag-and-drop gebied
5. Selecteer `test-image.jpg`
6. Controleer dat preview van afbeelding wordt getoond
7. Voeg tweede afbeelding toe: `test-image.png`
8. Controleer dat beide previews zichtbaar zijn
9. Klik op submit knop
10. Wacht op upload en opslaan

**Gewenst resultaat:**
- Afbeeldingen worden geüpload zonder errors
- Preview van afbeeldingen wordt getoond voor upload
- Na opslaan worden afbeeldingen opgeslagen (cloud storage of database)
- Afbeeldingen zijn zichtbaar op project detailpagina
- Project wordt succesvol aangemaakt

**Alternatief pad 2.2a: Te groot bestand**
- Testdata: Afbeelding van 10MB
- Gewenst resultaat: Error melding "Bestand is te groot (max 5MB)"

**Alternatief pad 2.2b: Ongeldig bestandstype**
- Testdata: PDF bestand of .exe bestand
- Gewenst resultaat: Error melding "Alleen JPG, PNG, GIF, WebP zijn toegestaan"

**Alternatief pad 2.2c: Geen afbeeldingen**
- Testdata: Geen afbeeldingen geüpload
- Gewenst resultaat: Project wordt aangemaakt zonder afbeeldingen

---

### Scenario 2.3: Projecten weergeven op gebruikerspagina

**Voorbereiding:**
- Minimaal 2 projecten moeten aangemaakt zijn (via scenario 2.1)

**Stappen:**
1. Navigeer naar je gebruikerspagina/profiel
2. Zoek de sectie "Mijn Projecten" of "Projecten"
3. Controleer dat alle aangemaakte projecten zichtbaar zijn
4. Controleer de weergave (grid of lijst)
5. Controleer dat elke projectcard bevat:
   - Project titel
   - Samenvatting/beschrijving (verkort)
   - Thumbnail/afbeelding (indien aanwezig)
6. Klik op een projectcard
7. Controleer dat je naar project detailpagina wordt doorgestuurd

**Gewenst resultaat:**
- Alle projecten van de gebruiker zijn zichtbaar
- Projecten worden getoond in grid of lijst weergave
- Elke projectcard toont titel, samenvatting en thumbnail
- Projecten zijn gesorteerd op datum (nieuwste eerst)
- Klikken op projectcard navigeert naar detailpagina
- Layout is responsive (test op mobiel, tablet, desktop)

**Alternatief pad 2.3a: Geen projecten**
- Testdata: Gebruiker heeft geen projecten aangemaakt
- Gewenst resultaat: Lege state wordt getoond met bericht "Nog geen projecten"

---

### Scenario 2.4: Project bewerken

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Minimaal 1 project moet bestaan (aangemaakt via scenario 2.1)

**Testdata:**
- Originele titel: `Mijn Eerste Portfolio Project`
- Nieuwe titel: `Mijn Eerste Portfolio Project - Bijgewerkt`
- Nieuwe beschrijving: `Dit project is bijgewerkt met nieuwe informatie`
- Nieuwe technologie: `React, Node.js, MongoDB, TypeScript`

**Stappen:**
1. Navigeer naar gebruikerspagina met projecten
2. Zoek het project dat je wilt bewerken
3. Klik op "Bewerken" knop bij het project
4. Controleer dat bewerkingsformulier wordt geopend
5. Controleer dat formulier voorgevuld is met bestaande projectgegevens:
   - Titel veld bevat originele titel
   - Beschrijving veld bevat originele beschrijving
   - Alle andere velden zijn voorgevuld
6. Wijzig de titel naar: `Mijn Eerste Portfolio Project - Bijgewerkt`
7. Wijzig de beschrijving naar: `Dit project is bijgewerkt met nieuwe informatie`
8. Voeg technologie toe: `TypeScript`
9. Klik op "Opslaan" of submit knop
10. Wacht op response

**Gewenst resultaat:**
- Formulier is correct voorgevuld met bestaande gegevens
- Wijzigingen worden opgeslagen in database
- Success melding wordt getoond: "Project succesvol bijgewerkt"
- updated_at timestamp wordt bijgewerkt
- Gebruiker wordt doorgestuurd naar project detailpagina
- Wijzigingen zijn zichtbaar op project detailpagina

**Alternatief pad 2.4a: Geen wijzigingen**
- Testdata: Geen velden gewijzigd, direct opslaan
- Gewenst resultaat: Project wordt opgeslagen zonder errors (geen onnodige updates)

---

### Scenario 2.5: Validatiefouten bij project aanmaken

**Testdata voor verschillende validatiefouten:**

**Test 2.5a: Lege titel**
- Stappen: Laat titel veld leeg, vul andere velden in, klik submit
- Gewenst resultaat: Error melding bij titel veld: "Titel is verplicht"

**Test 2.5b: Te lange titel**
- Testdata: Titel met 200+ karakters
- Gewenst resultaat: Error melding: "Titel mag maximaal X karakters bevatten"

**Test 2.5c: Ongeldige URL format**
- Testdata: GitHub link: `geen-url-formaat`
- Gewenst resultaat: Error melding: "Voer een geldige URL in"

**Test 2.5d: Lege beschrijving**
- Testdata: Beschrijving veld leeg
- Gewenst resultaat: Error melding: "Beschrijving is verplicht" (indien verplicht)

**Stappen voor elk test:**
1. Navigeer naar project toevoegen pagina
2. Vul formulier in met testdata
3. Klik op submit
4. Controleer error meldingen

---

### Scenario 2.6: Autorisation check - alleen eigenaar kan bewerken

**Voorbereiding:**
- Twee gebruikersaccounts nodig:
  - Gebruiker A: Eigenaar van project
  - Gebruiker B: Andere gebruiker

**Stappen:**
1. Log in als Gebruiker A
2. Maak een project aan (scenario 2.1)
3. Log uit
4. Log in als Gebruiker B
5. Navigeer naar project detailpagina van Gebruiker A's project
6. Controleer of "Bewerken" knop zichtbaar is

**Gewenst resultaat:**
- "Bewerken" knop is NIET zichtbaar voor Gebruiker B
- Gebruiker B kan het project niet bewerken
- Indien directe URL wordt gebruikt: Error melding of redirect

**Alternatief pad 2.6a: Directe URL toegang**
- Stappen: Gebruiker B probeert direct naar bewerkingspagina te navigeren via URL
- Gewenst resultaat: 403 Forbidden of redirect naar project detailpagina met error melding

---

## Testrapport

### Testuitvoering
**Datum:** [Vul datum in]  
**Tester:** [Vul naam in]  
**Applicatie versie:** [Vul versie in]  
**Browser:** [Vul browser in]

### Resultaten per Scenario

#### Scenario 2.1: Project aanmaken met alle velden
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 2.2: Project aanmaken met afbeelding upload
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 2.3: Projecten weergeven op gebruikerspagina
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 2.4: Project bewerken
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 2.5: Validatiefouten bij project aanmaken
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 2.6: Autorisation check
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

### Alternatieve Paden

#### Alternatief pad 2.1a: Alleen verplichte velden
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 2.2a: Te groot bestand
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 2.2b: Ongeldig bestandstype
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 2.3a: Geen projecten
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 2.6a: Directe URL toegang
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- [Beschrijf algemene bevindingen over projectbeheer functionaliteit]

**Samenhang met andere User Stories:**
- **US-1 (Authenticatie)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe authenticatie werkt met projecten aanmaken]
- **US-5 (Explore)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe projecten zichtbaar zijn op Explore pagina]
- **US-8 (Project Detail)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe project detailpagina werkt]
- **US-11 (Profiel)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe projecten zichtbaar zijn op profiel]

**Aanbevelingen:**
- [Lijst met aanbevelingen]

**Kritieke issues:**
- [Lijst met kritieke problemen]

**Totaal aantal tests:** 6 scenario's + 5 alternatieve paden = 11 tests  
**Geslaagd:** [Aantal]  
**Gefaald:** [Aantal]  
**Niet uitgevoerd:** [Aantal]  
**Succespercentage:** [Percentage]%
