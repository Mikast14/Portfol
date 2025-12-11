# User Stories - Portfol Portfolio Platform



## Authenticatie & Accountbeheer

### US-1: Registratie en Inloggen
**Als** gebruiker  
**Wil ik** kunnen inloggen en registreren  
**Zodat** ik mijn profiel kan aanpassen

**Tasks:**
- **Task #34: Inlog en registratie form maken** - Danielo923 - Fabio
  - **Acceptatiecriteria:**
    - Login formulier bevat velden voor e-mailadres en wachtwoord
    - Registratie formulier bevat velden voor e-mailadres, wachtwoord en bevestig wachtwoord
    - Formulieren hebben duidelijke labels en placeholders
    - Formulieren hebben submit knoppen
    - Formulieren zijn responsive en toegankelijk
    - Formulieren tonen validatie errors
- **Task #35: Login credantials worden opgeslagen in de database** - Danielo923 - Fabio
  - **Acceptatiecriteria:**
    - Registratiegegevens worden veilig opgeslagen in de database
    - Wachtwoorden worden gehashed voordat ze worden opgeslagen
    - E-mailadres wordt gevalideerd voordat opslaan
    - Duplicate e-mailadressen worden voorkomen
    - Success melding wordt getoond na succesvolle registratie
- **Task #36: Ingelogd blijfen na dat je Login credantials heb ingevuld** - Danielo923 - Fabio
  - **Acceptatiecriteria:**
    - Na succesvol inloggen wordt een sessie aangemaakt
    - Sessie blijft behouden na pagina refresh
    - Gebruiker wordt doorgestuurd naar dashboard/profiel na inloggen
    - Sessie wordt opgeslagen in cookies/localStorage
    - Sessie verloopt na een bepaalde tijd (bijv. 24 uur)
    - Gebruiker kan uitloggen en sessie wordt verwijderd

**Definition of Done:**
- Code is gereviewed
- Functionaliteit is getest (happy path en error cases)
- UI is responsive en toegankelijk
- Foutafhandeling is geïmplementeerd
- Authenticatie is beveiligd (wachtwoorden worden gehashed)
- Documentatie is bijgewerkt

**Prioriteit:** Hoog  
**Story Points:** 5

---

## Projectbeheer

### US-2: Projecten Aanmaken en Bewerken
**Als** gebruiker  
**Wil ik** projecten kunnen aanmaken en bewerken op de website  
**Zodat** bezoekers mijn projecten actueel kan houden

**Tasks:**
- **Task #37: Een form waar ik mijn info toevoegen voor mijn project** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Formulier bevat alle benodigde velden (titel, beschrijving, technologieën, etc.)
    - Formulier heeft duidelijke labels en validatie
    - Formulier is responsive en gebruiksvriendelijk
    - Formulier toont error messages bij validatiefouten
    - Formulier heeft een submit knop
- **Task #38: Project info wordt opgeslagen in database** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Projectgegevens worden opgeslagen in MongoDB
    - Alle formuliervelden worden correct opgeslagen
    - Project wordt gekoppeld aan de ingelogde gebruiker
    - Timestamps worden automatisch toegevoegd (created_at, updated_at)
    - Success melding wordt getoond na opslaan
- **Task #39: Projecten worden geshowed op de gebruikers pagina** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Gebruiker ziet al zijn projecten op zijn gebruikerspagina
    - Projecten worden getoond in een grid of lijst weergave
    - Elke projectcard toont titel, samenvatting en thumbnail
    - Gebruiker kan klikken op een project om details te bekijken
    - Projecten worden gesorteerd op datum (nieuwste eerst)
- **Task #40: Images worden toegevoegd via file upload** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Gebruiker kan afbeeldingen uploaden via file input
    - Ondersteunde bestandsformaten: JPG, PNG, GIF, WebP
    - Bestandsgrootte limiet wordt gehandhaafd (bijv. max 5MB)
    - Afbeeldingen worden opgeslagen in cloud storage of database
    - Preview van geüploade afbeelding wordt getoond
    - Meerdere afbeeldingen kunnen worden geüpload
- **Task #55: functie om pagina te bewerken** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Gebruiker kan een bestaand project bewerken via een "Bewerken" knop
    - Formulier wordt voorgevuld met bestaande projectgegevens
    - Wijzigingen worden opgeslagen in de database
    - Alleen de eigenaar kan het project bewerken
    - Success melding wordt getoond na opslaan van wijzigingen

**Definition of Done:**
- CRUD operaties werken correct
- Validatie is geïmplementeerd voor alle velden
- Autorisation checks zijn geïmplementeerd
- UI is gebruiksvriendelijk en intuïtief
- Code is gereviewed en getest
- Error handling is geïmplementeerd

**Prioriteit:** Hoog  
**Story Points:** 8

### US-8: Project Pagina Layout
**Als** gebruiker  
**Wil ik** een project pagina layout  
**Zodat** bezoekers projectdetails kunnen bekijken

**Tasks:**
- **Task #68: Project pagin layout maken** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Project detailpagina heeft een duidelijke layout
    - Layout toont project titel, beschrijving en metadata
    - Layout heeft een sectie voor afbeeldingen/media
    - Layout heeft een sectie voor technologieën/tags
    - Layout is responsive en gebruiksvriendelijk
- **Task #69: Project informatie wordt geshowed op de project pagina** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Alle projectgegevens worden opgehaald uit de database
    - Project informatie wordt correct weergegeven op de pagina
    - Auteur informatie wordt getoond
    - Links naar GitHub en live demo zijn klikbaar
    - Datum van aanmaak en laatste wijziging worden getoond

**Definition of Done:**
- Projectpagina is geïmplementeerd en getest
- Design is consistent met de rest van de applicatie
- Pagina is responsive en toegankelijk
- Performance is geoptimaliseerd
- Code is gereviewed

**Prioriteit:** Hoog  
**Story Points:** 5

### US-8A: Mijn Projecten Pagina
**Als** gebruiker  
**Wil ik** een pagina voor mijn projecten  
**Zodat** de gebruiker zijn projecten snel kan vinden

**Definition of Done:**
- Pagina is responsive
- Filtering en sorting werken correct
- Performance is geoptimaliseerd (lazy loading indien nodig)
- Code is gereviewed en getest
- UI is consistent met de rest van de applicatie

**Prioriteit:** Hoog  
**Story Points:** 5

### US-9: Helpers Toevoegen aan Project
**Als** gebruiker  
**Wil ik** helpers kunnen toevoegen aan mijn project  
**Zodat** ik kan aangeven met wie ik heb samengewerkt

**Tasks:**
- **Task #58: Helpers toevoegen aan project form** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Projectformulier heeft een sectie voor helpers
    - Gebruiker kan helpers toevoegen via tekstvelden (naam en rol)
    - Meerdere helpers kunnen worden toegevoegd
    - Helpers kunnen worden verwijderd voordat project wordt opgeslagen
    - Helper informatie wordt gevalideerd
- **Task #59: Helpers showen op project pagina** - mikert - mike
  - **Acceptatiecriteria:**
    - Helper informatie wordt opgehaald uit de database
    - Helpers worden getoond op de project detailpagina
    - Helper informatie toont naam en rol/bijdrage
    - Helpers worden visueel onderscheiden (bijv. met avatars of badges)
    - Helpers sectie is duidelijk zichtbaar op de pagina

**Definition of Done:**
- Functionaliteit is geïmplementeerd en getest
- UI is duidelijk en gebruiksvriendelijk
- Data wordt correct opgeslagen in de database
- Code is gereviewed

**Prioriteit:** Hoog  
**Story Points:** 5

---

## Database & Infrastructuur

### US-3: Database Setup
**Als** developer  
**Wil ik** een database  
**Zodat** we data kunnen opslaan

**Tasks:**
- **Task #32: Mogodb opzeten** - Danielo923 - Fabio, Mikast14 - Mika
  - **Acceptatiecriteria:**
    - MongoDB database is aangemaakt (lokaal of via MongoDB Atlas)
    - Database connectie string is geconfigureerd
    - Environment variables zijn ingesteld voor database credentials
    - Database connectie wordt getest bij applicatie start
    - Error handling is geïmplementeerd voor connectie problemen
- **Task #33: Mongodb linken met de pagina** - Danielo923 - Fabio, Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Database modellen zijn gedefinieerd (User, Project, etc.)
    - CRUD operaties zijn geïmplementeerd voor alle modellen
    - API endpoints zijn gekoppeld aan database operaties
    - Data wordt correct opgehaald en weergegeven op de pagina
    - Database queries zijn geoptimaliseerd met indexen waar nodig

**Definition of Done:**
- Database is operationeel en toegankelijk
- Alle modellen zijn geïmplementeerd
- Connectie is veilig geconfigureerd (environment variables)
- Test data kan worden toegevoegd en opgehaald
- Documentatie is bijgewerkt

**Prioriteit:** Hoog  
**Story Points:** 8

---

## Navigatie & Overzichten

### US-4: Home Page
**Als** lezer  
**Wil ik** een Home page  
**Zodat** ik kan navigeren naar mijn profiel en andermans projecten

**Tasks:**
- **Task #45: Home pagina layout maken** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Home pagina heeft een hero sectie met welkomsttekst
    - Home pagina heeft een sectie voor recente/populaire projecten
    - Layout is responsive en werkt op mobiel, tablet en desktop
    - Design is consistent met de rest van de applicatie
    - Call-to-action knoppen zijn duidelijk zichtbaar
- **Task #46: Navbar maken** - mikert - mike, Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Navbar bevat links naar belangrijke pagina's (Home, Explore, Login, Register)
    - Navbar toont gebruikersnaam en logout knop wanneer ingelogd
    - Navbar is responsive (hamburger menu op mobiel)
    - Navbar is sticky/fixed aan de bovenkant
    - Actieve pagina wordt visueel aangegeven in de navbar

**Definition of Done:**
- Design is consistent met de rest van de applicatie
- Pagina is responsive en toegankelijk
- Performance is geoptimaliseerd
- Code is gereviewed

**Prioriteit:** Hoog  
**Story Points:** 3

### US-5: Explore Page
**Als** lezer  
**Wil ik** een explore page  
**Zodat** ik projecten kan vinden

**Tasks:**
- **Task #70: Explore page design en layout maken** - mikert - mike, Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Explore pagina heeft een duidelijke layout met project grid
    - Filter en sorteer opties zijn zichtbaar en gebruiksvriendelijk
    - Layout is responsive en werkt op alle schermformaten
    - Design is consistent met de rest van de applicatie
    - Loading states worden getoond tijdens data ophalen
- **Task #71: Randome projecten worden geshowed op de explore page** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Alle publieke projecten worden opgehaald uit de database
    - Projecten worden willekeurig of gesorteerd weergegeven
    - Elke projectcard toont alle benodigde informatie
    - Projecten worden geladen met paginering of lazy loading
    - Lege state wordt getoond wanneer er geen projecten zijn

**Definition of Done:**
- Pagina is responsive
- Filtering en sorting werken correct
- Performance is geoptimaliseerd (lazy loading, paginering)
- Code is gereviewed en getest
- UI is gebruiksvriendelijk

**Prioriteit:** Hoog  
**Story Points:** 5

---

## Zoeken & Ontdekken

### US-6: Zoeken op Titel
**Als** lezer  
**Wil ik** pagina's kunnen zoeken op titel  
**Zodat** ik snel vind wat ik zoek

**Tasks:**
- **Task #47: Zoek balk toevoegen navbar** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Zoekbalk is toegevoegd aan de navbar
    - Zoekbalk heeft een duidelijk placeholder tekst
    - Zoekbalk is responsive en zichtbaar op alle schermformaten
    - Zoekbalk heeft een zoek icoon
    - Zoekbalk is toegankelijk via keyboard navigatie
- **Task #48: zoek functie** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Zoekfunctie zoekt door projecttitels in de database
    - Zoeken werkt case-insensitive
    - Zoeken ondersteunt partial matches
    - Zoekresultaten worden getoond in een dropdown of op een aparte pagina
    - Lege zoekresultaten tonen een duidelijke melding
    - Debouncing is geïmplementeerd voor performance
    - Database queries zijn geoptimaliseerd met indexen

**Definition of Done:**
- Zoekfunctionaliteit is geïmplementeerd en getest
- Performance is geoptimaliseerd (debouncing indien nodig)
- UI is gebruiksvriendelijk
- Code is gereviewed
- Database queries zijn geoptimaliseerd (indexen)

**Prioriteit:** Hoog  
**Story Points:** 5

---

## Tags & Categorisering

### US-7: Tags Toevoegen aan Projecten
**Als** gebruiker  
**Wil ik** tags aan een pagina kunnen toevoegen  
**Zodat** gerelateerde programmeertalen makkelijk te vinden zijn

**Tasks:**
- **Task #49: Tags toevoegen** - mikert - mike
  - **Acceptatiecriteria:**
    - Tag model is gedefinieerd in de database
    - Tags kunnen worden aangemaakt en opgeslagen
    - Tags hebben een naam en mogelijk een kleur/stijl
    - Tags worden gevalideerd (geen lege tags, max lengte)
    - Populaire tags worden bijgehouden
- **Task #50: Tags toevoegen aan project form** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Projectformulier heeft een tag selectie veld
    - Gebruiker kan bestaande tags selecteren via dropdown/autocomplete
    - Gebruiker kan nieuwe tags aanmaken tijdens project aanmaken
    - Meerdere tags kunnen worden geselecteerd
    - Geselecteerde tags worden visueel weergegeven als chips/badges
- **Task #51: Tags filter functie toevoegen** - mikert - mike, Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Explore pagina heeft een tag filter sectie
    - Gebruiker kan filteren op één of meerdere tags
    - Gefilterde projecten worden getoond op basis van geselecteerde tags
    - Filter kan worden gereset
    - Actieve filters worden visueel aangegeven

**Definition of Done:**
- Tag functionaliteit is geïmplementeerd en getest
- UI is gebruiksvriendelijk (autocomplete indien mogelijk)
- Database structuur ondersteunt tags efficiënt
- Code is gereviewed
- Performance is geoptimaliseerd

**Prioriteit:** Medium  
**Story Points:** 5

---

## Sociale Functionaliteiten

### US-10: Projecten Bookmarken
**Als** lezer  
**Wil ik** projecten kunnen bookmarken  
**Zodat** ik ze snel terug kan vinden

**Tasks:**
- **Task #64: Bookmark pagina layout maken** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Bookmark pagina heeft een duidelijke layout
    - Layout toont alle gebookmarkte projecten in een grid of lijst
    - Elke projectcard heeft een optie om bookmark te verwijderen
    - Layout is responsive en gebruiksvriendelijk
    - Lege state wordt getoond wanneer er geen bookmarks zijn
- **Task #65: Bookmark functie toevoegen** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Bookmark knop is toegevoegd aan projectpagina's
    - Klikken op bookmark knop voegt project toe aan bookmarks
    - Bookmark status wordt opgeslagen in de database
    - Bookmark status wordt visueel aangegeven (gevulde/lege icon)
    - Gebruiker kan bookmark verwijderen
    - Alleen ingelogde gebruikers kunnen bookmarken

**Definition of Done:**
- Functionaliteit is geïmplementeerd en getest
- UI is duidelijk en intuïtief
- Database model is correct geïmplementeerd
- Code is gereviewed
- Performance is geoptimaliseerd

**Prioriteit:** Medium  
**Story Points:** 3

### US-12: Projecten Liken en Reageren
**Als** lezer  
**Wil ik** projecten van andere kunnen liken en op kunnen reageren  
**Zodat** lezers hun mening kunnen geven

**Tasks:**
- **Task #52: Like functie toevoegen** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Like knop is toegevoegd aan projectpagina's
    - Klikken op like knop voegt like toe of verwijdert like
    - Like wordt opgeslagen in de database
    - Aantal likes wordt getoond en bijgewerkt in real-time
    - Like status wordt visueel aangegeven (gevulde/lege hart icon)
    - Alleen ingelogde gebruikers kunnen liken
- **Task #53: Reactie functie toevoegen** - mikert - mike
  - **Acceptatiecriteria:**
    - Reactie formulier is toegevoegd aan projectpagina's
    - Gebruiker kan een reactie typen en plaatsen
    - Reacties worden getoond onder het project
    - Reacties tonen auteur, datum/tijd en inhoud
    - Gebruiker kan zijn eigen reacties bewerken en verwijderen
    - Alleen ingelogde gebruikers kunnen reageren
- **Task #54: Functies opslaan in database** - mikert - mike, Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Like model is gedefinieerd in de database
    - Comment model is gedefinieerd in de database
    - Likes en comments worden correct opgeslagen
    - Database queries zijn geoptimaliseerd
    - Data wordt correct gekoppeld aan gebruikers en projecten

**Definition of Done:**
- Like en comment functionaliteit is geïmplementeerd
- Database modellen zijn correct geïmplementeerd
- UI is gebruiksvriendelijk
- Real-time updates werken (indien geïmplementeerd)
- Code is gereviewed en getest
- Performance is geoptimaliseerd

**Prioriteit:** Medium  
**Story Points:** 8

---

## Profiel & Instellingen

### US-11: Publiek Profiel Pagina
**Als** gebruiker  
**Wil ik** een pagina waar bezoekers mijn profiel kunnen bekijken  
**Zodat** de bezoeker overview kan hebben van mijn projecten

**Tasks:**
- **Task #89: Profile pagina layout maken** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Profielpagina heeft een duidelijke layout met header sectie
    - Layout toont gebruikersnaam, bio en profielfoto
    - Layout heeft een sectie voor contactinformatie en links
    - Layout heeft een sectie voor projecten grid
    - Layout is responsive en gebruiksvriendelijk
- **Task #90: Profile pagina info showen op pagina** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Gebruikersinformatie wordt opgehaald uit de database
    - Alle publieke projecten van de gebruiker worden getoond
    - GitHub informatie wordt getoond (indien beschikbaar)
    - Skill tree wordt getoond (indien geïmplementeerd)
    - Informatie wordt correct geformatteerd en weergegeven

**Definition of Done:**
- Profielpagina is geïmplementeerd en getest
- Design is consistent met de rest van de applicatie
- Pagina is responsive en toegankelijk
- Performance is geoptimaliseerd
- Code is gereviewed

**Prioriteit:** Hoog  
**Story Points:** 5

### US-16: Settings Page
**Als** gebruiker  
**Wil ik** een settings page  
**Zodat** ik hier info van mij kan veranderen

**Tasks:**
- **Task #97: Setings page layout maken** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Settings pagina heeft een duidelijke layout met secties
    - Layout bevat secties voor profiel, contact, account en privacy
    - Formulieren zijn georganiseerd en gebruiksvriendelijk
    - Layout is responsive en werkt op alle schermformaten
    - Navigatie tussen secties is duidelijk
- **Task #98: Profile image veranderen** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Gebruiker kan een nieuwe profielfoto uploaden
    - Ondersteunde bestandsformaten: JPG, PNG, GIF, WebP
    - Bestandsgrootte limiet wordt gehandhaafd
    - Preview van nieuwe profielfoto wordt getoond
    - Profielfoto wordt opgeslagen en bijgewerkt in de database
- **Task #99: Username veranderen** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Gebruiker kan zijn gebruikersnaam wijzigen
    - Gebruikersnaam wordt gevalideerd (uniek, min/max lengte)
    - Duplicate gebruikersnamen worden voorkomen
    - Wijziging wordt opgeslagen in de database
    - Success melding wordt getoond na wijziging
- **Task #100: wachtwoord reset** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Gebruiker kan zijn wachtwoord wijzigen
    - Huidig wachtwoord moet worden ingevoerd voor verificatie
    - Nieuw wachtwoord moet voldoen aan vereisten (min 8 karakters)
    - Wachtwoord wordt gehashed voordat opslaan
    - Success melding wordt getoond na wijziging
- **Task #101: account deletion** - Mikast14 - Mika
  - **Acceptatiecriteria:**
    - Gebruiker kan zijn account verwijderen
    - Bevestigingsdialoog wordt getoond voordat verwijderen
    - Gebruiker moet wachtwoord invoeren voor bevestiging
    - Account en gerelateerde data worden verwijderd uit de database
    - Gebruiker wordt uitgelogd en doorgestuurd naar home pagina

**Definition of Done:**
- Settings functionaliteit is geïmplementeerd en getest
- Validatie is correct geïmplementeerd
- UI is gebruiksvriendelijk en duidelijk
- Security best practices zijn gevolgd
- Code is gereviewed

**Prioriteit:** Hoog  
**Story Points:** 5

---

## GitHub Integratie

### US-13: GitHub Info en Repository Linken
**Als** gebruiker  
**Wil ik** mijn github info  
**Zodat** ik dat kan zien en mij repository kan linken

**Tasks:**
- **Task #42: Github API linken** - mikert - mike
  - **Acceptatiecriteria:**
    - GitHub API client is geconfigureerd
    - API credentials zijn veilig opgeslagen in environment variables
    - API calls hebben error handling
    - Rate limiting wordt afgehandeld
    - API responses worden gecached waar mogelijk
- **Task #43: Github info laten laden opde pagina** - mikert - mike
  - **Acceptatiecriteria:**
    - GitHub informatie wordt opgehaald wanneer gebruiker zijn username invoert
    - GitHub informatie wordt getoond op het profiel
    - Loading states worden getoond tijdens API calls
    - Error states worden getoond bij API fouten
    - GitHub informatie wordt bijgewerkt wanneer nodig
- **Task #44: Inlog mogelijkheid met github** - Danielo923 - Fabio
  - **Acceptatiecriteria:**
    - GitHub OAuth is geconfigureerd
    - Gebruiker kan inloggen met GitHub account
    - GitHub gebruikersgegevens worden opgehaald en opgeslagen
    - Gebruiker wordt doorgestuurd na succesvolle GitHub login
    - Sessie wordt aangemaakt na GitHub login

**Definition of Done:**
- GitHub integratie is geïmplementeerd
- API calls zijn correct geïmplementeerd met error handling
- UI toont GitHub informatie duidelijk
- Rate limiting is afgehandeld
- Code is gereviewed en getest
- Documentatie is bijgewerkt

**Prioriteit:** Medium  
**Story Points:** 8

---

## Skill Tree

### US-14: Skill Tree
**Als** gebruiker  
**Wil ik** een skill tree  
**Zodat** ik kan zien in welke talen ik goed ben

**Tasks:**
- **Task #61: Skill tree Functie maken** - mikert - mike
  - **Acceptatiecriteria:**
    - Skill tree model is gedefinieerd in de database
    - Gebruiker kan skills toevoegen, bewerken en verwijderen
    - Gebruiker kan vaardigheidsniveau instellen per skill
    - Skill tree data wordt opgeslagen in de database
    - Validatie wordt uitgevoerd voor skill data
- **Task #62: Skill tree showen in profile page** - mikert - mike
  - **Acceptatiecriteria:**
    - Skill tree wordt opgehaald uit de database
    - Skill tree wordt visueel weergegeven op het profiel (progress bars, badges, etc.)
    - Skills worden gesorteerd op vaardigheidsniveau of alfabetisch
    - Skill tree is responsive en zichtbaar op alle schermformaten
    - Skill tree is zichtbaar op het publieke profiel

**Definition of Done:**
- Skill tree functionaliteit is geïmplementeerd
- Visuele weergave is duidelijk en aantrekkelijk
- UI is gebruiksvriendelijk
- Code is gereviewed en getest
- Performance is geoptimaliseerd

**Prioriteit:** Laag  
**Story Points:** 8

---

## Code Upload & Weergave

### US-15: Code Uploaden en Bekijken
**Als** gebruiker  
**Wil ik** code kunnen uploaden  
**Zodat** mensen mijn code kunnen bekijken op de website

**Tasks:**
*Geen tasks - dit is een "won't have" feature voor de huidige sprint*

**Definition of Done:**
- Code upload functionaliteit is geïmplementeerd
- Syntax highlighting werkt correct
- File storage is correct geconfigureerd
- Security checks zijn geïmplementeerd (file type validation, size limits)
- UI is gebruiksvriendelijk
- Code is gereviewed en getest
- Performance is geoptimaliseerd

**Prioriteit:** Laag  
**Story Points:** 13

---

## Admin Functionaliteiten

### US-17: Admin Page
**Als** admin  
**Wil ik** een admin page  
**Zodat** de admins projecten en comments kunnen verwijderen zodat de pagina ethisch is

**Tasks:**
- **Task #109: admin accounts** - Danielo923 - Fabio
  - **Acceptatiecriteria:**
    - Admin rol is toegevoegd aan User model in de database
    - Gebruikers kunnen worden aangewezen als admin
    - Admin rol wordt gecontroleerd bij autorisatie checks
    - Admin rol kan worden toegewezen via database of admin interface
- **Task #110: admin pagina** - Danielo923 - Fabio
  - **Acceptatiecriteria:**
    - Admin pagina is alleen toegankelijk voor gebruikers met admin rol
    - Admin pagina toont overzicht van alle projecten, comments en gebruikers
    - Admin kan projecten verwijderen met bevestigingsdialoog
    - Admin kan comments verwijderen
    - Admin kan gebruikers blokkeren/deblokkeren
    - Autorisation checks zijn correct geïmplementeerd
    - Duidelijke waarschuwingen bij verwijderacties

**Definition of Done:**
- Admin functionaliteit is geïmplementeerd
- Autorisation checks zijn correct geïmplementeerd
- UI is duidelijk en gebruiksvriendelijk
- Security best practices zijn gevolgd
- Code is gereviewed en getest
- Error handling is geïmplementeerd

**Prioriteit:** Medium  
**Story Points:** 8

---
