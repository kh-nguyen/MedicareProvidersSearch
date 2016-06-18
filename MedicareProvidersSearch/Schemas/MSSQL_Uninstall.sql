USE Medicare

DROP TABLE [dbo].[ZipCodes]

DROP TABLE [dbo].[HCPCSCodes]

ALTER TABLE [dbo].[jqGridSavedSearchHistories] DROP CONSTRAINT [DF_jqGridSavedSearchHistories_CreationTime]
DROP TABLE [dbo].[jqGridSavedSearchHistories]

ALTER TABLE [dbo].[MedicareProvidersUtilizationAndPayments] DROP CONSTRAINT [FK_MedicareProvidersUtilizationAndPayments_MedicareProviders]
DROP TABLE [dbo].[MedicareProvidersUtilizationAndPayments]

ALTER TABLE [dbo].[MedicareProvidersAggregates] DROP CONSTRAINT [FK_MedicareProvidersAggregates_MedicareProviders]
DROP TABLE [dbo].[MedicareProvidersAggregates]

ALTER TABLE [dbo].[Physicians] DROP CONSTRAINT [FK_Physicians_MedicareProviders]
ALTER TABLE [dbo].[Physicians] DROP CONSTRAINT [DF_Physicians_LastModifiedDate]
DROP TABLE [dbo].[Physicians]

DROP TABLE [dbo].[MedicareProviders]

DROP VIEW [dbo].[MedicareExtendedProviders]

DROP VIEW [dbo].[MedicareExtendedProvidersAggregates]

DROP VIEW [dbo].[MedicareExtendedUtilizationAndPayments]