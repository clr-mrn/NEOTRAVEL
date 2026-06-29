# NeoTravel — Automatisation du cycle commercial

Prototype d'automatisation du parcours commercial de **NeoTravel** (PME d'intermédiation en transport de groupe) : de la captation d'un prospect jusqu'au pilotage, en passant par la qualification, le devis, l'envoi et les relances.

> Principe directeur, non négociable : **le LLM décide, le code calcule.** L'agent comprend la demande et oriente ; le prix, lui, est toujours produit par une fonction déterministe `calculer_devis()`, jamais par le raisonnement du modèle.

Cas d'étude MBA1 — Équipe : Amin · Louanne · Quentin · Clara.

---

## Sommaire

- [Ce que fait le projet](#ce-que-fait-le-projet)
- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation et lancement](#installation-et-lancement)
- [Variables d'environnement](#variables-denvironnement)
- [Structure du projet](#structure-du-projet)
- [Le moteur de pricing — `calculer_devis()`](#le-moteur-de-pricing--calculer_devis)
- [Prompt système de l'agent](#prompt-système-de-lagent)
- [Garde-fous](#garde-fous)
- [Déploiement](#déploiement)
- [Scripts npm](#scripts-npm)

---

## Ce que fait le projet

La solution couvre toute la chaîne commerciale :

1. **Capter** un prospect via une landing conversationnelle.
2. **Qualifier** la demande et détecter les informations manquantes.
3. **Tarifer** avec un moteur de règles déterministe.
4. **Générer** un devis (PDF) et l'envoyer.
5. **Relancer** automatiquement les devis sans réponse.
6. **Suivre** le pipeline et **piloter** via un dashboard.

Les cas complexes ou les demandes urgentes sont escaladés à un humain plutôt que traités automatiquement.

---

## Architecture

Version livrée **hybride** : l'agent conversationnel vit dans le code Next.js (route `/api/chat`), tandis que le calcul du prix et les relances sont exécutés dans **n8n**. L'agent appelle le workflow n8n pour obtenir un prix.

```
Prospect → Landing Next.js (chat) → Agent (route /api/chat + LLM)
   → lookup des règles (Airtable)
   → calculer_devis()      [nœud Code n8n, déterministe]
   → génération du devis (PDF)
   → écriture CRM (Airtable)
   → planification de la relance (n8n)
→ Dashboard direction
```

| Brique | Où ça vit | Rôle |
|---|---|---|
| Interface prospect | Front Next.js (Vercel) | Landing conversationnelle, UI de chat |
| Agent / orchestration | `app/api/chat/route.ts` | Mène la conversation, choisit les outils, met en forme |
| Calcul du prix | n8n (nœud Code) | `calculer_devis()` déterministe |
| Données (CRM) | Airtable | Demandes, Matrices, Devis, Relances, Clients, Logs |
| Relances + email | n8n | Séquence J+3 / J+7, envoi via nœud email/SMTP |
| Génération devis PDF | `app/devis/` | Devis formaté envoyé au prospect |
| Pilotage | Dashboard direction | KPIs commerciaux |

---

## Stack technique

- **Front** : Next.js / TypeScript, déployé sur Vercel
- **Agent** : route API `/api/chat` + modèle LLM (conversation, qualification, mise en forme)
- **Moteur de pricing** : nœud Code dans n8n (`calculer_devis()`)
- **Données / CRM** : Airtable
- **Automatisations & emails** : n8n (relances planifiées, envoi email/SMTP)
- **Pilotage** : dashboard direction

---

## Prérequis

- **Node.js** ≥ 18 et **npm**
- Un accès **Airtable** (base de données)
- Une instance **n8n** (locale avec tunnel, ou hébergée)
- Une **clé d'API du modèle LLM**

---

## Installation et lancement

```bash
# 1. Cloner le dépôt
git clone https://github.com/clr-mrn/NEOTRAVEL.git
cd NEOTRAVEL

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.local.example .env.local
# puis renseigner les valeurs (voir section ci-dessous)

# 4. Lancer en développement
npm run dev
# Ouvrir http://localhost:3000

# 5. Lancer l'app en ligne
# suivre ce lien :
https://neotravel-delta.vercel.app/

# 6. n8n
# il est possible d'importer le fichier NEOTRAVEL.json sur n8n pour pouvoir visiualiser son contenu
# créer un nouveau workflow et importer le fichier json
```
````
# Accèder à la base de données :

https://airtable.com/appxDxTahkMM34ibQ/shrs03emMttaf6s89

# Accèder au tableau de bord :
# Devis :
https://airtable.com/appxDxTahkMM34ibQ/pagTbmwiK160yK3Ba
# Relance :
https://airtable.com/appxDxTahkMM34ibQ/shrs03emMttaf6s89

````

---

## Variables d'environnement

À définir dans `.env.local` (ne jamais committer ce fichier). Le fichier `.env.local.example` sert de modèle.

| Variable | Description |
|---|---|
| `LLM_API_KEY` | Clé d'API du modèle utilisé par l'agent (route `/api/chat`) |
| `N8N_WEBHOOK_URL` | URL du webhook n8n appelé pour le calcul du prix et les relances |
| `AIRTABLE_API_KEY` | Clé d'API Airtable (si le front lit/écrit directement la base) |
| `AIRTABLE_BASE_ID` | Identifiant de la base Airtable |

> Reporter aussi ces variables dans **Vercel → Project Settings → Environment Variables** pour la production (elles ne proviennent pas du `.env.local`).

---

## Structure du projet

```
NEOTRAVEL/
├── app/
│   ├── api/
│   │   └── chat/route.ts     # endpoint de l'agent (conversation + appels d'outils)
│   ├── devis/                # génération / affichage du devis
│   ├── page.tsx              # landing conversationnelle
│   ├── layout.tsx
│   └── globals.css
├── public/                   # assets statiques
├── .env.local.example        # variables d'environnement (modèle)
├── package.json
└── README.md
```

> Le moteur de pricing `calculer_devis()` **n'est pas dans ce dépôt** : il est implémenté dans un nœud Code du workflow n8n.

---

## Le moteur de pricing — `calculer_devis()`

Cœur fiable du système, **déterministe et auditable**, exécuté dans un nœud Code n8n. Il n'appelle jamais le LLM.

**Contrat**

```
Entrée : { nb_passagers, date_depart, date_demande, distance_km, type_vehicule, options[] }
Sortie : { prix_ht, tva, prix_ttc, lignes:[{libelle, montant}], coefficients:[...], devise:"EUR" }
```

**Coefficients appliqués**

- **Saisonnalité** : Basse (Nov, Jan, Fév, Août) −7 % · Moyenne (Déc, Oct, Sep) 0 % · Haute (Mars, Avril, Juil) +10 % · Très haute (Mai, Juin) +15 %
- **Anticipation** (date demande vs départ) : Prioritaire +10 % · Urgent +5 % · Normal −5 % · 3 mois et plus −10 %
- **Capacité** : ≤19 −5 % · 20–53 0 % · 54–63 +15 % · 64–67 +20 % · 68–85 +40 %
- **Options** : Guide +80 €/jour · Nuit chauffeur +120 €/nuit · Péages forfait selon trajet
- **TVA** 10 % · **Marge commerciale** +15 % appliquée avant envoi

**Tests** : cas types **et** cas limites (0 passager, dépassement de capacité, dates incohérentes, hors zone, urgence). Toute modification d'un coefficient doit être suivie d'un passage du jeu de tests.

---

## Prompt système de l'agent

Le prompt système ci-dessous cadre le rôle, les règles et les garde-fous de l'agent. Il doit rester aligné avec la version réellement déployée dans `app/api/chat/route.ts`.

```text
Tu es l'assistant commercial de NeoTravel.

Tu dois TOUJOURS répondre avec un JSON valide, sans texte avant ni après.

Format obligatoire à chaque réponse :

{
"reply": "message affiché au client",
"data_devis": null
}

ou, quand la demande est complète :

{
"reply": "message affiché au client avec récapitulatif final",
"data_devis": {
"status": "complet",
"consentement_contact": true,
"client_nom": "...",
"client_email": "...",
"client_telephone": "...",
"depart": "...",
"destination": "...",
"date_depart": "AAAA-MM-JJ",
"date_retour": "AAAA-MM-JJ",
"nb_passagers": 0,
"options": []
}
}

RÈGLE 1 — Consentement obligatoire

Avant toute collecte d'information personnelle ou de trajet, demande obligatoirement :

"Avant de commencer, acceptez-vous d'être recontacté concernant votre demande afin de recevoir votre devis ? Répondez par oui ou non."

Si l'utilisateur n'a pas encore répondu oui ou non au consentement, ne traite aucune autre information.

Si l'utilisateur répond non :

{
"reply": "Je comprends. Sans accord pour être recontacté, nous ne pourrons pas donner suite à votre demande ni vous transmettre de devis.",
"data_devis": {
"status": "refus_consentement",
"consentement_contact": false
}
}

Si l'utilisateur répond oui, poursuis la collecte.

RÈGLE 2 — Informations obligatoires après consentement

Après consentement accepté, collecte :

1. Nom du client
2. Adresse mail
3. Numéro de téléphone
4. Ville de départ
5. Ville de destination
6. Date de départ
7. Date de retour
8. Nombre de passagers
9. Options : guide, nuit_chauffeur, péages

Toutes ces informations sont obligatoires.

RÈGLE 3 — Ne pas redemander

Tiens compte de tout l'historique.
Ne redemande jamais une information déjà fournie.
Si l'utilisateur donne plusieurs informations dans un même message, enregistre-les toutes.

RÈGLE 4 — Une seule question

Tant qu'il manque une information, `reply` contient uniquement la prochaine question à poser.
`data_devis` reste null.

RÈGLE 5 — Coordonnées

Quand nom + email + téléphone sont connus, fais un court récapitulatif dans `reply`, puis pose la prochaine question métier.

RÈGLE 6 — Options

Quand tu demandes les options, demande :

"Souhaitez-vous ajouter une option : guide, nuit chauffeur ou péages ? Vous pouvez aussi répondre aucune."

Si l'utilisateur répond "aucune" : options = [].
Si l'utilisateur répond "oui tout" ou "tout" : options = ["guide", "nuit_chauffeur", "péages"].
Si l'utilisateur cite une ou plusieurs options, mets uniquement celles citées dans le tableau.

RÈGLE 7 — Finalisation immédiate

Dès que toutes les informations obligatoires sont connues, réponds immédiatement avec le JSON complet.

Le champ `reply` doit contenir le récapitulatif final complet, par exemple :

"Merci, j'ai toutes les informations nécessaires. Voici le récapitulatif de votre demande :

* Nom : ...
* Email : ...
* Téléphone : ...
* Ville de départ : ...
* Ville de destination : ...
* Date de départ : ...
* Date de retour : ...
* Nombre de passagers : ...
* Options souhaitées : ...

Je prépare maintenant votre demande de devis."

Le champ `data_devis` doit contenir toutes les données structurées.

N'attends jamais un message supplémentaire après la réponse aux options.

### Extraction automatique des informations

Lorsque l'utilisateur fournit une information claire, considère-la comme valide immédiatement.

Ne demande jamais une confirmation si l'information est explicite.

Par exemple :

Utilisateur :
"Paris à Marseille du 24 juillet 2026 au 30 juillet 2026, nous sommes 45."

Tu dois enregistrer immédiatement :

- départ = Paris
- destination = Marseille
- date_depart = 2026-07-24
- date_retour = 2026-07-30
- nb_passagers = 45

Puis passer directement à la prochaine information manquante.

Tu ne dois jamais répondre :

- "Pouvez-vous confirmer ?"
- "Est-ce bien le 24 juillet ?"
- "Merci pour la précision."
- "Veuillez confirmer."

Les informations données clairement par l'utilisateur sont considérées comme définitives.
Ne demande jamais deux fois la même information.

Avant chaque réponse, vérifie mentalement la liste des informations déjà connues.

Si une information est présente dans l'historique, elle est considérée comme acquise.
```

---

## Garde-fous

- **Déterminisme** : le prix est calculé par `calculer_devis()`, jamais par le LLM ; température basse pour l'extraction des paramètres.
- **Ancrage** : réponses fondées sur les données Airtable (lookup) ; règle « pas de source, pas de réponse ».
- **Sorties structurées** : extraction des paramètres validée contre un schéma avant tout appel d'outil.
- **Human-in-the-loop** : escalade vers un humain pour les cas sensibles (urgence, montant, faible certitude).
- **RGPD** : minimisation des données, anonymisation des logs et jeux de test, données fictives en démo.
- **Prompt injection** : le prix ne dépend jamais d'une phrase de l'utilisateur ; séparation données/instructions ; moindre privilège des outils.
- **Idempotence** : clé stable + dedupe gate côté n8n pour éviter relances/devis en double.

---

## Déploiement

- **Front** : déploiement automatique sur **Vercel** à chaque push sur `main`. Penser à renseigner les variables d'environnement côté Vercel.
- **Automatisations** : workflow **n8n** (calcul, relances, emails). En démo, un tunnel local suffit ; en continu, l'héberger (n8n Cloud ou VPS).

---

## Scripts npm

```bash
npm run dev      # serveur de développement (http://localhost:3000)
npm run build    # build de production
npm run start    # lance le build de production
npm run lint     # vérification du code
```

---

*Projet pédagogique — automatisation du cycle commercial de NeoTravel.*

---

## Fonctionnalités

NeoTravel automatise l'ensemble du cycle commercial d'une demande de transport de groupe.

### Assistant conversationnel

- Collecte des informations nécessaires au devis
- Compréhension du langage naturel
- Mémoire de la conversation
- Détection des informations manquantes
- Qualification automatique des demandes

### Génération de devis

- Calcul déterministe du prix
- Génération d'un devis PDF
- Envoi automatique par email
- Mise en forme aux couleurs de NeoTravel

### CRM

- Création automatique des clients
- Historisation des demandes
- Suivi du statut des devis
- Journalisation des actions

### Automatisation

- Relances automatiques J+3 et J+7
- Détection des demandes complexes
- Escalade vers un conseiller
- Tableau de bord commercial

---

## Base Airtable

Le CRM repose sur plusieurs tables.

| Table | Description |
|--------|-------------|
| Clients | Informations des prospects |
| Demandes | Historique des demandes |
| Devis | Devis générés |
| Matrices | Paramètres de calcul du prix |
| Relances | Suivi des relances automatiques |
| Logs | Journal des traitements |

---

## Workflows n8n

Les automatisations sont orchestrées dans n8n.

### Qualification

- Réception des informations
- Vérification de la complétude
- Création ou mise à jour du client

### Pricing

- Lecture des matrices tarifaires
- Exécution de `calculer_devis()`
- Calcul du montant HT
- Calcul de la TVA
- Génération du total TTC

### Génération du devis

- Construction du HTML
- Génération du PDF
- Envoi par email

### Relances

- Création de la relance
- Vérification des réponses
- Envoi automatique J+3
- Envoi automatique J+7
- Clôture de la demande

---

## Philosophie

NeoTravel repose sur un principe simple :

> **Le LLM décide. Le code calcule.**

Le modèle d'intelligence artificielle est uniquement responsable de :

- comprendre les demandes du prospect ;
- conduire la conversation ;
- identifier les informations manquantes ;
- produire des réponses naturelles.

En revanche, le calcul du prix est exclusivement réalisé par une fonction déterministe (`calculer_devis()`).

Cette séparation garantit :

- la fiabilité des devis ;
- la reproductibilité des calculs ;
- l'auditabilité des règles tarifaires.

---

## Limites du prototype

Le prototype présenté dans le cadre du MBA possède plusieurs limites :

- disponibilité des transporteurs non vérifiée en temps réel ;
- calcul basé sur une matrice tarifaire simplifiée ;
- paiement en ligne non implémenté ;
- signature électronique non intégrée.

Les demandes complexes (plus de 85 passagers, cas particuliers, demandes urgentes) sont automatiquement transférées à un conseiller.

---

## Perspectives d'évolution

Les évolutions envisagées sont notamment :

- connexion avec les API des transporteurs ;
- disponibilité des véhicules en temps réel ;
- signature électronique des devis ;
- paiement en ligne ;
- espace client ;
- optimisation automatique des tournées ;
- recommandations de transporteurs assistées par IA ;
- tableau de bord décisionnel enrichi.

---

## Équipe

Projet réalisé dans le cadre du MBA1.

- Louanne
- Amin
- Clara
- Quentin

---

## Licence

Projet réalisé dans un cadre pédagogique.

Tous droits réservés © NeoTravel.
