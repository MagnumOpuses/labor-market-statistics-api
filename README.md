# labor-market-statistics
Labor market statistics from the Swedish Public Employment Service

## Arbetsförmedlingens månadsstatistik 16-64 år.
Rest-API för detaljerade sökningar och samanställningar av statistik. 
Gäller arbetssökande och lediga platse se ref. [1] och [2]

# Docker 
## MongoDB

## Mongo Express

## Statistics Import

## Statistic API


### Running on localhost
Configuration in local .env-file
```docker
> docker run -p 3000:3000 --env-file .env --network mongo-network --name stat-api labor-market-stat-api 
```

## References
[1] https://arbetsformedlingen.se/statistik/sok-statistik   
[2] http://qvext.arbetsformedlingen.se/QvAJAXZfc/opendoc.htm?document=extern%5Cmstatplus_extern.qvw&host=QVS%40CLUSTEREXT&anonymous=true%20&select=StartTrigger,1

## Todo
- Add GraphQL endpoints,   
  https://docs.mongodb.com/realm/graphql  
  https://medium.com/the-ideal-system/graphql-and-mongodb-a-quick-example-34643e637e49
- Fix CORS
- All errors should be handled and relevant info to the users.
- Only read on MongoDb user

# Software Developers
Backend databases are not available to developers outside the Swedish Public Employment Service network.

## Import data

## GraphQL

## Easy access links