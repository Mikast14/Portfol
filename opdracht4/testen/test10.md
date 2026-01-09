# Test 10: Settings Page (US-16)

## Testplan

### Gerelateerde User Story
**US-16: Settings Page**
- Als gebruiker wil ik een settings page zodat ik hier info van mij kan veranderen

### Testscenario's
1. **Scenario 10.1: Settings pagina layout**
   - Settings pagina heeft correcte layout met secties
   - Gerelateerd aan Task #97

2. **Scenario 10.2: Profielfoto wijzigen**
   - Gebruiker kan profielfoto wijzigen door image URL in te voeren
   - Gerelateerd aan Task #98

3. **Scenario 10.3: Gebruikersnaam wijzigen**
   - Gebruiker kan zijn gebruikersnaam wijzigen
   - Gerelateerd aan Task #99

4. **Scenario 10.4: Wachtwoord reset**
   - Gebruiker kan zijn wachtwoord wijzigen
   - Gerelateerd aan Task #100

5. **Scenario 10.5: Account verwijderen**
   - Gebruiker kan zijn account verwijderen
   - Gerelateerd aan Task #101

### Samenhang met andere User Stories
- **US-1**: Gebruiker moet ingelogd zijn om settings te bewerken
- **US-11**: Wijzigingen in settings moeten zichtbaar zijn op profielpagina

---

## Stap-voor-stap Testinstructies

### Scenario 10.1: Settings pagina layout

**Voorbereiding:**
- Gebruiker moet ingelogd zijn

**Stappen:**
1. Log in als gebruiker
2. Navigeer naar settings pagina (via navbar of directe URL: `/settings`)
3. Controleer dat settings pagina correct wordt geladen:
   - Pagina heeft duidelijke layout met secties
   - Secties zijn georganiseerd (Profile image, Username, delete account)

**Gewenst resultaat:**
- Settings pagina heeft duidelijke layout met secties
- Layout bevat secties voor Profile image, Username, delete account
- Formulieren zijn georganiseerd en gebruiksvriendelijk

---

### Scenario 10.2: Profielfoto wijzigen

**Voorbereiding:**
- Gebruiker moet ingelogd zijn

**Testdata:**
- Nieuwe profielfoto URL: `https://example.com/profile-image.jpg`

**Stappen:**
1. Navigeer naar settings pagina
2. Zoek "Profile image" sectie
3. Controleer huidige profielfoto
4. Voer image URL in: `https://example.com/profile-image.jpg`
5. Controleer preview van nieuwe profielfoto
6. Klik op "Opslaan" knop
7. Wacht op opslaan
8. Controleer dat profielfoto wordt bijgewerkt:
   - Profielfoto URL wordt opgeslagen in database
   - Profielfoto is zichtbaar op profielpagina

**Gewenst resultaat:**
- Gebruiker kan nieuwe profielfoto URL invoeren
- URL wordt gevalideerd (moet geldige URL zijn)
- Preview van nieuwe profielfoto wordt getoond
- Profielfoto URL wordt opgeslagen en bijgewerkt in database
- Profielfoto is zichtbaar op profielpagina

**Alternatief pad 10.2a: Ongeldige URL**
- Testdata: Ongeldige URL zoals `geen-url`
- Gewenst resultaat: Error melding "Ongeldige URL"

**Alternatief pad 10.2b: URL die geen afbeelding is**
- Testdata: URL naar een HTML pagina
- Gewenst resultaat: Error melding "URL moet naar een afbeelding verwijzen" of afbeelding wordt niet getoond

---

### Scenario 10.3: Gebruikersnaam wijzigen

**Voorbereiding:**
- Gebruiker moet ingelogd zijn

**Testdata:**
- Huidige gebruikersnaam: `testuser`
- Nieuwe gebruikersnaam: `testuser_new`

**Stappen:**
1. Navigeer naar settings pagina
2. Zoek "Gebruikersnaam" sectie
3. Controleer huidige gebruikersnaam wordt getoond
4. Wijzig gebruikersnaam naar: `testuser_new`
5. Klik op "Opslaan" knop
6. Wacht op response
7. Controleer dat gebruikersnaam wordt bijgewerkt:
   - Success melding wordt getoond
   - Wijziging wordt opgeslagen in database
   - Gebruikersnaam is zichtbaar op profielpagina
   - URL naar profielpagina wordt bijgewerkt

**Gewenst resultaat:**
- Gebruiker kan zijn gebruikersnaam wijzigen
- Wijziging wordt opgeslagen in database
- Success melding wordt getoond na wijziging

---

### Scenario 10.4: Wachtwoord reset

**Voorbereiding:**
- Gebruiker moet ingelogd zijn

**Testdata:**
- Huidig wachtwoord: `HuidigWachtwoord123!`
- Nieuw wachtwoord: `NieuwWachtwoord456!`

**Stappen:**
1. Navigeer naar settings pagina
2. Zoek "Wachtwoord wijzigen" sectie
3. Vul huidig wachtwoord in: `HuidigWachtwoord123!`
4. Vul nieuw wachtwoord in: `NieuwWachtwoord456!`
5. Vul bevestig nieuw wachtwoord in: `NieuwWachtwoord456!`
6. Klik op "Wachtwoord wijzigen" knop
7. Wacht op response
8. Controleer dat wachtwoord wordt gewijzigd:
   - Success melding wordt getoond
   - Wachtwoord wordt gehashed en opgeslagen in database
9. Test nieuwe wachtwoord:
   - Log uit
   - Log in met nieuw wachtwoord
   - Controleer dat login werkt

**Gewenst resultaat:**
- Gebruiker kan zijn wachtwoord wijzigen
- Huidig wachtwoord moet worden ingevoerd voor verificatie
- Nieuw wachtwoord moet voldoen aan vereisten (min 8 karakters)
- Wachtwoord wordt gehashed voordat opslaan
- Success melding wordt getoond na wijziging
- Nieuw wachtwoord werkt bij login

**Alternatief pad 10.4a: Verkeerd huidig wachtwoord**
- Testdata: Verkeerd huidig wachtwoord
- Gewenst resultaat: Error melding "Huidig wachtwoord is onjuist"

**Alternatief pad 10.4b: Te kort nieuw wachtwoord**
- Testdata: Nieuw wachtwoord met 5 karakters
- Gewenst resultaat: Error melding "Wachtwoord moet minimaal 8 karakters bevatten"

**Alternatief pad 10.4c: Wachtwoorden komen niet overeen**
- Testdata: Nieuw wachtwoord en bevestiging komen niet overeen
- Gewenst resultaat: Error melding "Wachtwoorden komen niet overeen"

---

### Scenario 10.5: Account verwijderen

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Testaccount dat verwijderd mag worden

**Stappen:**
1. Navigeer naar settings pagina
2. Zoek "Account verwijderen" sectie
3. Klik op "Account verwijderen" knop
4. Controleer bevestigingsdialoog:
   - Dialoog wordt getoond met waarschuwing
   - Gebruiker moet DELETE invoeren voor bevestiging
5. Vul DELETE in voor bevestiging
6. Klik op "Bevestigen verwijderen" knop
7. Wacht op response
8. Controleer dat account wordt verwijderd:
   - Success melding wordt getoond
   - Gebruiker wordt uitgelogd
   - Account en gerelateerde data worden verwijderd uit database

**Gewenst resultaat:**
- Gebruiker kan zijn account verwijderen
- Bevestigingsdialoog wordt getoond voordat verwijderen
- Gebruiker moet DELETE invoeren voor bevestiging
- Account en gerelateerde data worden verwijderd uit database

**Alternatief pad 10.5a: Annuleren verwijderen**
- Testdata: Klik op "Annuleren" in bevestigingsdialoog
- Gewenst resultaat: Dialoog sluit, account wordt niet verwijderd

**Alternatief pad 10.5b: Niet DELETE ingevoerd**
- Testdata: Niet DELETE ingevoerd
- Gewenst resultaat: Error melding, account wordt niet verwijderd

---

## Testrapport

### Resultaten per Scenario

#### Scenario 10.1: Settings pagina layout
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 10.2: Profielfoto wijzigen
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 10.3: Gebruikersnaam wijzigen
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 10.4: Wachtwoord reset
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 10.5: Account verwijderen
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

### Alternatieve Paden

#### Alternatief pad 10.2a: Ongeldige URL
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 10.2b: URL die geen afbeelding is
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 10.4a: Verkeerd huidig wachtwoord
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 10.4b: Te kort nieuw wachtwoord
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 10.4c: Wachtwoorden komen niet overeen
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 10.5a: Annuleren verwijderen
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 10.5b: Niet DELETE ingevoerd
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- [Beschrijf algemene bevindingen over settings functionaliteit]

**Samenhang met andere User Stories:**
- **US-1 (Authenticatie)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe authenticatie werkt met settings]
- **US-11 (Profiel)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe wijzigingen in settings zichtbaar zijn op profielpagina]

**Security:**
- **CSRF protection:** ☐ Geïmplementeerd ☐ Niet geïmplementeerd
- **XSS protection:** ☐ Geïmplementeerd ☐ Niet geïmplementeerd
- **Wachtwoord hashing:** ☐ Geïmplementeerd ☐ Niet geïmplementeerd

**Aanbevelingen:**
- [Lijst met aanbevelingen]

**Kritieke issues:**
- [Lijst met kritieke problemen]

**Totaal aantal tests:** 5 scenario's + 7 alternatieve paden = 12 tests  
**Geslaagd:** [Aantal]  
**Gefaald:** [Aantal]  
**Niet uitgevoerd:** [Aantal]  
**Succespercentage:** [Percentage]%
