const {MongoClient} = require('mongodb');
const MongoDBConfig = require('../config/mongodb')
const ArbetsmarknadsDataResponse = require('../model/ArbetsmarknadsData');

const TableEnum = Object.freeze({sokande: 1, arbetskraft: 2, platser: 3});
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
const getValueFromArbetsmarknadsData = (afDataResponseDoc, afkodEntryName) =>{
    if(afkodEntryName==null){
        return;
    }
    let splitted = afkodEntryName.split(".");
    switch (splitted.length) {
        case 1:
            return afDataResponseDoc[splitted[0]];
        case 2:
            return afDataResponseDoc[splitted[0]][splitted[1]];
        case 3:
            return afDataResponseDoc[splitted[0]][splitted[1]][splitted[2]];
        case 4:
            return afDataResponseDoc[splitted[0]][splitted[1]][splitted[2]][splitted[3]];
        case 5:
            return afDataResponseDoc[splitted[0]][splitted[1]][splitted[2]][splitted[3]][splitted[4]];
        default :
            throw new Error("To deep document >4");
    }
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
const fetchArbetsmarknadsData = async (manad, lanskod, kommunkod,koen, ung_vuxen, tillhor_etablering, fodelselandsgrupp) => {
    let result = await findSokandeTotalt(manad, lanskod, kommunkod, koen, ung_vuxen, tillhor_etablering, fodelselandsgrupp);
    //console.log(JSON.stringify(result));
    //Map result to output document
    let response = new ArbetsmarknadsDataResponse; //TODO: should I remove this and build the doc from scratch ??
    let kmap  = koderMap;
    result.forEach((value, index, array) => {
        let totalt = getValueFromArbetsmarknadsData(response, kmap[value._id.AFKOD])+value.totalt;
        setValueInResponse(response,kmap[value._id.AFKOD], totalt );
    });
    result = await findPlatserTotalt(manad, lanskod, kommunkod, koen, ung_vuxen, tillhor_etablering, fodelselandsgrupp);
    //console.log(result);
    result.forEach((value) => {
        switch (value._id.AFKOD) {
            case 6:
                response.nya_anmalda_platser += value.totalt;
                break;
            case 7:
                response.kvarstaende_platser += value.totalt;
                break;
            default:

                break;
        }
    });
    //TODO: fix sums ex. "oppet_arbetslosa_och_sokande_i_program.totalt" look for more...
    return response;
};

const antalPerAFkodPipeline = [
    {$match: {MANAD: ''}}, //Must be a variable
    {
        $group:
            {
                _id: {AFKOD: "$AFKOD", LANSKOD: "$LANSKOD"},
                totalt: {$sum: "$ANTAL"}
            }
    }
];

const fixMatchRequestPipeline = (manad, lanskod, kommunkod, koen, ung_vuxen, tillhor_etablering, fodelselandsgrupp) => {
    //TODO: Create a class to avoid object copy and better separation
    //copy the object..
    let thePipeline = JSON.parse(JSON.stringify(antalPerAFkodPipeline));
    thePipeline[0].$match.MANAD = manad;
    if (lanskod != null) thePipeline[0].$match.LANSKOD = lanskod;
    if (kommunkod != null) thePipeline[0].$match.KOMMUNKOD = kommunkod;
    if (koen != null) thePipeline[0].$match.KOEN = koen;//K or M
    if (ung_vuxen != null) thePipeline[0].$match.UNG_VUXEN = ung_vuxen;//J or N
    if (tillhor_etablering != null) thePipeline[0].$match.TILLHOR_ETABLERING = tillhor_etablering;//J or N
    if (fodelselandsgrupp != null) thePipeline[0].$match.FODELSELANDSGRUPP = fodelselandsgrupp;//"Född i Sverige", "Född i Europa utom Sverige", "Född utanför Europa"

    return thePipeline;
};

//TODO: add more parameters kon, fodelseland, more...
const findSokandeTotalt = async (manad, lanskod = null, kommunkod = null, koen=null,  ung_vuxen=null, tillhor_etablering=null, fodelselandsgrupp=null) => {
    const client = new MongoClient(MongoDBConfig.config.default_uri,{ useUnifiedTopology: true });
    try {
        await client.connect();
        const aggCursor = client.db(MongoDBConfig.config.dbName)
            .collection("sokande")
            .aggregate(fixMatchRequestPipeline(manad, lanskod, kommunkod, koen, ung_vuxen, tillhor_etablering, fodelselandsgrupp))
            .sort({AFKOD: 1, _id: 1});
        //console.log(await aggCursor.toArray());
        return await aggCursor.toArray();
    } catch (e) {
        console.log(e)
    } finally {

        await client.close();
    }
};

const findPlatserTotalt = async (manad, lanskod = null, kommunkod = null
                                 , koen= null, ung_vuxen= null, tillhor_etablering= null, fodelselandsgrupp= null) => {
    const client = new MongoClient(MongoDBConfig.config.default_uri,{ useUnifiedTopology: true });
    try {
        await client.connect();
        const aggCursor = client.db(MongoDBConfig.config.dbName)
            .collection("platser")
            .aggregate(fixMatchRequestPipeline(manad, lanskod, kommunkod
                , koen, ung_vuxen, tillhor_etablering, fodelselandsgrupp))
            .sort({AFKOD: 1, _id: 1});
        return await aggCursor.toArray();
    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }
};
//TODO: Do every thing with classes (where it's suitable)
/*
* New instance to copy data and create a matchingObject for db find
 */
class FindRequestFixer{
    constructor(manad, lanskod, kommunkod, koen, ung_vuxen, tillhor_etablering, fodelselandsgrupp){
        this.manad = manad;
        this.lanskod = lanskod;
        this.kommunkod = kommunkod;
        this.koen=koen;
        this.ung_vuxen=ung_vuxen;
        this.tillhor_etablering=tillhor_etablering;
        this.fodelselandsgrupp= fodelselandsgrupp;
    }
    fix(){
        let matchObject = {MANAD:this.manad};
        if(this.lanskod!=null) matchObject.LANSKOD=this.lanskod;
        if(this.kommunkod!=null) matchObject.KOMMUNKOD=this.kommunkod;
        if(this.koen!=null) matchObject.KOEN=this.koen;
        if(this.ung_vuxen!=null) matchObject.UNG_VUXEN=this.ung_vuxen;
        if(this.tillhor_etablering!=null) matchObject.TILLHOR_ETABLERING=this.tillhor_etablering;
        if(this.fodelselandsgrupp!=null) matchObject.FODELSELANDSGRUPP=this.fodelselandsgrupp;
        return matchObject;
    }
}

//TODO: It's possible to filter the answer directly in MongoDB request.
const sokande = async (args) => {
    const client = new MongoClient(MongoDBConfig.config.default_uri, { useUnifiedTopology: true });
    try{
        await client.connect();
        const cursor = client.db(MongoDBConfig.config.dbName)
            .collection("sokande")
            .find( new FindRequestFixer(args.Parameters.MANAD,args.Parameters.LANSKOD,args.Parameters.KOMMUNKOD
        ,args.Parameters.KOEN, args.Parameters.UNG_VUXEN, args.Parameters.TILLHOR_ETABLERING, args.Parameters.FODELSELANDSGRUPP).fix());
        return await cursor.toArray();
    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }
};
const arbetskraft = async (args) => {
    const client = new MongoClient(MongoDBConfig.config.default_uri, { useUnifiedTopology: true });
    try{
        await client.connect();
        const cursor = client.db(MongoDBConfig.config.dbName)
            .collection("arbetskraft")
            .find( new FindRequestFixer(args.Parameters.MANAD,args.Parameters.LANSKOD,args.Parameters.KOMMUNKOD
                ,args.Parameters.KOEN, args.Parameters.UNG_VUXEN, args.Parameters.TILLHOR_ETABLERING, args.Parameters.FODELSELANDSGRUPP).fix());
        return await cursor.toArray();
    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }
};
const plats = async (args) => {
    const client = new MongoClient(MongoDBConfig.config.default_uri, { useUnifiedTopology: true });
    try{
        await client.connect();
        const cursor = client.db(MongoDBConfig.config.dbName)
            .collection("platser")
            .find( new FindRequestFixer(args.Parameters.MANAD,args.Parameters.LANSKOD,args.Parameters.KOMMUNKOD
                ,args.Parameters.KOEN, args.Parameters.UNG_VUXEN, args.Parameters.TILLHOR_ETABLERING, args.Parameters.FODELSELANDSGRUPP).fix());
        return await cursor.toArray();
    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }
};
//TODO: Create a new response type, don't use the old one....
const getArbetsmarknadsdata = async (args) =>{
    //const client = new MongoClient(MongoDBConfig.config.default_uri, { useUnifiedTopology: true });
    try{
      let retVal =  await fetchArbetsmarknadsData(args.Parameters.MANAD,args.Parameters.LANSKOD,args.Parameters.KOMMUNKOD);
      return retVal;
    } catch (e) {
        console.log(e)
    }
};

const getAllMonthSorted = async () => {
    const client = new MongoClient(MongoDBConfig.config.default_uri, { useUnifiedTopology: true });
    try{
        await client.connect();
      let retVal =  client.db(MongoDBConfig.config.dbName).collection("platser").distinct("MANAD");
      return (await retVal).sort(stringMonthSorterHelp).reverse();

    } catch (e) {
        console.log(e)
    }
}

const stringMonthSorterHelp = (a, b) =>{
    //a and b are strings
    let key1 = new Date(a); 
    let key2 = new Date(b);
    if( key1 < key2){
        return -1;
    } else if(key1 == key2){
        return 0;
    } else {
        return 1;
    }
}
module.exports = { getAllMonthSorted, findSokandeTotalt, findPlatserTotalt, sokande, arbetskraft, plats, getArbetsmarknadsdata, fetchArbetsmarknadsData};
//(async function() {
    //console.log(MongoDBConfig.dumpConfig());
    // console.log(await findSokandeTotalt('2020-11', '01'));
     //console.log(await findPlatserTotalt('2020-11', '01'));
   // console.log(await sokande("2020-10"));
   //console.log(await getAllMonthSorted());
//})();





