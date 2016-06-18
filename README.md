# MedicareProvidersSearch
A tool to search for providers and other health care professionals currently enrolled in Medicare

#Data Sources
Please import the data to a MS SQL server with database named 'Medicare' in the following order:

#Required:
MedicareProviders - http://download.cms.gov/nppes/NPI_Files.html <br/>
Physicians - https://data.medicare.gov/data/physician-compare <br/>
MedicareProvidersUtilizationAndPayments - https://www.cms.gov/research-statistics-data-and-systems/statistics-trends-and-reports/medicare-provider-charge-data/physician-and-other-supplier.html <br/>
MedicareProvidersAggregates - https://www.cms.gov/research-statistics-data-and-systems/statistics-trends-and-reports/medicare-provider-charge-data/physician-and-other-supplier.html <br/>
ZipCodes - (choose Centroids) http://www.nber.org/data/zip-code-distance-database.html

#Optional:
HCPCSCodes - 

#To do:
Build a data importer to take .cvs raw data files and update the data already in the database

#Screenshots
