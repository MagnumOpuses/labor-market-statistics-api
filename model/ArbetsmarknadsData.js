/*
ADataResponse needs to be altered...
Probably every entry should have an explanation eg
{
    "platser":{
       "beskrivning": " Platser anmälda in till AF, angiven månad. bla bla bla",
       "varde": 10000
     }
}
Vi should present this as a GraphQL interface
 */
module.exports =
    function (){
    return {
            nya_anmalda_platser: 0,
            kvarstaende_platser: 0,
            sokande_som_har_fatt_arbete: 0,
            nyinskrivna_sokande: 0,

            oppet_arbetslosa_och_sokande_i_program: {
                totalt: 0,
                utan_arbete_mer_an_6_manader: 0,
                utan_arbete_mer_an_12_manader: 0,
                utan_arbete_mer_an_24_manader: 0
            },
            oppet_arbetslosa: 0,
            sokande_i_program:
                {
                   // totalt: 0,
                    arbetsmarknadsutbildning: {
                        totalt: 0,
                        validering: 0
                    },
                    arbetspraktik: {
                        totalt: 0,
                        arbetstraning_for_vissa_nyanlanda: 0
                    },
                    stod_till_start_av_naringsverksamhet: 0,
                    jobbgaranti_for_ungdomar: 0,
                    forberedande_insatser: 0,
                    projekt_med_arbetsmarknadspolitisk_inriktning: 0,
                    jobb_och_utvecklingsgarantin: 0,
                    etableringsprogrammet: {
                        exklusive_karlaggning: 0,
                        kartlaggning: 0
                    }
                },
            sokande_som_har_arbete_utan_stod: {
                //totalt: 0,
                deltidsarbetslosa: 0,
                tillfallig_timanstallning: 0,
                sokande_med_tillfalligt_arbete: 0,
                ombytessokande: 0
            },
            sokande_som_har_arbete_med_stod: {
               // totalt: 0,
                anstallningsstod: {
                   // totalt: 0,
                    indtroduktionsjobb: 0,
                    sarskilt_anstallningsstod: 0,
                    forstarkt_sarskilt_anstallningsstod: 0,
                    instegsjobb: 0,
                    trainee_brist: 0,
                    trainee_valfard: 0,
                    extratjanst: 0,
                    moderna_beredskapsjobb: 0
                },
                sarskilda_insatser: {
                    //beskrivning: "Särskilda insatser för personer med funktionsnedsättning som medför nedsatt arbetsförmåga",
                    //totalt: 0,
                    lonebidrag_for_anstallning: 0,
                    offenligt_skyddat_arbete: 0,
                    lonebidrag_for_utveckling_i_anstallning: 0,
                    lonebidrag_for_utveckling_i_anstallning_hos_samhall: 0,
                    lonebidrag_for_trygghet_i_anstallning: 0
                }
            },
            ovriga_inskrivna_vid_arbetsformedlingen: {
                totalt: 0,
                arbetsokande_med_forhinder: 0
            },
            nystartsjobb: 0,
            yrkesintroduktion: 0
        }
    };