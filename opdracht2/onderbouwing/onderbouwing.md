# Onderbouwing - Portfol Portfolio Platform



## Security

### Authenticatie en autorisatie

**Keuze: JWT (JSON Web Tokens) voor sessiebeheer**

Het platform gebruikt JWT-tokens voor authenticatie in plaats van traditionele sessie-cookies. Deze keuze is gemaakt omdat:

- **Stateless authenticatie**: JWT-tokens maken de applicatie stateless, wat schaalbaarheid verbetert en server-side sessieopslag overbodig maakt
- **Beveiligde token-opslag**: Tokens worden opgeslagen in `localStorage` aan de client-side en worden automatisch meegestuurd met elke API-request via de Authorization header
- **Token-verificatie**: Elke protected route verifieert de token voordat toegang wordt verleend, zoals geïmplementeerd in `/api/auth/me` en andere protected endpoints
- **Expiration**: Tokens hebben een vervaltijd van 7 dagen, wat een goede balans biedt tussen gebruikersgemak en security

**Relatie met eisen**: Deze keuze voldoet aan de eis "Toegankelijke onboarding en authenticatie (signup / login / logout)" en zorgt ervoor dat gebruikers veilig kunnen inloggen zonder dat sessies op de server bewaard hoeven te worden.

### Wachtwoordbeveiliging

**Keuze: bcryptjs hashing met 10 rounds**

Wachtwoorden worden nooit in plaintext opgeslagen. In plaats daarvan worden ze gehashed met bcryptjs:

- **Hashing**: Wachtwoorden worden gehashed met bcryptjs voordat ze worden opgeslagen in de database (zoals geïmplementeerd in `/api/auth/register`)
- **Salt rounds**: Er worden 10 salt rounds gebruikt, wat een goede balans biedt tussen security en performance
- **Password comparison**: Bij inloggen wordt `bcrypt.compare()` gebruikt om het ingevoerde wachtwoord te vergelijken met de hash, zonder dat het wachtwoord ooit wordt gedecodeerd
- **Password exclusion**: Bij het ophalen van gebruikersdata wordt het password-veld expliciet uitgesloten (`.select("-password")`), zodat het nooit per ongeluk wordt blootgesteld

**Relatie met eisen**: Deze keuze voldoet aan de acceptatiecriteria "Wachtwoorden worden gehashed voordat ze worden opgeslagen" en zorgt ervoor dat zelfs bij een database-lek gebruikerswachtwoorden niet direct bruikbaar zijn.

### Input validatie en sanitization

**Keuze: Server-side validatie en case-insensitive opslag**

Alle gebruikersinput wordt gevalideerd voordat deze wordt verwerkt:

- **Email validatie**: E-mailadressen worden gevalideerd en opgeslagen in lowercase voor consistentie en om duplicate accounts te voorkomen
- **Username validatie**: Gebruikersnamen worden gevalideerd op lengte (minimaal 3, maximaal 30 tekens) en worden getrimd om whitespace te verwijderen
- **Password validatie**: Wachtwoorden moeten minimaal 6 tekens lang zijn
- **Regex escaping**: Bij het controleren op duplicate usernames worden speciale regex-karakters geëscaped om injection-aanvallen te voorkomen
- **Duplicate checks**: Zowel email als username worden gecontroleerd op duplicaten voordat een account wordt aangemaakt

**Relatie met eisen**: Deze keuze voorkomt fouten in de database en beschermt tegen common security vulnerabilities zoals SQL/NoSQL injection en duplicate accounts.

### OAuth integratie

**Keuze: GitHub OAuth als alternatieve authenticatiemethode**

Naast traditionele email/password authenticatie ondersteunt het platform GitHub OAuth:

- **Flexibiliteit**: Gebruikers kunnen kiezen tussen email/password of GitHub login, wat de gebruikerservaring verbetert
- **Beveiliging**: OAuth-gebruikers hebben geen wachtwoord nodig, wat het risico op wachtwoordlekken elimineert
- **Validatie**: Het systeem controleert of een gebruiker een OAuth-account heeft voordat password-based login wordt toegestaan

**Relatie met eisen**: Deze keuze verbetert de toegankelijkheid van de onboarding en biedt gebruikers meer flexibiliteit in hoe ze willen inloggen.

---

## Privacy

### Gegevensbescherming

**Keuze: Minimale data-opslag en expliciete uitsluiting van gevoelige data**

Het platform verzamelt alleen de minimale benodigde gegevens en beschermt deze actief:

- **Minimale data**: Het User-model slaat alleen essentiële gegevens op: email, username, password hash (optioneel), GitHub ID (optioneel), en profileImage
- **Password exclusion**: Bij alle API-responses wordt het password-veld expliciet uitgesloten, zodat het nooit per ongeluk wordt blootgesteld aan de frontend
- **Timestamps**: Automatische timestamps (`createdAt`, `updatedAt`) worden bijgehouden voor audit-doeleinden, maar worden alleen gebruikt voor interne doeleinden

**Relatie met eisen**: Deze keuze zorgt ervoor dat gebruikers controle hebben over hun gegevens en dat alleen de benodigde informatie wordt verzameld en opgeslagen.

### Gebruikerscontrole over content

**Keuze: User ownership en visibility controls**

Gebruikers hebben volledige controle over hun eigen content:

- **Project ownership**: Elk project is gekoppeld aan een `userId`, wat ervoor zorgt dat alleen de eigenaar zijn/haar projecten kan bewerken of verwijderen
- **Visibility settings**: Het Project-model ondersteunt visibility-instellingen (publiek/privé), hoewel dit in de MVP optioneel is
- **Profile control**: Gebruikers kunnen hun eigen profiel bewerken, wat betekent dat ze controle hebben over welke informatie publiekelijk zichtbaar is

**Relatie met eisen**: Deze keuze voldoet aan de eis "Gebruiksvriendelijke bewerking (CRUD) van profiel en projecten" en geeft gebruikers de controle die ze nodig hebben over hun eigen data.

### Publieke vs. private data

**Keuze: Duidelijke scheiding tussen publieke en private informatie**

Het platform maakt een duidelijk onderscheid tussen wat publiekelijk zichtbaar is en wat privé blijft:

- **Publieke profielen**: Gebruikersnamen en profielpagina's zijn publiekelijk toegankelijk, wat nodig is voor de kernfunctionaliteit "Bekijken en ontdekken"
- **Private authenticatie**: Email-adressen zijn niet publiekelijk zichtbaar en worden alleen gebruikt voor authenticatie
- **Project visibility**: Projecten kunnen worden ingesteld als publiek of privé, wat gebruikers controle geeft over welke projecten zichtbaar zijn

**Relatie met eisen**: Deze keuze balanceert de eis "Publiek profiel met projectoverzicht" met de privacybehoeften van gebruikers.

### GitHub integratie en privacy

**Keuze: Opt-in GitHub data synchronisatie met display controls**

Wanneer gebruikers GitHub-repositories koppelen, hebben ze controle over welke GitHub-data wordt getoond:

- **Display settings**: Het `githubDisplaySettings` schema geeft gebruikers controle over welke GitHub-statistieken worden getoond (contributors, stars, forks, language)
- **Opt-in**: GitHub-integratie is optioneel - gebruikers hoeven hun GitHub-account niet te koppelen als ze dat niet willen
- **Data control**: Gebruikers kunnen kiezen om bepaalde GitHub-data te verbergen, zelfs als de repository is gekoppeld

**Relatie met eisen**: Deze keuze geeft gebruikers controle over hun GitHub-data en respecteert hun privacyvoorkeuren, terwijl het platform nog steeds de functionaliteit biedt om GitHub-projecten te tonen.

---

## Ethiek

### Transparantie in samenwerking

**Keuze: Expliciete credits en collaborator-attributie**

Het platform maakt samenwerkingen transparant en geeft credit waar credit toekomt:

- **Collaborator credits**: Projecten kunnen samenwerkers tonen, wat ervoor zorgt dat alle betrokkenen worden erkend voor hun bijdrage
- **Transparantie**: Bezoekers kunnen zien met wie is samengewerkt aan een project, wat de integriteit van het portfolio-platform versterkt
- **Fair attribution**: Door samenwerkingen expliciet te maken, voorkomt het platform dat individuen credit claimen voor teamwerk

**Relatie met eisen**: Deze keuze voldoet direct aan de eis "Op iedere projectpagina is zichtbaar met welke teamleden is samengewerkt, zodat de bijdrage en rollen van betrokkenen duidelijk zijn" en bevordert ethisch gedrag door transparantie.

### Gebruikersautonomie

**Keuze: Volledige controle over eigen content**

Gebruikers hebben volledige controle over hun eigen content en kunnen deze beheren zoals zij willen:

- **CRUD-operaties**: Gebruikers kunnen hun projecten aanmaken, bewerken en verwijderen zonder externe goedkeuring
- **Content ownership**: Het systeem respecteert dat gebruikers de eigenaar zijn van hun eigen content
- **Geen censuur**: Het platform censureert geen content, behalve wat technisch nodig is voor security (bijv. input sanitization)

**Relatie met eisen**: Deze keuze voldoet aan de eis "Gebruiksvriendelijke bewerking (CRUD) van profiel en projecten" en geeft gebruikers de autonomie die ze nodig hebben om hun portfolio te beheren.

### Toegankelijkheid en inclusiviteit

**Keuze: Responsive design en toegankelijke authenticatie**

Het platform is ontworpen om toegankelijk te zijn voor alle gebruikers:

- **Responsive design**: Het platform is volledig bruikbaar op mobiel, tablet en desktop, wat ervoor zorgt dat gebruikers ongeacht hun apparaat toegang hebben
- **Multiple authenticatie-opties**: Door zowel email/password als GitHub OAuth aan te bieden, wordt het platform toegankelijk voor gebruikers met verschillende voorkeuren en mogelijkheden
- **Duidelijke foutmeldingen**: Validatiefouten worden duidelijk gecommuniceerd in het Nederlands, wat de gebruikerservaring verbetert voor Nederlandse gebruikers

**Relatie met eisen**: Deze keuze voldoet aan de eis "Heldere, snelle UI met focus op leesbaarheid en mobiel gebruik" en "Responsive design" en zorgt ervoor dat het platform inclusief is voor alle gebruikers.

### Eerlijke representatie

**Keuze: Authentieke projectrepresentatie**

Het platform moedigt gebruikers aan om hun werk authentiek te representeren:

- **GitHub-integratie**: Door GitHub-repositories te koppelen, kunnen gebruikers hun code direct linken, wat authenticiteit versterkt
- **Project details**: Het platform vraagt om uitgebreide beschrijvingen en gebruikte technologieën, wat gebruikers aanmoedigt om hun werk volledig te documenteren
- **Geen misleidende informatie**: Door duidelijke structuur en validatie wordt voorkomen dat gebruikers misleidende informatie kunnen plaatsen

**Relatie met eisen**: Deze keuze ondersteunt de waarde "developers presenteren hun werk professioneel" en zorgt ervoor dat het platform een betrouwbare bron is voor het ontdekken van makers en projecten.

---

## Conclusie

De gemaakte ontwerpkeuzes voor het Portfol platform zijn gebaseerd op een zorgvuldige afweging tussen functionaliteit, gebruikerservaring, security, privacy en ethiek. Door gebruik te maken van moderne security-praktijken (JWT, bcrypt hashing, input validatie), privacy-respecterende data-opslag en ethische principes (transparantie, gebruikersautonomie, toegankelijkheid), voldoet het platform aan de gestelde eisen en wensen terwijl het gebruikers een veilige en ethische omgeving biedt om hun portfolio te presenteren.

De keuzes zijn consistent geïmplementeerd in de codebase en zijn gebaseerd op best practices binnen de web development community, wat zorgt voor een robuust en onderhoudbaar platform.
