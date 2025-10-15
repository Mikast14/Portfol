## Algemene informatie over het project

- **Naam opdrachtgever**: Ties Noordhuis  
- **Teamleden**: Fabio, Mika, Mike  
- **Uitstroomprofiel**: Frontend  
- **Naam project**: Portfol – Portfolio platform voor frontend developers

---

## Introductie

Portfol is een gebruiksvriendelijk portfolio‑platform waar frontend developers een account kunnen aanmaken en hun eigen pagina’s en projecten kunnen tonen. Gebruikers kunnen elkaars profielen en projectpagina’s bekijken en hun eigen content eenvoudig bewerken. Op iedere projectpagina is zichtbaar met welke teamleden is samengewerkt, zodat de bijdrage en rollen van betrokkenen duidelijk zijn.

---

## Projectdoel

- **MVP realiseren** met focus op:
  - Toegankelijke onboarding en authenticatie (signup / login / logout).
  - Persoonlijke profielpagina met overzicht van projecten.
  - Projectpagina’s met titel, beschrijving, media/links, gebruikte technologieën en samenwerkers.
  - Gebruiksvriendelijke bewerking (CRUD) van profiel en projecten.
  - Heldere, snelle UI met focus op leesbaarheid en mobiel gebruik.
- **Waarde**: developers presenteren hun werk professioneel, bezoekers ontdekken makers en projecten, en samenwerkingen worden transparant weergegeven.

---

## Kernfunctionaliteiten (MVP)

1. **Accounts en profielen**
   - Aanmelden/inloggen/uitloggen.
   - Publiek profiel met bio, contact/link(s) en lijst van projecten.

2. **Projectpagina’s beheren**
   - Projecten aanmaken, bewerken en verwijderen (CRUD).
   - Structuur: titel, korte samenvatting, uitgebreide beschrijving, gebruikte tools/stack, visuals/links (bijv. GitHub, live demo).
   - Instellen van zichtbaarheid: publiek (standaard) of verborgen (optioneel MVP).

3. **Samenwerking tonen**
   - Op een project duidelijk aangeven met wie is samengewerkt (naam, rol).  
   - Mogelijkheid om teamleden te koppelen of vrij tekstveld voor credits (MVP: eenvoudig credits‑veld).

4. **Bekijken en ontdekken**
   - Bezoekers kunnen profielen en projecten van anderen bekijken.
   - Overzichten in lijst of grid, met basisfilters (bijv. technologie of tag – optioneel voor MVP).

5. **Zoeken en navigatie**
   - Zoeken op projecttitel of gebruikersnaam.
   - Eenvoudige navigatie (top‑nav, breadcrumbs of sidebar).

6. **Responsive design**
   - Volledig bruikbaar op mobiel, tablet en desktop.

---

## Optioneel / Stretch

- Reacties/likes op projecten.
- Uitgebreide tagging en filters (tags, stack, rol).
- Collaborator‑koppeling met gebruikersaccounts (selecteren i.p.v. tekstveld).
- Versiegeschiedenis of changelog per project.
- Publiek/privé per profiel of per project met deelbare link.

---

## De gebruikte technieken

- **Frontend**
  - React met Vite.
  - Eenvoudig state‑beheer (React Context of state hooks).
  - Styling: plain CSS, Bootstrap of lichte UI‑libs (geen zware component frameworks).
  - Focus op toegankelijkheid, duidelijkheid en performance.

- **Backend / Database**
  - MongoDB Atlas of Firebase Firestore.
  - Data‑modellen (indicatief):
    - **Users**: profiel, contact/links, aangemaakte projecten.
    - **Projects**: title, summary, description, media/links, stack, collaborators, owner, visibility, timestamps.

- **Hosting & Deployment**
  - Frontend op Netlify, Vercel, GitHub Pages of VPS.
  - Cloud database met online connectie (geen lokale DB).
  - Heldere documentatie voor setup en deployment in `README`.

---

## UX‑accenten

- Schone lay‑out en typografie gericht op portfolio‑presentatie.
- Eenvoudige, veilige bewerkingsflows (duidelijke knoppen, bevestiging bij verwijderen).
- Snelle laadtijden, prettige transities, focus states en toetsenbordnavigatie.
- Consistente visuele taal voor projecten, tags/stack en samenwerkers.

---

## SCRUM en samenwerking

- **Sprints**: wekelijks (2 week).
- **Rituelen**: daily stand‑ups, sprint reviews en zichtbare documentatie.
- **Tracking**: GitHub Projects voor voortgang.
- **Stakeholder‑updates**: resultaten, volgende stappen en blockers per sprint.

---

## Personas (indicatief)

- **Starter – Frontend student**  
  Wil zijn/haar eerste projecten tonen om stage/werk te vinden.

- **Maker – Indie developer**  
  Wil meerdere projecten tonen met duidelijke stack en credits voor teamleden.

- **Recruiter/Bezoeker**  
  Wil snel profielen en projecten scannen en contact leggen.

---

## Opleveringen

- **Must‑haves (MVP)**
  - Accountregistratie en inloggen.
  - Publiek profiel met projectoverzicht.
  - Projecten aanmaken/bewerken/bekijken (met credits/samenwerkers).
  - Zoeken en eenvoudige overzichten.
  - Responsive UI.
  - Live deployment + duidelijke `README` met setup/deploy.

- **Nice‑to‑haves**
  - Reacties/likes.
  - Uitgebreide tags/filters.
  - Collaborator‑selectie op basis van accounts.
  - Versiegeschiedenis.

---

## Conclusie

Portfol helpt frontend developers hun werk professioneel te presenteren, samenwerkingen zichtbaar te maken en ontdekt te worden door anderen. Het MVP richt zich op een soepele schrijf‑ en bladerervaring, duidelijke projectstructuur en snelle, toegankelijke presentatie van projecten en profielen.
