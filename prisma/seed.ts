import { PrismaClient, TypeUtilisateur, StatutPaiement } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Création des utilisateurs
    const generateMdp = await bcrypt.hash('admin123', 10);
    const utilisateur1 = await prisma.utilisateur.create({
        data: {
            nom: 'David Yates',
            email: 'd.yates@babelweb.com',
            mot_de_passe: generateMdp,
            type: TypeUtilisateur.INFLUENCEUR,
            influenceur: {
                create: {
                    nombre_abonnes: 10000,
                    taux_engagement: 5.2,
                    niche: 'Fitness',
                    lien_reseaux_sociaux: 'http://instagram.com/johndoe',
                },
            },
        },
        include: {
            influenceur: true,
        },
    });

    const utilisateur2 = await prisma.utilisateur.create({
        data: {
            nom: 'Amine Tijani',
            email: 'a.tijani@babelweb.com',
            mot_de_passe: generateMdp,
            type: TypeUtilisateur.MARQUE,
            marque: {
                create: {
                    nom_entreprise: 'SuperBrand',
                    description: 'Top quality products',
                    secteur_activite: 'E-commerce',
                    lien_site_web: 'http://superbrand.com',
                },
            },
        },
        include: {
            marque: true,
        },
    });

    if (!utilisateur1.influenceur || !utilisateur2.marque) {
        throw new Error('Failed to create influenceur or marque');
    }

    // Création d'un partenariat
    const partenariat = await prisma.partenariat.create({
        data: {
            id_marque: utilisateur2.marque.id,
            id_influenceur: utilisateur1.influenceur.id,
            date_debut: new Date(),
            date_fin: new Date(new Date().setMonth(new Date().getMonth() + 6)),
            conditions: 'Post 3 photos per week',
        },
    });

    // Création d'une campagne
    const campagne = await prisma.campagne.create({
        data: {
            id_partenariat: partenariat.id,
            nom: 'Summer Campaign',
            description: 'Promote our summer collection',
            budget: 10000,
            date_debut: new Date(),
            date_fin: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        },
    });

    // Création de contenu sponsorisé
    await prisma.contenuSponsorise.create({
        data: {
            id_campagne: campagne.id,
            type: 'image',
            contenu: 'A great photo of our summer collection',
            lien: 'http://instagram.com/p/summer-photo',
        },
    });

    // Création d'un paiement
    await prisma.paiement.create({
        data: {
            id_partenariat: partenariat.id,
            montant: 5000,
            date_paiement: new Date(),
            statut: StatutPaiement.VALIDE,
        },
    });

    // Création de statistiques
    await prisma.statistique.create({
        data: {
            id_utilisateur: utilisateur1.id,
            nombre_publications: 10,
            nombre_abonnes: 10500,
            taux_engagement: 5.4,
            date_statistique: new Date(),
        },
    });

    // Création de messages
    await prisma.message.create({
        data: {
            id_expediteur: utilisateur1.id,
            id_destinataire: utilisateur2.id,
            contenu: 'Hello, let’s collaborate!',
            date_envoi: new Date(),
        },
    });

    await prisma.message.create({
        data: {
            id_expediteur: utilisateur2.id,
            id_destinataire: utilisateur1.id,
            contenu: 'Sure, we are interested!',
            date_envoi: new Date(),
        },
    });

    console.log('Seed data created successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
