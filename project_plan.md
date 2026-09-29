# Site Web Officiel Musicienne

## 1. Description du Projet
Site vitrine élégant pour une musicienne professionnelle. Présentation artistique avec sections dédiées à la biographie, la musique, la galerie photos, les dates de concerts, un formulaire de contact, une boutique de musique numérique avec panier et paiement Stripe.

## 2. Structure des Pages
- `/` - Page principale (one-page avec sections)
  - `#home` - Hero / Accueil
  - `#about` - À Propos
  - `#music` - Musique (lecteur audio)
  - `#gallery` - Galerie Photos
  - `#events` - Événements / Tournée
  - `#shop` - Boutique (produits Supabase + panier)
  - `#contact` - Contact
- `/checkout` - Page de paiement avec formulaire
- `/checkout/success` - Confirmation de paiement
- `/checkout/cancel` - Paiement annulé

## 3. Fonctionnalités Principales
- [x] Navigation sticky avec liens d'ancrage
- [x] Section Hero plein écran avec photo artistique
- [x] Biographie avec compétences/instruments
- [x] Lecteur audio avec playlist
- [x] Galerie photos style masonry avec lightbox
- [x] Liste des dates de concerts
- [x] Formulaire de contact (Readdy Form)
- [x] Footer avec liens sociaux
- [x] Animations au scroll
- [x] Design responsive
- [x] Boutique avec 3 produits numériques (Supabase)
- [x] Panier avec localStorage
- [x] Paiement Stripe (Edge Function)
- [x] Page checkout avec formulaire client

## 4. Modèle de Données
- **Supabase**:
  - `product_items` — Produits musique (Meli, Kelobouatom, Bundle)
  - `order_headers` + `order_items` — Commandes clients
  - `create-stripe-checkout` Edge Function — Création session Stripe

## 5. Intégrations Tierces
- Supabase: Auth, Database, Edge Functions
- Stripe: Paiement sécurisé (connecté)
- Shopify: Non requis
- Formulaire de contact

## 6. Plan de Développement

### Phase 1: Site complet
- Objectif: Construire le site vitrine complet
- Livrable: Site one-page avec toutes les sections

### Phase 3: Compte client + Auth
- Objectif: Permettre aux fans de créer un compte et d'accéder à leurs achats
- Livrable: Pages login/inscription, dashboard client avec historique et téléchargements
- Status: ✅ Terminé

### Phase 4: Bouton musique écoute / lecture dans la Navbar
- Objectif: Petit bouton "play" dans la navbar pour écouter un extrait
- Livrable: Widget audio intégré à la navigation