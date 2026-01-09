# Test 1: Registratie en Inloggen (US-1)

## Testplan

### Gerelateerde User Story
**US-1: Registratie en Inloggen**
- Als gebruiker wil ik kunnen inloggen en registreren zodat ik mijn profiel kan aanpassen

### Testscenario's
1. **Scenario 1.1: Succesvolle registratie**
   - Nieuwe gebruiker kan zich registreren met geldige gegevens
   - Gerelateerd aan Task #34 en #35

2. **Scenario 1.2: Succesvol inloggen**
   - Bestaande gebruiker kan inloggen met correcte credentials
   - Gerelateerd aan Task #34 en #36

3. **Scenario 1.3: Validatiefouten bij registratie**
   - Formulier toont errors bij ongeldige input
   - Gerelateerd aan Task #34

4. **Scenario 1.4: Uitloggen**
   - Gebruiker kan uitloggen en sessie wordt verwijderd
   - Gerelateerd aan Task #36

### Samenhang met andere User Stories
- **US-2**: Na inloggen moet gebruiker projecten kunnen aanmaken
- **US-11**: Na inloggen moet gebruiker profiel kunnen bekijken
- **US-16**: Na inloggen moet gebruiker settings kunnen aanpassen

---

## Stap-voor-stap Testinstructies

### Scenario 1.1: Succesvolle registratie

**Testdata:**
- Username: `testuser1`
- Email: `testuser1@example.com`
- Wachtwoord: `Test1234!`
- Bevestig wachtwoord: `Test1234!`

**Stappen:**
1. Open de applicatie in de browser
2. Navigeer naar de registratie pagina (via navbar of directe URL)
3. Controleer dat het registratieformulier zichtbaar is met de volgende velden:
   - Username veld
   - Emailadres veld
   - Wachtwoord veld
   - Bevestig wachtwoord veld
   - Submit knop
4. Vul het username veld in: `testuser1`
5. Vul het emailadres veld in: `testuser1@example.com`
6. Vul het wachtwoord veld in: `Test1234!`
7. Vul het bevestig wachtwoord veld in: `Test1234!`
8. Klik op de submit knop
9. Wacht op de response

**Gewenst resultaat:**
- Success melding wordt getoond
- Gebruiker wordt doorgestuurd naar dashboard/profiel pagina
- Gebruiker is ingelogd (navbar toont profilepicture)
- Gebruikersgegevens zijn opgeslagen in de database

**Alternatief pad 1.1a: Lege username**
- Testdata: Username: (leeg), Email: `testuser1@example.com`, Wachtwoord: `Test1234!`
- Gewenst resultaat: Validatie error wordt getoond bij username veld

**Alternatief pad 1.1b: Ongeldig email formaat**
- Testdata: Username: `testuser1`, Email: `ongeldig-email`, Wachtwoord: `Test1234!`
- Gewenst resultaat: Validatie error wordt getoond bij email veld

**Alternatief pad 1.1c: Wachtwoorden komen niet overeen**
- Testdata: Username: `testuser1`, Email: `testuser1@example.com`, Wachtwoord: `Test1234!`, Bevestig: `AnderWachtwoord123!`
- Gewenst resultaat: Validatie error wordt getoond bij bevestig wachtwoord veld

**Alternatief pad 1.1d: Te kort wachtwoord**
- Testdata: Username: `testuser1`, Email: `testuser1@example.com`, Wachtwoord: `Test1!`
- Gewenst resultaat: Validatie error wordt getoond bij wachtwoord veld

---

### Scenario 1.2: Succesvol inloggen

**Testdata:**
- Email: `testuser1@example.com` (gebruiker uit scenario 1.1)
- Wachtwoord: `Test1234!`

**Stappen:**
1. Navigeer naar de login pagina
2. Controleer dat het loginformulier zichtbaar is met:
   - Emailadres veld
   - Wachtwoord veld
   - Submit knop
3. Vul het emailadres veld in: `testuser1@example.com`
4. Vul het wachtwoord veld in: `Test1234!`
5. Klik op de submit knop
6. Wacht op de response

**Gewenst resultaat:**
- Gebruiker wordt doorgestuurd naar dashboard/profiel pagina
- Gebruiker is ingelogd (navbar toont profilepicture)
- Sessie wordt aangemaakt en opgeslagen

**Alternatief pad 1.2a: Verkeerd wachtwoord**
- Testdata: Wachtwoord: `VerkeerdWachtwoord123!`
- Gewenst resultaat: Error melding "Ongeldige inloggegevens" wordt getoond

**Alternatief pad 1.2b: Onbekend emailadres**
- Testdata: Email: `onbekend@example.com`
- Gewenst resultaat: Error melding "Ongeldige inloggegevens" wordt getoond

**Alternatief pad 1.2c: Lege velden**
- Testdata: Beide velden leeg
- Gewenst resultaat: Validatie errors worden getoond bij beide velden

---

### Scenario 1.3: Validatiefouten bij registratie

**Testdata voor verschillende validatiefouten:**

**Test 1.3a: Lege velden**
- Stappen: Laat alle velden leeg en klik submit
- Gewenst resultaat: Validatie errors worden getoond bij alle verplichte velden

**Test 1.3b: Ongeldig email formaat**
- Testdata: Email: `geen-at-teken`, Wachtwoord: `Test1234!`
- Gewenst resultaat: Error melding bij email veld

**Test 1.3c: Wachtwoord te kort**
- Testdata: Wachtwoord: `Test1!` (minder dan 8 karakters)
- Gewenst resultaat: Error melding bij wachtwoord veld

**Test 1.3d: Wachtwoord zonder speciale tekens**
- Testdata: Wachtwoord: `Test1234` (geen speciale tekens)
- Gewenst resultaat: Error melding indien vereist

---

### Scenario 1.4: Uitloggen

**Voorbereiding:**
- Gebruiker moet ingelogd zijn

**Stappen:**
1. Controleer dat je ingelogd bent
2. Klik op de logout knop in de navbar
3. Wacht op response

**Gewenst resultaat:**
- Gebruiker wordt uitgelogd
- Gebruiker wordt doorgestuurd naar home pagina of login pagina
- Navbar toont nu "Login" en "Register" knoppen
- Sessie is verwijderd (cookie/localStorage is leeg)
- Bij refresh van pagina blijft gebruiker uitgelogd

---

## Testrapport

### Resultaten per Scenario

#### Scenario 1.1: Succesvolle registratie
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]
- **Screenshots:** [Voeg screenshots toe indien beschikbaar]

#### Scenario 1.2: Succesvol inloggen
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 1.3: Validatiefouten bij registratie
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 1.4: Uitloggen
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

### Alternatieve Paden

#### Alternatief pad 1.1a: Lege username
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 1.1b: Ongeldig email formaat
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 1.1c: Wachtwoorden komen niet overeen
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 1.1d: Te kort wachtwoord
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 1.2a: Verkeerd wachtwoord
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 1.2b: Onbekend emailadres
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- [Beschrijf algemene bevindingen over de authenticatie functionaliteit]

**Samenhang met andere User Stories:**
- **US-2 (Projecten)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe inloggen werkt met projecten aanmaken]
- **US-11 (Profiel)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe inloggen werkt met profiel bekijken]
- **US-16 (Settings)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe inloggen werkt met settings aanpassen]

**Aanbevelingen:**
- [Lijst met aanbevelingen voor verbeteringen]

**Kritieke issues:**
- [Lijst met kritieke problemen die opgelost moeten worden]

**Totaal aantal tests:** 4 scenario's + 6 alternatieve paden = 10 tests  
**Geslaagd:** [Aantal]  
**Gefaald:** [Aantal]  
**Niet uitgevoerd:** [Aantal]  
**Succespercentage:** [Percentage]%
