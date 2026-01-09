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
   - Navbar toont Profile picture
   - Gerelateerd aan Task #46

4. **Scenario 3.4: Navbar voor niet-ingelogde gebruiker**
   - Navbar toont Login en Register knoppen wanneer niet ingelogd
   - Gerelateerd aan Task #46

5. **Scenario 3.6: Navigatie tussen pagina's**
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
   - Hero sectie
4. Controleer de layout:
   - Elementen zijn goed georganiseerd
5. Controleer dat design consistent is met de rest van de applicatie

**Gewenst resultaat:**
- Hero sectie is zichtbaar
- Layout is professioneel en gebruiksvriendelijk
- Design is consistent met andere pagina's

---

### Scenario 3.2: Navbar functionaliteit

**Stappen:**
1. Controleer dat navbar zichtbaar is aan de bovenkant van de pagina
2. Controleer dat navbar sticky/fixed is (blijft zichtbaar bij scrollen)
3. Controleer dat de volgende links/items aanwezig zijn:
   - Home link
   - Explore link
   - Bookmark (indien ingelogd)
   - Login link (indien niet ingelogd)
   - Register link (indien niet ingelogd)
4. Controleer dat navbar een logo bevat
5. Test de sticky functionaliteit:
   - Scroll naar beneden op de pagina
   - Controleer dat navbar nog steeds zichtbaar is

**Gewenst resultaat:**
- Navbar is altijd zichtbaar aan de bovenkant
- Navbar blijft zichtbaar bij scrollen (sticky/fixed)
- Alle benodigde links zijn aanwezig
- Logo is zichtbaar
- Navbar heeft duidelijke styling

---

### Scenario 3.3: Navbar voor ingelogde gebruiker

**Voorbereiding:**
- Gebruiker moet ingelogd zijn

**Stappen:**
1. Log in als gebruiker
2. Navigeer naar home pagina
3. Controleer de navbar:
   - Profile picture is zichtbaar
   - Login en Register links zijn NIET zichtbaar
4. Klik op profile picture (indien klikbaar)
5. Controleer dat je naar profiel wordt doorgestuurd

**Gewenst resultaat:**
- Profile picture wordt getoond in navbar
- Login en Register links zijn verborgen
- Klikken op profile picture navigeert naar profiel (indien geïmplementeerd)

**Alternatief pad 3.3a: Profile picture niet geladen**
- Testdata: Gebruiker zonder profile picture
- Gewenst resultaat: Placeholder image wordt getoond of default avatar

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
   - Profile picture is NIET zichtbaar
4. Klik op Login link
5. Controleer dat je naar login pagina wordt doorgestuurd
6. Ga terug naar home pagina
7. Klik op Register link
8. Controleer dat je naar registratie pagina wordt doorgestuurd

**Gewenst resultaat:**
- Login en Register links zijn zichtbaar
- Profile picture is verborgen
- Klikken op Login navigeert naar `/login`
- Klikken op Register navigeert naar `/register`
- Actieve pagina wordt aangegeven

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
3. Test browser back/forward knoppen:
   - Navigeer naar verschillende pagina's
   - Klik browser back knop
   - Controleer dat je terug gaat naar vorige pagina

**Gewenst resultaat:**
- Alle links navigeren naar correcte pagina's
- Browser navigatie (back/forward) werkt correct
- Geen 404 errors bij navigatie
- URL's zijn correct en beschrijvend

**Alternatief pad 3.6a: Broken link**
- Testdata: Link die niet werkt
- Gewenst resultaat: 404 pagina wordt getoond

---

## Testrapport

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

#### Scenario 3.6: Navigatie tussen pagina's
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - [Vul opmerkingen in]

### Alternatieve Paden

#### Alternatief pad 3.3a: Profile picture niet geladen
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 3.6a: Broken link
- **Status:** ☐ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- [Beschrijf algemene bevindingen over home pagina en navigatie]
