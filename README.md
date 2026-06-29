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
