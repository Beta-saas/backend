import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PaiementModule } from './paiement/paiement.module';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { InfluenceurModule } from './influenceur/influenceur.module';
import { MarqueModule } from './marque/marque.module';
import { PartenariatModule } from './partenariat/partenariat.module';
import { CampagneModule } from './campagne/campagne.module';
import { ContenuSponsoriseModule } from './contenu-sponsorise/contenu-sponsorise.module';
import { MessageModule } from './message/message.module';
import { StatistiqueModule } from './statistique/statistique.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        PrismaModule,
        PaiementModule,
        UtilisateurModule,
        InfluenceurModule,
        MarqueModule,
        PartenariatModule,
        CampagneModule,
        ContenuSponsoriseModule,
        MessageModule,
        StatistiqueModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
