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
   - Gebruiker kan profielfoto uploaden en wijzigen
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

6. **Scenario 10.6: Validatie en security**
   - Validatie en security checks werken correct
   - Gerelateerd aan alle tasks

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
   - Secties zijn georganiseerd (profiel, contact, account, privacy)
4. Controleer navigatie tussen secties:
   - Tabs of links naar verschillende secties zijn zichtbaar
   - Klikken op sectie navigeert naar juiste sectie
5. Controleer responsive design:
   - Layout werkt op desktop, tablet en mobiel
   - Formulieren zijn gebruiksvriendelijk

**Gewenst resultaat:**
- Settings pagina heeft duidelijke layout met secties
- Layout bevat secties voor profiel, contact, account en privacy
- Formulieren zijn georganiseerd en gebruiksvriendelijk
- Layout is responsive en werkt op alle schermformaten
- Navigatie tussen secties is duidelijk

---

### Scenario 10.2: Profielfoto wijzigen

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Bereid testafbeelding voor (JPG, max 5MB)

**Testdata:**
- Nieuwe profielfoto: `new-profile.jpg` (2MB, JPG formaat)

**Stappen:**
1. Navigeer naar settings pagina
2. Zoek "Profielfoto" sectie
3. Controleer huidige profielfoto (indien aanwezig)
4. Klik op "Upload nieuwe foto" of "Wijzigen" knop
5. Selecteer bestand: `new-profile.jpg`
6. Controleer preview van nieuwe profielfoto
7. Klik op "Opslaan" knop
8. Wacht op upload en opslaan
9. Controleer dat profielfoto wordt bijgewerkt:
   - Success melding wordt getoond
   - Profielfoto wordt opgeslagen in database
   - Profielfoto is zichtbaar op profielpagina

**Gewenst resultaat:**
- Gebruiker kan nieuwe profielfoto uploaden
- Ondersteunde bestandsformaten werken (JPG, PNG, GIF, WebP)
- Bestandsgrootte limiet wordt gehandhaafd
- Preview van nieuwe profielfoto wordt getoond
- Profielfoto wordt opgeslagen en bijgewerkt in database

**Alternatief pad 10.2a: Te groot bestand**
- Testdata: Afbeelding van 10MB
- Gewenst resultaat: Error melding "Bestand is te groot"

**Alternatief pad 10.2b: Ongeldig bestandstype**
- Testdata: PDF bestand
- Gewenst resultaat: Error melding "Alleen JPG, PNG, GIF, WebP zijn toegestaan"

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
   - URL naar profielpagina wordt bijgewerkt (indien van toepassing)

**Gewenst resultaat:**
- Gebruiker kan zijn gebruikersnaam wijzigen
- Gebruikersnaam wordt gevalideerd (uniek, min/max lengte)
- Duplicate gebruikersnamen worden voorkomen
- Wijziging wordt opgeslagen in database
- Success melding wordt getoond na wijziging

**Alternatief pad 10.3a: Duplicate gebruikersnaam**
- Testdata: Gebruikersnaam die al bestaat
- Gewenst resultaat: Error melding "Deze gebruikersnaam is al in gebruik"

**Alternatief pad 10.3b: Te korte gebruikersnaam**
- Testdata: Gebruikersnaam met 2 karakters
- Gewenst resultaat: Error melding "Gebruikersnaam moet minimaal X karakters bevatten"

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
   - Gebruiker moet wachtwoord invoeren voor bevestiging
5. Vul wachtwoord in voor bevestiging
6. Klik op "Bevestigen verwijderen" knop
7. Wacht op response
8. Controleer dat account wordt verwijderd:
   - Success melding wordt getoond
   - Gebruiker wordt uitgelogd
   - Gebruiker wordt doorgestuurd naar home pagina
   - Account en gerelateerde data worden verwijderd uit database

**Gewenst resultaat:**
- Gebruiker kan zijn account verwijderen
- Bevestigingsdialoog wordt getoond voordat verwijderen
- Gebruiker moet wachtwoord invoeren voor bevestiging
- Account en gerelateerde data worden verwijderd uit database
- Gebruiker wordt uitgelogd en doorgestuurd naar home pagina

**Alternatief pad 10.5a: Annuleren verwijderen**
- Testdata: Klik op "Annuleren" in bevestigingsdialoog
- Gewenst resultaat: Dialoog sluit, account wordt niet verwijderd

**Alternatief pad 10.5b: Verkeerd wachtwoord bij verwijderen**
- Testdata: Verkeerd wachtwoord ingevoerd
- Gewenst resultaat: Error melding, account wordt niet verwijderd

---

### Scenario 10.6: Validatie en security

**Testdata voor verschillende validatiefouten:**

**Test 10.6a: Alleen ingelogde gebruikers**
- Stappen: Probeer settings pagina te openen zonder ingelogd te zijn
- Gewenst resultaat: Redirect naar login pagina

**Test 10.6b: CSRF protection**
- Stappen: Probeer formulier te submitten zonder geldige token
- Gewenst resultaat: Error melding, wijziging wordt niet opgeslagen

**Test 10.6c: XSS protection**
- Testdata: Probeer script tags in te voeren in tekstvelden
- Gewenst resultaat: Script tags worden gefilterd of ge-escaped

**Gewenst resultaat:**
- Validatie is correct geïmplementeerd voor alle velden
- Security best practices zijn gevolgd
- Alleen ingelogde gebruikers kunnen settings bewerken
- CSRF protection is geïmplementeerd
- XSS protection is geïmplementeerd

---

## Testrapport

### Testuitvoering
**Datum:** [Vul datum in]  
**Tester:** [Vul naam in]  
**Applicatie versie:** [Vul versie in]  
**Browser:** [Vul browser in]

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

#### Scenario 10.6: Validatie en security
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

### Alternatieve Paden

#### Alternatief pad 10.2a: Te groot bestand
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 10.2b: Ongeldig bestandstype
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 10.3a: Duplicate gebruikersnaam
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 10.3b: Te korte gebruikersnaam
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 10.4a: Verkeerd huidig wachtwoord
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 10.4b: Te kort nieuw wachtwoord
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 10.4c: Wachtwoorden komen niet overeen
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 10.5a: Annuleren verwijderen
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 10.5b: Verkeerd wachtwoord bij verwijderen
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

**Totaal aantal tests:** 6 scenario's + 9 alternatieve paden = 15 tests  
**Geslaagd:** [Aantal]  
**Gefaald:** [Aantal]  
**Niet uitgevoerd:** [Aantal]  
**Succespercentage:** [Percentage]%
