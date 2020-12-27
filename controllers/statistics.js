const database = require('../services/oracleDB');
const ArbetsmarknadsDataResponse = require('../model/ArbetsmarknadsData');
const mongoDB = require('../services/mongoDB');


/**
 * @param afDataResponseDoc
 * @param afkodEntryName
 * @param valueToSet
 * @returns {*}
 * Set value in response document, according to afKod array.
 */
setValueInResponse = (afDataResponseDoc, afkodEntryName, valueToSet) => {
    if(afkodEntryName==null){
        return;
    }
    let splitted = afkodEntryName.split(".");
    switch (splitted.length) {
        case 1:
            afDataResponseDoc[splitted[0]] = valueToSet;
            break;
        case 2:
            afDataResponseDoc[splitted[0]][splitted[1]] = valueToSet;
            break;
        case 3:
            afDataResponseDoc[splitted[0]][splitted[1]][splitted[2]] = valueToSet;
            break;
        case 4:
            afDataResponseDoc[splitted[0]][splitted[1]][splitted[2]][splitted[3]] = valueToSet;
            break;
        case 5:
            afDataResponseDoc[splitted[0]][splitted[1]][splitted[2]][splitted[3]][splitted[4]] = valueToSet;
            break;
        default :
            throw new Error("To deep document >4");
    }
    return afDataResponseDoc;
};

let koderMap =
    {
        '1': 'sokande_som_har_fatt_arbete',
        '2': 'nyinskrivna_sokande',
        '86': 'oppet_arbetslosa_och_sokande_i_program.utan_arbete_mer_an_6_manader',
        '87': 'oppet_arbetslosa_och_sokande_i_program.utan_arbete_mer_an_12_manader',
        '88': 'oppet_arbetslosa_och_sokande_i_program.utan_arbete_mer_an_24_manader',
        '4': 'oppet_arbetslosa',
        '56': 'sokande_i_program.arbetsmarknadsutbildning.totalt',
        '103': 'sokande_i_program.arbetsmarknadsutbildning.validering',
        '35': 'sokande_i_program.arbetspraktik.totalt',
        '93': 'sokande_i_program.arbetspraktik.arbetstraning_for_vissa_nyanlanda',
        '12': 'sokande_i_program.stod_till_start_av_naringsverksamhet',
        '81': 'sokande_i_program.jobbgaranti_for_ungdomar',
        '85': 'sokande_i_program.forberedande_insatser',
        '23': 'sokande_i_program.projekt_med_arbetsmarknadspolitisk_inriktning',
        '70': 'sokande_i_program.job_och_utvecklingsgarantin',
        '104': 'sokande_i_program.etableringsprogrammet.exklusive_karlaggning',
        '105': 'sokande_i_program.etableringsprogrammet.kartlaggning',
        '7': 'sokande_som_har_arbete_utan_stod.deltidsarbetslosa',
        '8': 'sokande_som_har_arbete_utan_stod.tillfallig_timanstallning',
        '9': 'sokande_som_har_arbete_utan_stod.sokande_med_tillfalligt_arbete',
        '36': 'sokande_som_har_arbete_utan_stod.ombytessokande',
        '106': 'sokande_som_har_arbete_med_stod.anstallningsstod.indtroduktionsjobb',
        '15': 'sokande_som_har_arbete_med_stod.anstallningsstod.sarskilt_anstallningsstod',
        '89': 'sokande_som_har_arbete_med_stod.anstallningsstod.forstarkt_sarskilt_anstallningsstod',
        '78': 'sokande_som_har_arbete_med_stod.anstallningsstod.instegsjobb',
        '95': 'sokande_som_har_arbete_med_stod.anstallningsstod.trainee_brist',
        '96': 'sokande_som_har_arbete_med_stod.anstallningsstod.trainee_valfard',
        '97': 'sokande_som_har_arbete_med_stod.anstallningsstod.extratjanst',
        '102': 'sokande_som_har_arbete_med_stod.anstallningsstod.moderna_beredskapsjobb',
        '10': 'sokande_som_har_arbete_med_stod.sarskilda_insatser.lonebidrag_for_anstallning',
        '11': 'sokande_som_har_arbete_med_stod.sarskilda_insatser.offenligt_skyddat_arbete',
        '26': 'sokande_som_har_arbete_med_stod.sarskilda_insatser.lonebidrag_for_utveckling_i_anstallning',
        '107': 'sokande_som_har_arbete_med_stod.sarskilda_insatser.lonebidrag_for_utveckling_i_anstallning_hos_samhall',
        '27': 'sokande_som_har_arbete_med_stod.sarskilda_insatser.lonebidrag_for_trygghet_i_anstallning',
        '45': 'ovriga_inskrivna_vid_arbetsformedlingen.arbetsokande_med_forhinder',
        '79': 'nystartsjobb',
        '92': 'yrkesintroduktion'
    };
let afkoderMap = [
    {name: 'sokande_som_har_fatt_arbete', value: '1'},
    {name: 'nyinskrivna_sokande', value: '2'},
    {
        name: 'oppet_arbetslosa_och_sokande_i_program.totalt',
        value: "4','56', '103', '35', '93', '12', '81', '85', '23', '70', '104', '105"
    },
    {name: 'oppet_arbetslosa_och_sokande_i_program.utan_arbete_mer_an_6_manader', value: '86'},
    {name: 'oppet_arbetslosa_och_sokande_i_program.utan_arbete_mer_an_12_manader', value: '87'},
    {name: 'oppet_arbetslosa_och_sokande_i_program.utan_arbete_mer_an_24_manader', value: '88'},
    {name: 'oppet_arbetslosa', value: '4'},
    // {name: 'sokande_i_program.totalt', value: "56', '103', '35', '93', '12', '81', '85', '23', '70', '104', '105"},
    {name: 'sokande_i_program.arbetsmarknadsutbildning.totalt', value: '56'},
    {name: 'sokande_i_program.arbetsmarknadsutbildning.validering', value: '103'},
    {name: 'sokande_i_program.arbetspraktik.totalt', value: '35'},
    {name: 'sokande_i_program.arbetspraktik.arbetstraning_for_vissa_nyanlanda', value: '93'},
    {name: 'sokande_i_program.stod_till_start_av_naringsverksamhet', value: '12'},
    {name: 'sokande_i_program.jobbgaranti_for_ungdomar', value: '81'},
    {name: 'sokande_i_program.forberedande_insatser', value: '85'},
    {name: 'sokande_i_program.projekt_med_arbetsmarknadspolitisk_inriktning', value: '23'},
    {name: 'sokande_i_program.job_och_utvecklingsgarantin', value: '70'},
    {name: 'sokande_i_program.etableringsprogrammet.exklusive_karlaggning', value: '104'},
    {name: 'sokande_i_program.etableringsprogrammet.kartlaggning', value: '105'},
    //{name: 'sokande_som_har_arbete_utan_stod.totalt', value:"7','8','9','36"}, //Sum doesn't have to be fetched from database
    {name: 'sokande_som_har_arbete_utan_stod.deltidsarbetslosa', value: '7'},
    {name: 'sokande_som_har_arbete_utan_stod.tillfallig_timanstallning', value: '8'},
    {name: 'sokande_som_har_arbete_utan_stod.sokande_med_tillfalligt_arbete', value: '9'},
    {name: 'sokande_som_har_arbete_utan_stod.ombytessokande', value: '36'},
    //{name:'sokande_som_har_arbete_med_stod.totalt', value:''},
    //{name:'sokande_som_har_arbete_med_stod.anstallningsstod.totalt', value:''},//Sum doesn't have to be fetched from database
    {name: 'sokande_som_har_arbete_med_stod.anstallningsstod.indtroduktionsjobb', value: '106'},
    {name: 'sokande_som_har_arbete_med_stod.anstallningsstod.sarskilt_anstallningsstod', value: '15'},
    {name: 'sokande_som_har_arbete_med_stod.anstallningsstod.forstarkt_sarskilt_anstallningsstod', value: '89'},
    {name: 'sokande_som_har_arbete_med_stod.anstallningsstod.instegsjobb', value: '78'},
    {name: 'sokande_som_har_arbete_med_stod.anstallningsstod.trainee_brist', value: '95'},
    {name: 'sokande_som_har_arbete_med_stod.anstallningsstod.trainee_valfard', value: '96'},
    {name: 'sokande_som_har_arbete_med_stod.anstallningsstod.extratjanst', value: '97'},
    {name: 'sokande_som_har_arbete_med_stod.anstallningsstod.moderna_beredskapsjobb', value: '102'},
    //{name:'sokande_som_har_arbete_med_stod.sarskilda_insatser.totalt', value:''}, //Sum doesn't have to be fetched from database
    {name: 'sokande_som_har_arbete_med_stod.sarskilda_insatser.lonebidrag_for_anstallning', value: '10'},
    {name: 'sokande_som_har_arbete_med_stod.sarskilda_insatser.offenligt_skyddat_arbete', value: '11'},
    {name: 'sokande_som_har_arbete_med_stod.sarskilda_insatser.lonebidrag_for_utveckling_i_anstallning', value: '26'},
    {
        name: 'sokande_som_har_arbete_med_stod.sarskilda_insatser.lonebidrag_for_utveckling_i_anstallning_hos_samhall',
        value: '107'
    },
    {name: 'sokande_som_har_arbete_med_stod.sarskilda_insatser.lonebidrag_for_trygghet_i_anstallning', value: '27'},
    {name: 'ovriga_inskrivna_vid_arbetsformedlingen.totalt', value: "100', '45"},
    {name: 'ovriga_inskrivna_vid_arbetsformedlingen.arbetsokande_med_forhinder', value: '45'},
    {name: 'nystartsjobb', value: '79'},
    {name: 'yrkesintroduktion', value: '92'}
];

//TODO: look into express body-parser
//TODO: put bindings as a object with name and value.
//TODO: executeMany()?  http://oracle.github.io/node-oracledb/doc/api.html
/**
 * @deprecated
 * @param binds
 * @returns {Promise<*>}
 */
async function platsQueries(binds) {
    try {
        const query = "select sum(antal) as antal from PLATSER where lanskod=:lanskod and manad=:manad and afkod=:afkod";
        const dbResult = await database.executeSQLStatement(query, binds);
        return dbResult.rows[0].ANTAL;
    } catch (error) {
        console.log(error); //TODO: remove this
        throw error;
    }
}

/**
 * @deprecated
 * @param binds
 * @param afkodValue
 * @returns {Promise<number>}
 */
async function sokandeQueries(binds, afkodValue) {
//TODO: executeMany()?  http://oracle.github.io/node-oracledb/doc/api.html
    try {
        const query = "select sum(antal) as antal from SOKANDE where lanskod=:lanskod and manad=:manad and afkod in ('" + afkodValue.toString() + "')";
        const dbResult = await database.executeSQLStatement(query, binds);
        return dbResult.rows[0].ANTAL == null ? 0 : dbResult.rows[0].ANTAL;
    } catch (error) {
        console.log(error); //TODO: remove this
        throw error;
    }
}

/*
 * This is taking to much time it is a very bad solution...
 * Fix:
 * Pre catch all possible answers (put it in a mongoDB or a big json doc) ?
 * Could better SQL fix anything ?
 *
 */
async function getNumFromSokande(req, res, next) {
    try {
        res.status(200).json(await numFromSokande(req.query.lanskod, req.query.manad));
    } catch (error) {
        next(error);
    }
}

numFromSokande = async (lanskod, manad) => {
    //TODO: add usage of kommun, kon and fodelseland
    //TODO: Must find SQL to do fewer requests or create more connections, look into the connection handling, REUSE...
    try {
        let binds = {};
        binds.lanskod = lanskod;
        binds.manad = manad;

        let response = new ArbetsmarknadsDataResponse;
        await numFromPlats(response, lanskod, manad, null, null, null, ['06', '07']);
        for (const afkod of afkoderMap) {
            setValueInResponse(response, afkod.name, await sokandeQueries(binds, afkod.value));
        }
        return response;

    } catch (error) {
        throw error;
    }
};
/*
not: Choosed not to use "Etablering"
 */
/**
 * @deprecated
 * @param responseJSON
 * @param lanskod
 * @param manad
 * @param kommun
 * @param fodelseland
 * @param kon
 * @param afkoder
 * @returns {Promise<*>}
 */
numFromPlats = async (responseJSON, lanskod, manad, kommun, fodelseland, kon, afkoder) => {
//TODO: add usage of kommun, kon and fodelseland
    const binds = {};
    binds.lanskod = lanskod;
    binds.manad = manad;

    for (const afkod of afkoder) {
        binds.afkod = afkod;
        let num = await platsQueries(binds);
        switch (afkod) {
            case '06':
                responseJSON.nya_anmalda_platser = num;
                break;
            case '07':
                responseJSON.kvarstaende_platser = num;
                break;
        }
    }
    return responseJSON;
};


/**
 *  @deprecated
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
async function getNumFromPlats(req, res, next) {
    try {
        //TODO: validate input parameters
        let responseDoc = new ArbetsmarknadsDataResponse();
        let afkoder = ['06', '07'];
        res.status(200).json(await numFromPlats(responseDoc, req.query.lanskod, req.query.manad, null, null, null, afkoder));
    } catch (error) {
        next(error);
    }
}


const arbetsmarknadsData = async (req, res, next) => {
    try {
        let result = await mongoDB.findSokandeTotalt(req.query.manad, req.query.lanskod, req.query.kommunkod);
        console.log(JSON.stringify(result));
        //Map result to output document
        let response = new ArbetsmarknadsDataResponse; //TODO: should I remove this and build the doc from scratch ??
        let kmap  = koderMap;
        result.forEach((value, index, array) => {
            //console.log(`Kod = ${value._id.AFKOD}`);
            //console.log(kmap[value._id.AFKOD]);
            setValueInResponse(response,kmap[value._id.AFKOD], value.totalt)
        });
        result = await mongoDB.findPlatserTotalt(req.query.manad, req.query.lanskod, req.query.kommunkod);
        console.log(result);
        result.forEach((value, index, array) => {
            switch (value._id.AFKOD) {
                case 6:
                    response.nya_anmalda_platser = value.totalt;
                    break;
                case 7:
                    response.kvarstaende_platser = value.totalt;
                    break;
                default:

                    break;
            }
        });
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};


//TODO:temp name :)
const numFromSokandeMongo = async (req, res, next) => {
    try {
        let result = await mongoDB.findSokandeTotalt(req.query.manad, req.query.lanskod, req.query.kommunkod);
        console.log(JSON.stringify(result));
        //Map result to output document
        let response = new ArbetsmarknadsDataResponse; //TODO: should I remove this and build the doc from scratch ??
        let kmap  = koderMap;
        result.forEach((value, index, array) => {
            //console.log(`Kod = ${value._id.AFKOD}`);
            //console.log(kmap[value._id.AFKOD]);
            setValueInResponse(response,kmap[value._id.AFKOD], value.totalt)
        });
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

//const getRawData()

module.exports.arbetsmarknadsData = arbetsmarknadsData;
//module.exports.getNumFromSokande = getNumFromSokande;
//module.exports.numFromSokandeMongo = numFromSokandeMongo;