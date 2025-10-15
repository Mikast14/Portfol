## User Stories – Wicky licky

<table style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr>
      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">US-id</th>
      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Wie</th>
      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Wat</th>
      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Waarom</th>
      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Realistisch?</th>
      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Prioriteit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-01</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als gebruiker</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Wil ik een nieuwe pagina kunnen aanmaken</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Zodat ik mijn kennis kan delen</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Dit is goed haalbaar met een eenvoudige CRUD-flow (formulier + opslag). Binnen de scope van dit project en essentieel voor contentbeheer.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Hoog</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-02</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als pagina-eigenaar</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Wil ik mijn pagina kunnen bewerken (titel, inhoud, afbeelding optioneel)</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Zodat ik fouten kan corrigeren of content kan updaten</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Realistisch en vereist vooral hergebruik van dezelfde formulierlogica en validatie. Technisch eenvoudig.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Hoog</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-03</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als pagina-eigenaar</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Wil ik mijn pagina kunnen verwijderen</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Zodat ik controle houd over mijn content</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Realistisch; implementeren met bevestigingsdialoog en bij voorkeur soft delete/archiveren.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Midden</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-04</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als gebruiker</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Wil ik mijn GitHub-account kunnen koppelen aan de applicatie</td>
      <td style="border: 1px solid #ccc; padding: 6px;">zodat ik mijn repositories kan ophalen en tonen binnen mijn projectpagina’s</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Realistisch maar vergt OAuth-configuratie met de GitHub API. Met standaard SDK's en tokens goed uitvoerbaar binnen de planning.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Midden</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-05</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als schrijver</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Wil ik drafts kunnen opslaan</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Zodat ik later verder kan werken</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Realistisch; kan door een statusveld 'draft' en handmatige opslaan-knop. Autosave kan later.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Laag</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-06</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als gebruiker</td>
      <td style="border: 1px solid #ccc; padding: 6px;">wil ik media kunnen uploaden.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">zodat ik afbeeldingen of video’s kan toevoegen aan mijn pagina’s of projecten.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Realistisch; vraagt opslag (lokaal of cloud), bestandsgrootte- en type-validatie en basiscompressie.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Hoog</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-07</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als gebruiker</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Wil ik de status van mijn GitHub-koppeling kunnen zien</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Zodat ik weet of de verbinding actief is of niet</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Realistisch en eenvoudig zodra US-04 staat; we tonen de verbindingsstatus en foutmeldingen.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Laag</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-08</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als gebruiker</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Wil ik tags aan pagina’s kunnen toevoegen</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Zodat gerelateerde onderwerpen makkelijk te vinden zijn</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Goed haalbaar; tags als aparte tabel en koppel (many-to-many) aan pagina’s.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Hoog</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-09</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als lezer</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Wil ik een tag-overzicht kunnen bekijken</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Zodat ik gerelateerde content kan ontdekken</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Realistisch; bouwt voort op US-08 met een filter- en overzichtspagina.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Hoog</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-10</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als gebruiker</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Wil ik een account kunnen registreren (e-mail/wachtwoord)</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Zodat ik mijn pagina’s kan beheren</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Zeer realistisch; standaard registratie met e-mailvalidatie en wachtwoordhashing (bcrypt/Argon2).</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Hoog</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-11</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als gebruiker</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Wil ik kunnen in- en uitloggen</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Zodat ik mijn eigen omgeving heb</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Realistisch; hoort bij dezelfde authenticatieflow (sessies of JWT) en is snel te implementeren.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Hoog</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-12</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als gebruiker</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Wil ik een overzicht van mijn eigen pagina’s</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Zodat ik snel content kan beheren</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Realistisch; simpele lijstweergave met sorteren en paginatie op de ingelogde gebruiker.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Midden</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-13</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als gebruiker</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Wil ik mijn profiel (naam, avatar) kunnen aanpassen</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Zodat mijn account herkenbaar is</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Realistisch; formulier om naam te wijzigen en optionele avatarupload met validatie.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Laag</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-14</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als lezer</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Wil ik pagina’s kunnen zoeken op titel</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Zodat ik snel vind wat ik zoek</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Realistisch; titelzoekfunctie met tekstindex of LIKE-query, performant bij kleine datasets.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Hoog</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px;">US-15</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Als lezer</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Wil ik pagina’s kunnen zoeken op tags</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Zodat ik gerelateerde onderwerpen vind</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Realistisch; filter op gekoppelde tags (join) en combineerbaar met titelzoekfunctie.</td>
      <td style="border: 1px solid #ccc; padding: 6px;">Midden</td>
    </tr>
  </tbody>
</table>
