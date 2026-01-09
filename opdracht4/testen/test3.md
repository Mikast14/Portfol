# Test 3: Home Page en Navigatie (US-4)

## Testplan

### Gerelateerde User Story
**US-4: Home Page**
- Als lezer wil ik een Home page zodat ik kan navigeren naar mijn profiel en andermans projecten

### Testscenario's
1. **Scenario 3.1: Home pagina layout en content**
   - Home pagina heeft correcte layout met hero sectie en projecten
   - Gerelateerd aan Task #45

2. **Scenario 3.2: Navbar functionaliteit**
   - Navbar bevat alle benodigde links en werkt correct
   - Gerelateerd aan Task #46

3. **Scenario 3.3: Navbar voor ingelogde gebruiker**
   - Navbar toont gebruikersnaam en logout knop wanneer ingelogd
   - Gerelateerd aan Task #46

4. **Scenario 3.4: Navbar voor niet-ingelogde gebruiker**
   - Navbar toont Login en Register knoppen wanneer niet ingelogd
   - Gerelateerd aan Task #46

5. **Scenario 3.5: Responsive design**
   - Home pagina en navbar zijn responsive op verschillende schermformaten
   - Gerelateerd aan Task #45 en #46

6. **Scenario 3.6: Navigatie tussen pagina's**
   - Alle links in navbar werken correct en navigeren naar juiste pagina's
   - Gerelateerd aan Task #46

### Samenhang met andere User Stories
- **US-1**: Navbar moet login/register tonen voor niet-ingelogde gebruikers
- **US-5**: Home pagina moet linken naar Explore pagina
- **US-11**: Home pagina moet linken naar profiel pagina
- **US-2**: Home pagina moet recente projecten tonen

---

## Stap-voor-stap Testinstructies

### Scenario 3.1: Home pagina layout en content

**Stappen:**
1. Open de applicatie in de browser
2. Navigeer naar de home pagina (root URL: `/`)
3. Controleer dat de volgende elementen aanwezig zijn:
   - Hero sectie met welkomsttekst
   - Sectie voor recente/populaire projecten
   - Call-to-action knoppen (indien aanwezig)
4. Controleer de layout:
   - Elementen zijn goed georganiseerd
   - Tekst is leesbaar
   - Spacing is consistent
5. Controleer dat design consistent is met de rest van de applicatie

**Gewenst resultaat:**
- Hero sectie is zichtbaar met duidelijke welkomsttekst
- Projecten sectie toont recente of populaire projecten (indien beschikbaar)
- Call-to-action knoppen zijn duidelijk zichtbaar en klikbaar
- Layout is professioneel en gebruiksvriendelijk
- Design is consistent met andere pagina's

**Alternatief pad 3.1a: Geen projecten beschikbaar**
- Testdata: Geen projecten in database
- Gewenst resultaat: Lege state wordt getoond met bericht "Nog geen projecten beschikbaar"

---

### Scenario 3.2: Navbar functionaliteit

**Stappen:**
1. Controleer dat navbar zichtbaar is aan de bovenkant van de pagina
2. Controleer dat navbar sticky/fixed is (blijft zichtbaar bij scrollen)
3. Controleer dat de volgende links/items aanwezig zijn:
   - Home link
   - Explore link
   - Login link (indien niet ingelogd)
   - Register link (indien niet ingelogd)
4. Controleer dat navbar een logo of titel bevat
5. Test de sticky functionaliteit:
   - Scroll naar beneden op de pagina
   - Controleer dat navbar nog steeds zichtbaar is

**Gewenst resultaat:**
- Navbar is altijd zichtbaar aan de bovenkant
- Navbar blijft zichtbaar bij scrollen (sticky/fixed)
- Alle benodigde links zijn aanwezig
- Logo/titel is zichtbaar
- Navbar heeft duidelijke styling

**Alternatief pad 3.2a: Navbar niet sticky**
- Testdata: Scroll naar beneden
- Gewenst resultaat: Navbar verdwijnt of blijft zichtbaar (afhankelijk van design keuze)

---

### Scenario 3.3: Navbar voor ingelogde gebruiker

**Voorbereiding:**
- Gebruiker moet ingelogd zijn

**Stappen:**
1. Log in als gebruiker
2. Navigeer naar home pagina
3. Controleer de navbar:
   - Gebruikersnaam is zichtbaar
   - Logout knop is zichtbaar
   - Login en Register links zijn NIET zichtbaar
4. Controleer dat actieve pagina wordt aangegeven (bijv. Home link is gehighlight)
5. Klik op gebruikersnaam (indien klikbaar)
6. Controleer dat je naar profiel wordt doorgestuurd

**Gewenst resultaat:**
- Gebruikersnaam wordt getoond in navbar
- Logout knop is zichtbaar en klikbaar
- Login en Register links zijn verborgen
- Actieve pagina wordt visueel aangegeven
- Klikken op gebruikersnaam navigeert naar profiel (indien geïmplementeerd)

**Alternatief pad 3.3a: Gebruikersnaam te lang**
- Testdata: Gebruiker met zeer lange gebruikersnaam
- Gewenst resultaat: Gebruikersnaam wordt afgekapt of navbar past zich aan

---

### Scenario 3.4: Navbar voor niet-ingelogde gebruiker

**Voorbereiding:**
- Gebruiker moet UITGELOGD zijn

**Stappen:**
1. Zorg dat je uitgelogd bent
2. Navigeer naar home pagina
3. Controleer de navbar:
   - Login link is zichtbaar
   - Register link is zichtbaar
   - Gebruikersnaam is NIET zichtbaar
   - Logout knop is NIET zichtbaar
4. Klik op Login link
5. Controleer dat je naar login pagina wordt doorgestuurd
6. Ga terug naar home pagina
7. Klik op Register link
8. Controleer dat je naar registratie pagina wordt doorgestuurd

**Gewenst resultaat:**
- Login en Register links zijn zichtbaar
- Gebruikersnaam en logout knop zijn verborgen
- Klikken op Login navigeert naar `/login`
- Klikken op Register navigeert naar `/register`
- Actieve pagina wordt aangegeven

---

### Scenario 3.5: Responsive design

**Testdata:**
- Verschillende schermformaten:
  - Desktop: 1920x1080
  - Tablet: 768x1024
  - Mobiel: 375x667

**Stappen voor Desktop:**
1. Open applicatie op desktop (1920x1080)
2. Controleer layout van home pagina
3. Controleer layout van navbar
4. Controleer dat alle elementen goed zichtbaar zijn

**Stappen voor Tablet:**
1. Open browser developer tools
2. Stel viewport in op tablet formaat (768x1024)
3. Controleer layout van home pagina
4. Controleer layout van navbar
5. Controleer dat content goed leesbaar is

**Stappen voor Mobiel:**
1. Stel viewport in op mobiel formaat (375x667)
2. Controleer dat navbar responsive is:
   - Hamburger menu verschijnt (indien geïmplementeerd)
   - Links zijn toegankelijk via menu
3. Controleer home pagina layout:
   - Content past zich aan schermformaat aan
   - Tekst is leesbaar zonder horizontaal scrollen
   - Knoppen zijn groot genoeg om te klikken

**Gewenst resultaat:**
- Desktop: Alle elementen zijn goed zichtbaar en georganiseerd
- Tablet: Layout past zich aan, content blijft leesbaar
- Mobiel: Hamburger menu werkt (indien geïmplementeerd), geen horizontaal scrollen
- Alle functionaliteit werkt op alle schermformaten

**Alternatief pad 3.5a: Hamburger menu niet werkend**
- Testdata: Mobiel formaat
- Gewenst resultaat: Menu opent en sluit correct, links zijn klikbaar

---

### Scenario 3.6: Navigatie tussen pagina's

**Stappen:**
1. Start op home pagina
2. Test elke link in navbar:
   - Klik op "Home" link
     - Controleer: Blijft op home pagina of refresh
   - Klik op "Explore" link
     - Controleer: Navigeert naar `/explore`
   - Klik op "Login" link (indien niet ingelogd)
     - Controleer: Navigeert naar `/login`
   - Klik op "Register" link (indien niet ingelogd)
     - Controleer: Navigeert naar `/register`
3. Test actieve pagina indicatie:
   - Navigeer naar verschillende pagina's
   - Controleer dat actieve pagina wordt gehighlight in navbar
4. Test browser back/forward knoppen:
   - Navigeer naar verschillende pagina's
   - Klik browser back knop
   - Controleer dat je terug gaat naar vorige pagina

**Gewenst resultaat:**
- Alle links navigeren naar correcte pagina's
- Actieve pagina wordt visueel aangegeven in navbar
- Browser navigatie (back/forward) werkt correct
- Geen 404 errors bij navigatie
- URL's zijn correct en beschrijvend

**Alternatief pad 3.6a: Broken link**
- Testdata: Link die niet werkt
- Gewenst resultaat: 404 pagina wordt getoond of redirect naar home

---

## Testrapport

### Testuitvoering
**Datum:** [Vul datum in]  
**Tester:** [Vul naam in]  
**Applicatie versie:** [Vul versie in]  
**Browser:** [Vul browser in]  
**Schermformaten getest:** Desktop, Tablet, Mobiel

### Resultaten per Scenario

#### Scenario 3.1: Home pagina layout en content
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 3.2: Navbar functionaliteit
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 3.3: Navbar voor ingelogde gebruiker
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 3.4: Navbar voor niet-ingelogde gebruiker
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 3.5: Responsive design
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Desktop:** ☐ Geslaagd ☐ Gefaald
- **Tablet:** ☐ Geslaagd ☐ Gefaald
- **Mobiel:** ☐ Geslaagd ☐ Gefaald
- **Opmerkingen:** 
  - [Vul opmerkingen in]

#### Scenario 3.6: Navigatie tussen pagina's
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

### Alternatieve Paden

#### Alternatief pad 3.1a: Geen projecten beschikbaar
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 3.2a: Navbar niet sticky
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 3.3a: Gebruikersnaam te lang
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 3.5a: Hamburger menu
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 3.6a: Broken link
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- [Beschrijf algemene bevindingen over home pagina en navigatie]

**Samenhang met andere User Stories:**
- **US-1 (Authenticatie)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe navbar werkt met authenticatie]
- **US-5 (Explore)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe navigatie werkt naar Explore pagina]
- **US-11 (Profiel)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe navigatie werkt naar profiel]
- **US-2 (Projecten)**: ☐ Werkt correct ☐ Werkt niet
  - [Beschrijf hoe home pagina projecten toont]

**Aanbevelingen:**
- [Lijst met aanbevelingen]

**Kritieke issues:**
- [Lijst met kritieke problemen]

**Totaal aantal tests:** 6 scenario's + 5 alternatieve paden = 11 tests  
**Geslaagd:** [Aantal]  
**Gefaald:** [Aantal]  
**Niet uitgevoerd:** [Aantal]  
**Succespercentage:** [Percentage]%
