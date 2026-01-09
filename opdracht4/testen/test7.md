# Test 7: Projecten Bookmarken (US-10)

## Testplan

### Gerelateerde User Story
**US-10: Projecten Bookmarken**
- Als lezer wil ik projecten kunnen bookmarken zodat ik ze snel terug kan vinden

### Testscenario's
1. **Scenario 7.1: Project bookmarken**
   - Gebruiker kan een project bookmarken via bookmark knop
   - Gerelateerd aan Task #65

2. **Scenario 7.2: Bookmark verwijderen**
   - Gebruiker kan een bookmark verwijderen
   - Gerelateerd aan Task #65

3. **Scenario 7.3: Bookmark pagina weergave**
   - Alle gebookmarkte projecten worden getoond op bookmark pagina
   - Gerelateerd aan Task #64

4. **Scenario 7.4: Bookmark status visueel aangeven**
   - Bookmark status wordt visueel aangegeven (gevulde/lege icon)
   - Gerelateerd aan Task #65

5. **Scenario 7.5: Alleen ingelogde gebruikers kunnen bookmarken**
   - Niet-ingelogde gebruikers kunnen niet bookmarken
   - Gerelateerd aan Task #65

6. **Scenario 7.6: Lege state bookmark pagina**
   - Lege state wordt getoond wanneer er geen bookmarks zijn
   - Gerelateerd aan Task #64

### Samenhang met andere User Stories
- **US-1**: Gebruiker moet ingelogd zijn om te bookmarken
- **US-8**: Bookmark knop moet aanwezig zijn op project detailpagina
- **US-5**: Bookmark functionaliteit moet werken vanuit Explore pagina

---

## Stap-voor-stap Testinstructies

### Scenario 7.1: Project bookmarken

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Minimaal 1 project moet bestaan (niet van de gebruiker zelf)

**Stappen:**
1. Navigeer naar project detailpagina van een project
2. Zoek bookmark knop op de pagina:
   - Bookmark knop is zichtbaar (mogelijk hart icon of bookmark icon)
   - Bookmark knop toont lege icon (nog niet gebookmarkt)
3. Klik op bookmark knop
4. Wacht op response
5. Controleer dat bookmark wordt toegevoegd:
   - Icon verandert naar gevulde icon
   - Success melding wordt getoond (indien geïmplementeerd)
   - Bookmark wordt opgeslagen in database
6. Refresh de pagina
7. Controleer dat bookmark status behouden blijft:
   - Icon blijft gevuld
   - Bookmark is nog steeds actief

**Gewenst resultaat:**
- Bookmark knop is toegevoegd aan projectpagina's
- Klikken op bookmark knop voegt project toe aan bookmarks
- Bookmark status wordt opgeslagen in database
- Bookmark status blijft behouden na refresh
- Visual feedback wordt gegeven (icon verandert)

**Alternatief pad 7.1a: Eigen project bookmarken**
- Testdata: Probeer eigen project te bookmarken
- Gewenst resultaat: Bookmark werkt (indien toegestaan) OF bookmark knop is verborgen

**Alternatief pad 7.1b: Meerdere projecten bookmarken**
- Testdata: Bookmark 5 verschillende projecten
- Gewenst resultaat: Alle bookmarks worden opgeslagen

---

### Scenario 7.2: Bookmark verwijderen

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Minimaal 1 project moet gebookmarkt zijn (via scenario 7.1)

**Stappen:**
1. Navigeer naar project detailpagina van gebookmarkt project
2. Controleer dat bookmark knop gevulde icon toont
3. Klik op bookmark knop
4. Wacht op response
5. Controleer dat bookmark wordt verwijderd:
   - Icon verandert naar lege icon
   - Success melding wordt getoond (indien geïmplementeerd)
   - Bookmark wordt verwijderd uit database
6. Navigeer naar bookmark pagina
7. Controleer dat project niet meer in lijst staat

**Gewenst resultaat:**
- Gebruiker kan bookmark verwijderen door opnieuw te klikken
- Bookmark wordt verwijderd uit database
- Visual feedback wordt gegeven (icon verandert)
- Project wordt verwijderd van bookmark pagina

**Alternatief pad 7.2a: Verwijderen vanaf bookmark pagina**
- Testdata: Verwijder bookmark via bookmark pagina
- Gewenst resultaat: Bookmark wordt verwijderd en project verdwijnt uit lijst

---

### Scenario 7.3: Bookmark pagina weergave

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Minimaal 3 projecten moeten gebookmarkt zijn

**Stappen:**
1. Navigeer naar bookmark pagina (via navbar of directe URL: `/bookmarks`)
2. Controleer dat bookmark pagina correct wordt geladen:
   - Pagina heeft duidelijke layout
   - Alle gebookmarkte projecten zijn zichtbaar
3. Controleer weergave van projecten:
   - Projecten worden getoond in grid of lijst
   - Elke projectcard toont:
     - Project titel
     - Project beschrijving (verkort)
     - Thumbnail/afbeelding
     - Auteur informatie
   - Elke projectcard heeft optie om bookmark te verwijderen
4. Test navigatie:
   - Klik op een projectcard
   - Controleer dat je naar project detailpagina wordt doorgestuurd
5. Test verwijder functionaliteit:
   - Klik op "Verwijder bookmark" knop op een projectcard
   - Controleer dat project wordt verwijderd uit lijst
6. Controleer responsive design:
   - Test op desktop, tablet en mobiel
   - Layout past zich aan aan schermformaat

**Gewenst resultaat:**
- Bookmark pagina heeft duidelijke layout
- Alle gebookmarkte projecten worden getoond in grid of lijst
- Elke projectcard heeft optie om bookmark te verwijderen
- Layout is responsive en gebruiksvriendelijk
- Klikken op projectcard navigeert naar project detailpagina

**Alternatief pad 7.3a: Sortering van bookmarks**
- Testdata: Bookmarks worden gesorteerd op datum of alfabetisch
- Gewenst resultaat: Bookmarks worden correct gesorteerd

---

### Scenario 7.4: Bookmark status visueel aangeven

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Sommige projecten zijn gebookmarkt, andere niet

**Stappen:**
1. Navigeer naar project detailpagina van NIET-gebookmarkt project
2. Controleer bookmark icon:
   - Icon is leeg/niet-gevuld
   - Icon is duidelijk zichtbaar
3. Bookmark het project
4. Controleer dat icon verandert:
   - Icon wordt gevuld
   - Visual feedback is duidelijk
5. Navigeer naar ander project (niet gebookmarkt)
6. Controleer dat icon weer leeg is
7. Navigeer naar Explore pagina
8. Controleer bookmark status op projectcards:
   - Gebookmarkte projecten tonen gevulde icon
   - Niet-gebookmarkte projecten tonen lege icon

**Gewenst resultaat:**
- Bookmark status wordt visueel aangegeven (gevulde/lege icon)
- Icon verandert duidelijk bij bookmarken/verwijderen
- Bookmark status is consistent op alle pagina's
- Visual feedback is gebruiksvriendelijk

**Alternatief pad 7.4a: Verschillende iconen**
- Testdata: Verschillende iconen worden gebruikt (hart, bookmark, ster)
- Gewenst resultaat: Iconen zijn consistent en duidelijk

---

### Scenario 7.5: Alleen ingelogde gebruikers kunnen bookmarken

**Voorbereiding:**
- Twee scenario's: ingelogd en niet-ingelogd

**Stappen voor ingelogde gebruiker:**
1. Log in als gebruiker
2. Navigeer naar project detailpagina
3. Controleer dat bookmark knop zichtbaar is
4. Klik op bookmark knop
5. Controleer dat bookmark werkt

**Stappen voor niet-ingelogde gebruiker:**
1. Log uit
2. Navigeer naar project detailpagina
3. Controleer bookmark knop:
   - Bookmark knop is NIET zichtbaar
   - OF bookmark knop is zichtbaar maar disabled
   - OF klikken op bookmark knop toont login prompt
4. Probeer direct naar bookmark pagina te navigeren
5. Controleer dat je wordt doorgestuurd naar login pagina

**Gewenst resultaat:**
- Ingelogde gebruikers kunnen bookmarken
- Niet-ingelogde gebruikers kunnen niet bookmarken
- Bookmark knop is verborgen of disabled voor niet-ingelogde gebruikers
- Toegang tot bookmark pagina vereist login
- Duidelijke feedback wordt gegeven (login prompt indien nodig)

**Alternatief pad 7.5a: Login prompt bij bookmarken**
- Testdata: Niet-ingelogde gebruiker klikt op bookmark knop
- Gewenst resultaat: Login prompt of redirect naar login pagina

---

### Scenario 7.6: Lege state bookmark pagina

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Geen bookmarks moeten bestaan (verwijder alle bookmarks)

**Stappen:**
1. Zorg dat je geen bookmarks hebt:
   - Verwijder alle bookmarks via bookmark pagina
   - OF gebruik nieuw account zonder bookmarks
2. Navigeer naar bookmark pagina
3. Wacht tot pagina geladen is
4. Controleer lege state:
   - Duidelijk bericht wordt getoond: "Je hebt nog geen bookmarks" of vergelijkbaar
   - Call-to-action kan worden getoond (bijv. "Bekijk projecten op Explore pagina")
   - Geen projectcards worden getoond
   - Design is consistent met rest van applicatie

**Gewenst resultaat:**
- Lege state wordt getoond wanneer er geen bookmarks zijn
- Bericht is duidelijk en gebruiksvriendelijk
- Geen errors worden getoond
- Design is consistent met de rest van de applicatie
- Call-to-action helpt gebruiker verder

**Alternatief pad 7.6a: Nieuwe gebruiker**
- Testdata: Nieuw account zonder bookmarks
- Gewenst resultaat: Lege state wordt getoond met welkomstbericht

---

## Testrapport

### Testuitvoering
**Datum:** [Vul datum in]  
**Tester:** [Vul naam in]  
**Applicatie versie:** [Vul versie in]  
**Browser:** [Vul browser in]  
**Aantal bookmarks getest:** [Aantal]

### Resultaten per Scenario

#### Scenario 7.1: Project bookmarken
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 7.2: Bookmark verwijderen
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 7.3: Bookmark pagina weergave
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Aantal bookmarks getoond:** [Aantal]
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 7.4: Bookmark status visueel aangeven
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 7.5: Alleen ingelogde gebruikers kunnen bookmarken
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 7.6: Lege state bookmark pagina
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

### Alternatieve Paden

#### Alternatief pad 7.1a: Eigen project bookmarken
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 7.1b: Meerdere projecten bookmarken
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 7.2a: Verwijderen vanaf bookmark pagina
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 7.3a: Sortering van bookmarks
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 7.4a: Verschillende iconen
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 7.5a: Login prompt
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 7.6a: Nieuwe gebruiker
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- [Beschrijf algemene bevindingen over bookmark functionaliteit]

**Samenhang met andere User Stories:**
- **US-1 (Authenticatie)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe authenticatie werkt met bookmarken]
- **US-8 (Project Detail)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe bookmark knop werkt op project detailpagina]
- **US-5 (Explore)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe bookmark functionaliteit werkt vanuit Explore pagina]

**Aanbevelingen:**
- [Lijst met aanbevelingen]

**Kritieke issues:**
- [Lijst met kritieke problemen]

**Totaal aantal tests:** 6 scenario's + 7 alternatieve paden = 13 tests  
**Geslaagd:** [Aantal]  
**Gefaald:** [Aantal]  
**Niet uitgevoerd:** [Aantal]  
**Succespercentage:** [Percentage]%
