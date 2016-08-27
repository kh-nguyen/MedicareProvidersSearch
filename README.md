# MedicareProvidersSearch
This is a tool to search for providers and other health care professionals currently enrolled in Medicare.
It can be used to see whether a medical procedure is popular in a certain area, who are using it and how much it costs.

#Install
Use Schemas\MSSQL.sql file to install the database schema to a MS SQL Server Express 2012.
You also need to modify the Web.config and/or App.config to update the database connection string for your computer.
Please note that there is a size limit of 10GB for the MS SQL Server Express.

#Public Data Sources
Please import the data to the MS SQL server using the included 'Import' program in the following order.

#Required:
MedicareProviders - http://download.cms.gov/nppes/NPI_Files.html <br/>
Physicians - https://data.medicare.gov/data/physician-compare <br/>
MedicareProvidersUtilizationAndPayments - https://www.cms.gov/research-statistics-data-and-systems/statistics-trends-and-reports/medicare-provider-charge-data/physician-and-other-supplier.html <br/>
MedicareProvidersAggregates - https://www.cms.gov/research-statistics-data-and-systems/statistics-trends-and-reports/medicare-provider-charge-data/physician-and-other-supplier.html <br/>
ZipCodes - (choose Centroids) http://www.nber.org/data/zip-code-distance-database.html

#Optional:
HCPCSCodes -  <br/>
TaxonomyCodes - http://www.nucc.org/index.php?option=com_content&view=article&id=107&Itemid=50

#Screenshots
![ScreenShot 1](https://github.com/kh-nguyen/MedicareProvidersSearch/raw/master/MedicareProvidersSearch/Screenshot.png)
