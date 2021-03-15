const typeDefs = `

input SokParameter {
    "Ange år och månad ex. 2020-10"
    MANAD: String!
    "Länskod"
    LANSKOD: String
    "Kommunkod"
    KOMMUNKOD: String
    "Kön Man(M) eller kvinna (K)"
    KOEN: String
    "Ung vuxen J(ja) eller N(nej)"
    UNG_VUXEN: String
    TILLHOR_ETABLERING: String
    FODELSELANDSGRUPP: String
}

"""Öppet Arbetslösa och sökande i program"""
type Oppet_arbetslosa_och_sokande_i_program{
    totalt: Int
    utan_arbete_mer_an_6_manader: Int
    utan_arbete_mer_an_12_manader: Int
    utan_arbete_mer_an_24_manader: Int
    }
type Arbetspraktik{
    totalt: Int
    arbetstraning_for_vissa_nyanlanda: Int
}
type Etableringsprogrammet{
    exklusive_karlaggning:Int
    kartlaggning:Int
}
type Arbetsmarknadsutbildning{
    totalt:Int
    validering:Int
}
type Sokande_i_program{
    arbetsmarknadsutbildning: Arbetsmarknadsutbildning
    arbetspraktik: Arbetspraktik
    stod_till_start_av_naringsverksamhet:Int
    jobbgaranti_for_ungdomar:Int
    forberedande_insatser:Int
    projekt_med_arbetsmarknadspolitisk_inriktning:Int
    jobb_och_utvecklingsgarantin:Int
    etableringsprogrammet: Etableringsprogrammet
}
type Sokande_som_har_arbete_utan_stod{
    deltidsarbetslosa: Int
    tillfallig_timanstallning: Int
    sokande_med_tillfalligt_arbete: Int
    ombytessokande: Int
}
type Anstallningsstod{
    indtroduktionsjobb:Int
    sarskilt_anstallningsstod: Int
    forstarkt_sarskilt_anstallningsstod: Int
    instegsjobb: Int
    trainee_brist: Int
    trainee_valfard: Int
    extratjanst: Int
    moderna_beredskapsjobb: Int
   }
type Sokande_som_har_arbete_med_stod{
   anstallningsstod:Anstallningsstod
}

type Sarskilda_insatser{
    lonebidrag_for_anstallning: Int
    offenligt_skyddat_arbete: Int
    lonebidrag_for_utveckling_i_anstallning: Int
    lonebidrag_for_utveckling_i_anstallning_hos_samhall: Int
    lonebidrag_for_trygghet_i_anstallning: Int
}

type Ovriga_inskrivna_vid_arbetsformedlingen{
    totalt: Int
    arbetsokande_med_forhinder: Int
}

type ArbetsmarknadsData{
    nya_anmalda_platser: Int
    kvarstaende_platser: Int
    nyinskrivna_sokande: Int
    oppet_arbetslosa_och_sokande_i_program: Oppet_arbetslosa_och_sokande_i_program
    oppet_arbetslosa: Int
    sokande_i_program: Sokande_i_program
    sokande_som_har_arbete_utan_stod: Sokande_som_har_arbete_utan_stod
    sokande_som_har_arbete_med_stod: Sokande_som_har_arbete_med_stod
    sarskilda_insatser: Sarskilda_insatser
    ovriga_inskrivna_vid_arbetsformedlingen: Ovriga_inskrivna_vid_arbetsformedlingen
    nystartsjobb:Int
    yrkesintroduktion:Int
}


type SokandeData {
    MANAD: String
    LANSKOD: String
    KOMMUNKOD: String
    KOEN: String
    UNG_VUXEN: String
    TILLHOR_ETABLERING: String
    FODELSELANDSGRUPP: String
    AFKOD: Int
    ANTAL: Int
}
type PlatsData {
     MANAD: String
     LANSKOD:String
     KOMMUNKOD: String
     AFKOD:String
     ANTAL:String
}
type ArbetskraftData {
    MANAD: String
    LANSKOD:String
    KOMMUNKOD:String
    KOEN: String
    UNG_VUXEN:String
    UTRIKESFODD:String
    ANTAL:String
}






"""Metoder för att hämta arbetsmarknadsdata"""
type Root {
""" Hitta sökande"""
  sokande(Parameters: SokParameter):[SokandeData]
  arbetskraft(Parameters: SokParameter):[ArbetskraftData]
  plats(Parameters: SokParameter): [ArbetskraftData]
  arbetsmarknad(Parameters: SokParameter):ArbetsmarknadsData
}

schema {
    query: Root
}
`;

exports.typeDefs = typeDefs;

