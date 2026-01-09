# Test 6: Project Type & Platforms Selectie (US-2)

## Testplan

### Gerelateerde User Story
**US-2: Projecten Aanmaken en Bewerken**
- Als gebruiker wil ik projecten kunnen aanmaken en bewerken op de website zodat bezoekers mijn projecten actueel kan houden

### Testscenario's
1. **Scenario 6.1: Project type selecteren**
   - Gebruiker kan een project type selecteren (Game, App, Website)
   - Gerelateerd aan Task #37

2. **Scenario 6.2: Platforms selecteren na project type**
   - Gebruiker kan platforms selecteren nadat project type is gekozen
   - Platforms zijn afhankelijk van gekozen project type
   - Gerelateerd aan Task #37

3. **Scenario 6.3: Meerdere platforms selecteren**
   - Gebruiker kan meerdere platforms selecteren voor een project
   - Gerelateerd aan Task #37

4. **Scenario 6.4: Project type wijzigen**
   - Wanneer gebruiker project type wijzigt, worden platforms gewist
   - Nieuwe beschikbare platforms worden getoond
   - Gerelateerd aan Task #37

5. **Scenario 6.5: Validatie - Geen project type**
   - Systeem valideert dat een project type moet worden geselecteerd
   - Gerelateerd aan Task #37

6. **Scenario 6.6: Validatie - Geen platforms**
   - Systeem valideert dat minimaal één platform moet worden geselecteerd
   - Gerelateerd aan Task #37

### Samenhang met andere User Stories
- **US-2**: Project type en platforms zijn onderdeel van project aanmaken
- **US-5**: Project type en platforms worden gebruikt voor filteren op Explore pagina
- **US-8**: Project type en platforms worden weergegeven op project detailpagina

---

## Stap-voor-stap Testinstructies

### Scenario 6.1: Project type selecteren

**Voorbereiding:**
- Gebruiker moet ingelogd zijn

**Stappen:**
1. Navigeer naar "Project toevoegen" pagina
2. Scroll naar de sectie "Project Type & Platforms"
3. Controleer dat de sectie zichtbaar is met:
   - Titel: "Project Type & Platforms"
   - Instructie: "First choose your project type, then select the platforms"
   - Step 1: "Choose Project Type" heading
4. Controleer dat drie project types zichtbaar zijn:
   - "Game" (met game controller icon)
   - "App" (met app grid icon)
   - "Website" (met globe icon)
5. Klik op "Game" project type
6. Controleer dat "Game" wordt geselecteerd:
   - Box heeft pink border en licht pink achtergrond
   - Pink checkmark icon verschijnt in rechterbovenhoek
7. Controleer dat Step 2 nu zichtbaar is met beschikbare platforms voor Game

**Gewenst resultaat:**
- Alle drie project types zijn zichtbaar en klikbaar
- Geselecteerd project type wordt visueel aangegeven (pink border, achtergrond, checkmark)
- Step 2 wordt getoond nadat project type is geselecteerd
- Alleen platforms die passen bij het gekozen type zijn beschikbaar

**Platforms per type:**
- **Game:** windows, macOS, Linux, Web, iOS, Android, PlayStation, Xbox, Nintendo (9 platforms)
- **App:** windows, macOS, Linux, Web, iOS, Android (6 platforms)
- **Website:** Web (1 platform)

**Alternatief pad 6.1a: App selecteren**
- Stappen: Selecteer "App" project type
- Gewenst resultaat: Alleen desktop en mobile platforms zijn beschikbaar (geen console platforms)

**Alternatief pad 6.1b: Website selecteren**
- Stappen: Selecteer "Website" project type
- Gewenst resultaat: Alleen "Web" platform is beschikbaar

---

### Scenario 6.2: Platforms selecteren na project type

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Project type "Game" moet geselecteerd zijn (uit scenario 6.1)

**Stappen:**
1. Controleer dat Step 2 "Choose Platforms" zichtbaar is
2. Controleer dat alle 9 platforms voor Game zichtbaar zijn:
   - Windows, macOS, Linux (rij 1)
   - Web, iOS, Android (rij 2)
   - PlayStation, Xbox, Nintendo (rij 3)
3. Controleer dat elk platform heeft:
   - Platform icon (pink gekleurd)
   - Platform naam
   - Witte achtergrond met grijze border (niet geselecteerd)
4. Klik op "Windows" platform
5. Controleer dat "Windows" wordt geselecteerd:
   - Box krijgt pink border en licht pink achtergrond
   - Pink checkmark icon verschijnt in rechterbovenhoek
6. Klik op "PlayStation" platform
7. Controleer dat beide platforms geselecteerd zijn:
   - Zowel "Windows" als "PlayStation" hebben pink styling en checkmark
   - Beide platforms blijven geselecteerd

**Gewenst resultaat:**
- Platforms zijn alleen zichtbaar nadat project type is geselecteerd
- Beschikbare platforms komen overeen met gekozen project type
- Geselecteerde platforms krijgen visuele feedback (pink border, achtergrond, checkmark)
- Meerdere platforms kunnen worden geselecteerd

---

### Scenario 6.3: Meerdere platforms selecteren

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Project type "Game" moet geselecteerd zijn

**Testdata:**
- Platforms om te selecteren: Windows, macOS, Web, PlayStation

**Stappen:**
1. Selecteer eerste platform: "Windows"
2. Controleer dat platform wordt geselecteerd (pink styling + checkmark)
3. Selecteer tweede platform: "macOS"
4. Controleer dat beide platforms geselecteerd zijn
5. Selecteer derde platform: "Web"
6. Controleer dat alle drie platforms geselecteerd zijn
7. Selecteer vierde platform: "PlayStation"
8. Controleer dat alle vier platforms geselecteerd zijn
9. Test platform deselecteren:
   - Klik op "Windows" platform opnieuw
   - Controleer dat "Windows" wordt gedeselecteerd (verliest pink styling en checkmark)
   - Controleer dat andere platforms nog steeds geselecteerd zijn
10. Vul rest van project formulier in
11. Klik op submit
12. Controleer dat alle geselecteerde platforms worden opgeslagen

**Gewenst resultaat:**
- Meerdere platforms kunnen worden geselecteerd
- Platforms kunnen worden gedeselecteerd door opnieuw te klikken
- Alle geselecteerde platforms worden opgeslagen bij project aanmaken
- Platforms zijn zichtbaar op project detailpagina

**Alternatief pad 6.3a: Alle platforms selecteren**
- Testdata: Selecteer alle beschikbare platforms voor Game type (9 platforms)
- Gewenst resultaat: Alle platforms kunnen worden geselecteerd

---

### Scenario 6.4: Project type wijzigen

**Voorbereiding:**
- Gebruiker moet ingelogd zijn
- Project type "Game" is geselecteerd
- Minimaal 2 platforms zijn geselecteerd (bijv. Windows, PlayStation)

**Stappen:**
1. Controleer huidige staat:
   - Project type "Game" is geselecteerd
   - Platforms "Windows" en "PlayStation" zijn geselecteerd
   - 9 platforms zijn zichtbaar (alle Game platforms)
2. Wijzig project type: Klik op "app"
3. Controleer dat "App" wordt geselecteerd:
   - "App" krijgt pink styling en checkmark
   - "Game" verliest selectie (grijze border, witte achtergrond)
4. Controleer dat platforms worden gewist:
   - Geen platforms zijn meer geselecteerd
   - "Windows" en "PlayStation" hebben geen pink styling meer
5. Controleer dat nieuwe platforms worden getoond:
   - Alleen 6 platforms zijn zichtbaar (Windows, macOS, Linux, Web, iOS, Android)
   - PlayStation, Xbox, Nintendo zijn niet meer zichtbaar
6. Selecteer nieuwe platforms: "iOS" en "Android"
7. Wijzig opnieuw project type: Klik op "Website"
8. Controleer dat platforms opnieuw worden gewist
9. Controleer dat alleen "Web" platform beschikbaar is

**Gewenst resultaat:**
- Bij wijzigen van project type worden geselecteerde platforms gewist
- Beschikbare platforms worden aangepast aan nieuw project type
- Gebruiker moet platforms opnieuw selecteren na type wijziging
- Geen oude platform selecties blijven behouden

**Alternatief pad 6.4a: Type wijzigen met Website**
- Stappen: Selecteer "Website" type, selecteer "Web", wijzig naar "Game"
- Gewenst resultaat: "Web" selectie wordt gewist, alle Game platforms worden getoond

---

### Scenario 6.5: Validatie - Geen project type

**Voorbereiding:**
- Gebruiker moet ingelogd zijn

**Stappen:**
1. Navigeer naar "Project toevoegen" pagina
2. Vul andere verplichte velden in (naam, beschrijving, GitHub repo)
3. Laat project type leeg (selecteer geen type)
4. Controleer dat Step 2 niet zichtbaar is
5. Controleer dat validatie melding zichtbaar is: "Please select a project type *"
6. Klik op submit knop
7. Controleer dat error melding wordt getoond: "Please fill in all required fields."
8. Controleer dat formulier niet wordt verzonden
9. Selecteer nu een project type
10. Controleer dat validatie melding verdwijnt
11. Selecteer minimaal één platform
12. Klik opnieuw op submit
13. Controleer dat project wordt aangemaakt

**Gewenst resultaat:**
- Validatie melding wordt getoond wanneer geen project type is geselecteerd
- Formulier kan niet worden verzonden zonder project type
- Validatie melding verdwijnt wanneer project type wordt geselecteerd
- Error melding is duidelijk en behulpzaam

---

### Scenario 6.6: Validatie - Geen platforms

**Voorbereiding:**
- Gebruiker moet ingelogd zijn

**Stappen:**
1. Navigeer naar "Project toevoegen" pagina
2. Selecteer project type: "Game"
3. Controleer dat Step 2 zichtbaar is
4. Selecteer GEEN platforms (laat alle platforms ongeSelecteerd)
5. Controleer dat validatie melding zichtbaar is: "Please select at least one platform *"
6. Vul andere verplichte velden in (naam, beschrijving, GitHub repo)
7. Klik op submit knop
8. Controleer dat error melding wordt getoond: "Please fill in all required fields."
9. Controleer dat formulier niet wordt verzonden
10. Selecteer nu één platform (bijv. "Web")
11. Controleer dat validatie melding verdwijnt
12. Klik opnieuw op submit
13. Controleer dat project wordt aangemaakt

**Gewenst resultaat:**
- Validatie melding wordt getoond wanneer geen platforms zijn geselecteerd
- Formulier kan niet worden verzonden zonder minimaal één platform
- Validatie melding verdwijnt wanneer minimaal één platform wordt geselecteerd
- Error melding is duidelijk en behulpzaam
- Submit knop is disabled wanneer validatie faalt (indien geïmplementeerd)

**Alternatief pad 6.6a: Validatie met verschillende project types**
- Testdata: Test validatie voor App type (6 platforms) en Website type (1 platform)
- Gewenst resultaat: Validatie werkt voor alle project types

---

## Testrapport

#### Scenario 6.1: Project type selecteren
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - Alles is voldaan aan de voorwaarden

#### Scenario 6.2: Platforms selecteren na project type
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - Alles is voldaan aan de voorwaarden

#### Scenario 6.3: Meerdere platforms selecteren
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - Alles is voldaan aan de voorwaarden

#### Scenario 6.4: Project type wijzigen
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - Alles is voldaan aan de voorwaarden

#### Scenario 6.5: Validatie - Geen project type
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - Wordt goed uitgevoert, maar de mogelijkheid om een project te creëren is er alleen als alles ingevuld is.

#### Scenario 6.6: Validatie - Geen platforms
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd
- **Opmerkingen:** 
  - Alles is voldaan aan de voorwaarden

### Alternatieve Paden

#### Alternatief pad 6.1a: App selecteren
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 6.1b: Website selecteren
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 6.3a: Alle platforms selecteren
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 6.4a: Type wijzigen met Website
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

#### Alternatief pad 6.6a: Validatie met verschillende project types
- **Status:** ☑ Geslaagd ☐ Gefaald ☐ Niet uitgevoerd

### Conclusie

**Algemene bevindingen:**
- Functionaliteiten werken zoals het hoort.