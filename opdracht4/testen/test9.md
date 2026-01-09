# Test 9: Projecten Liken en Reageren (US-12)

## Testplan

### Gerelateerde User Story
**US-12: Projecten Liken en Reageren**
- Als lezer wil ik projecten van andere kunnen liken en op kunnen reageren zodat lezers hun mening kunnen geven

### Testscenario's
1. **Scenario 9.1: Project liken**
   - Gebruiker kan een project liken via like knop
   - Gerelateerd aan Task #52

2. **Scenario 9.2: Like verwijderen**
   - Gebruiker kan een like verwijderen door opnieuw te klikken
   - Gerelateerd aan Task #52

3. **Scenario 9.3: Like count weergeven**
   - Aantal likes wordt getoond en bijgewerkt in real-time
   - Gerelateerd aan Task #52

4. **Scenario 9.4: Reactie plaatsen**
   - Gebruiker kan een reactie plaatsen op een project
   - Gerelateerd aan Task #53

5. **Scenario 9.5: Reacties weergeven**
   - Reacties worden getoond onder het project
   - Gerelateerd aan Task #53

6. **Scenario 9.6: Eigen reactie bewerken en verwijderen**
   - Gebruiker kan zijn eigen reacties bewerken en verwijderen
   - Gerelateerd aan Task #53

### Samenhang met andere User Stories
- **US-1**: Gebruiker moet ingelogd zijn om te liken en reageren
- **US-8**: Like en reactie functionaliteit moet aanwezig zijn op project detailpagina
- **US-2**: Likes en reacties moeten gekoppeld zijn aan projecten

---

## Stap-voor-stap Testinstructies

### Scenario 9.1: Project liken

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Minimaal 1 project moet bestaan (niet van de gebruiker zelf)

**Stappen:**
1. Navigeer naar project detailpagina van een project
2. Zoek like knop op de pagina:
   - Like knop is zichtbaar (hart icon)
   - Like knop toont lege hart (nog niet geliked)
   - Aantal likes wordt getoond
3. Noteer huidig aantal likes
4. Klik op like knop
5. Wacht op response
6. Controleer dat like wordt toegevoegd:
   - Hart icon wordt gevuld
   - Aantal likes wordt verhoogd met 1
   - Like wordt opgeslagen in database
7. Refresh de pagina
8. Controleer dat like status behouden blijft:
   - Hart blijft gevuld
   - Aantal likes blijft verhoogd

**Gewenst resultaat:**
- Like knop is toegevoegd aan projectpagina's
- Klikken op like knop voegt like toe
- Like wordt opgeslagen in database
- Aantal likes wordt getoond en bijgewerkt
- Like status wordt visueel aangegeven (gevulde/lege hart icon)
- Like status blijft behouden na refresh

**Alternatief pad 9.1a: Eigen project liken**
- Testdata: Probeer eigen project te liken
- Gewenst resultaat: like knop is verborgen

**Alternatief pad 9.1b: Meerdere projecten liken**
- Testdata: Like 5 verschillende projecten
- Gewenst resultaat: Alle likes worden opgeslagen

---

### Scenario 9.2: Like verwijderen

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Minimaal 1 project moet geliked zijn (via scenario 9.1)

**Stappen:**
1. Navigeer naar project detailpagina van geliked project
2. Controleer dat like knop gevulde hart toont
3. Noteer huidig aantal likes
4. Klik op like knop (opnieuw)
5. Wacht op response
6. Controleer dat like wordt verwijderd:
   - Hart icon wordt leeg
   - Aantal likes wordt verlaagd met 1
   - Like wordt verwijderd uit database
7. Refresh de pagina
8. Controleer dat like status behouden blijft:
   - Hart blijft leeg
   - Aantal likes blijft verlaagd

**Gewenst resultaat:**
- Gebruiker kan like verwijderen door opnieuw te klikken
- Like wordt verwijderd uit database
- Aantal likes wordt correct bijgewerkt
- Visual feedback wordt gegeven (icon verandert)
- Status blijft behouden na refresh

---

### Scenario 9.3: Like count weergeven

**Voorbereiding:**
- Project met meerdere likes moet bestaan

**Stappen:**
1. Navigeer naar project detailpagina
2. Controleer dat aantal likes wordt getoond:
   - Aantal wordt getoond naast like knop
   - Aantal is correct (bijv. "5 likes")
3. Test real-time updates:
   - Open project in twee verschillende browsers/tabs
   - Like project in eerste browser
   - Controleer dat aantal wordt bijgewerkt in tweede browser
   - OF refresh tweede browser en controleer bijgewerkt aantal
4. Test met 0 likes:
   - Navigeer naar project zonder likes
   - Controleer dat "0 likes" of "Geen likes" wordt getoond

**Gewenst resultaat:**
- Aantal likes wordt getoond en bijgewerkt
- Real-time updates werken
- Aantal is altijd correct
- 0 likes wordt correct weergegeven

---

### Scenario 9.4: Reactie plaatsen

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Minimaal 1 project moet bestaan

**Testdata:**
- Reactie tekst: `Dit is een test reactie op het project.`

**Stappen:**
1. Navigeer naar project detailpagina
2. Zoek reactie formulier:
   - Reactie formulier is zichtbaar onder het project
   - Textarea of input veld is aanwezig
   - Submit knop is aanwezig
3. Type reactie tekst: `Dit is een test reactie op het project.`
4. Klik op submit knop
5. Wacht op response
6. Controleer dat reactie wordt geplaatst:
   - Reactie verschijnt in reacties lijst
   - Reactie toont auteur (jouw gebruikersnaam)
   - Reactie toont datum/tijd
   - Reactie toont inhoud
   - Reactie wordt opgeslagen in database
7. Refresh de pagina
8. Controleer dat reactie behouden blijft

**Gewenst resultaat:**
- Reactie formulier is toegevoegd aan projectpagina's
- Gebruiker kan een reactie typen en plaatsen
- Reactie wordt opgeslagen in database
- Reactie wordt direct getoond na plaatsen
- Reactie blijft behouden na refresh

**Alternatief pad 9.4a: Lege reactie**
- Testdata: Probeer lege reactie te plaatsen
- Gewenst resultaat: Validatie error wordt getoond

---

### Scenario 9.5: Reacties weergeven

**Voorbereiding:**
- Project met meerdere reacties moet bestaan

**Stappen:**
1. Navigeer naar project detailpagina met reacties
2. Zoek reacties sectie
3. Controleer dat alle reacties worden getoond:
   - Reacties worden getoond onder het project
   - Elke reactie toont:
     - Auteur (gebruikersnaam)
     - Datum/tijd van plaatsen
     - Inhoud van reactie
4. Controleer sortering:
   - Reacties zijn gesorteerd op datum (nieuwste eerst of oudste eerst)
5. Controleer layout:
   - Reacties zijn goed georganiseerd
   - Auteur informatie is duidelijk
   - Datum/tijd is leesbaar
6. Test met veel reacties:
   - Controleer paginering of scroll (indien geïmplementeerd)

**Gewenst resultaat:**
- Reacties worden getoond onder het project
- Reacties tonen auteur, datum/tijd en inhoud
- Reacties zijn goed georganiseerd en leesbaar
- Sortering werkt correct
- Layout is gebruiksvriendelijk

**Alternatief pad 9.5a: Geen reacties**
- Testdata: Project zonder reacties
- Gewenst resultaat: Bericht wordt getoond: "Nog geen reacties"

---

### Scenario 9.6: Eigen reactie bewerken en verwijderen

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Gebruiker moet minimaal 1 reactie hebben geplaatst

**Testdata:**
- Originele reactie: `Dit is mijn originele reactie.`
- Bewerkte reactie: `Dit is mijn bewerkte reactie.`

**Stappen voor Bewerken:**
1. Navigeer naar project detailpagina waar je een reactie hebt geplaatst
2. Zoek je eigen reactie in de lijst
3. Controleer dat "Bewerken" knop zichtbaar is bij je eigen reactie
4. Klik op "Bewerken" knop
5. Controleer dat reactie tekst bewerkbaar wordt:
   - Textarea wordt getoond met originele tekst
   - "Opslaan" en "Annuleren" knoppen zijn zichtbaar
6. Wijzig reactie tekst naar: `Dit is mijn bewerkte reactie.`
7. Klik op "Opslaan"
8. Controleer dat wijziging wordt opgeslagen:
   - Reactie wordt bijgewerkt in lijst
   - Datum/tijd wordt bijgewerkt (indien geïmplementeerd)
   - Wijziging wordt opgeslagen in database

**Stappen voor Verwijderen:**
1. Zoek je eigen reactie
2. Controleer dat "Verwijderen" knop zichtbaar is
3. Klik op "Verwijderen" knop
4. Controleer bevestigingsdialoog (indien geïmplementeerd):
   - Dialoog vraagt om bevestiging
   - Klik op "Bevestigen"
5. Controleer dat reactie wordt verwijderd:
   - Reactie verdwijnt uit lijst
   - Reactie wordt verwijderd uit database

**Gewenst resultaat:**
- Gebruiker kan zijn eigen reacties bewerken
- Gebruiker kan zijn eigen reacties verwijderen
- Bewerken werkt correct en wijzigingen worden opgeslagen
- Verwijderen werkt correct met bevestiging
- Andere gebruikers kunnen jouw reacties NIET bewerken/verwijderen

**Alternatief pad 9.6a: Andere gebruiker reactie bewerken**
- Testdata: Probeer reactie van andere gebruiker te bewerken
- Gewenst resultaat: "Bewerken" knop is niet zichtbaar

---

## Testrapport

### Resultaten per Scenario

#### Scenario 9.1: Project liken
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 9.2: Like verwijderen
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 9.3: Like count weergeven
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Real-time updates:** ☐ Ja ☐ Nee
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 9.4: Reactie plaatsen
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 9.5: Reacties weergeven
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Aantal reacties getoond:** [Aantal]
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 9.6: Eigen reactie bewerken en verwijderen
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

### Alternatieve Paden

#### Alternatief pad 9.1a: Eigen project liken
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 9.1b: Meerdere projecten liken
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 9.4a: Lege reactie
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 9.5a: Geen reacties
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 9.6a: Andere gebruiker reactie
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- [Beschrijf algemene bevindingen over like en reactie functionaliteit]
