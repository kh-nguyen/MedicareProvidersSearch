USE [master]
GO
/****** Object:  Database [Medicare]    Script Date: 8/27/2016 9:33:28 AM ******/
CREATE DATABASE [Medicare]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Medicare', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.SQLEXPRESS\MSSQL\DATA\Medicare.mdf' , SIZE = 10350592KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'Medicare_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.SQLEXPRESS\MSSQL\DATA\Medicare_log.ldf' , SIZE = 625792KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [Medicare] SET COMPATIBILITY_LEVEL = 120
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Medicare].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Medicare] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Medicare] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Medicare] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Medicare] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Medicare] SET ARITHABORT OFF 
GO
ALTER DATABASE [Medicare] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Medicare] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Medicare] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Medicare] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Medicare] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Medicare] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Medicare] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Medicare] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Medicare] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Medicare] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Medicare] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Medicare] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Medicare] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Medicare] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Medicare] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Medicare] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Medicare] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Medicare] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Medicare] SET  MULTI_USER 
GO
ALTER DATABASE [Medicare] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Medicare] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Medicare] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Medicare] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [Medicare] SET DELAYED_DURABILITY = DISABLED 
GO
USE [Medicare]
GO
/****** Object:  User [test]    Script Date: 8/27/2016 9:33:28 AM ******/
CREATE USER [test] FOR LOGIN [test] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_datareader] ADD MEMBER [test]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [test]
GO
/****** Object:  Table [dbo].[HCPCSCodes]    Script Date: 8/27/2016 9:33:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[HCPCSCodes](
	[HCPCS] [varchar](5) NOT NULL,
	[ShortDescription] [nvarchar](255) NULL,
	[Description] [nvarchar](max) NULL,
	[DrugIndicator] [varchar](1) NULL,
 CONSTRAINT [PK_HCPCSCodes] PRIMARY KEY CLUSTERED 
(
	[HCPCS] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[jqGridSavedSearchHistories]    Script Date: 8/27/2016 9:33:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[jqGridSavedSearchHistories](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[SearchType] [nvarchar](50) NULL,
	[ContactID] [int] NOT NULL,
	[Name] [nvarchar](255) NULL,
	[Search] [nvarchar](max) NULL,
	[Filter] [nvarchar](max) NULL,
	[CreationTime] [datetime] NULL,
 CONSTRAINT [PK_jqGridSavedSearchHistories] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[MedicareProviders]    Script Date: 8/27/2016 9:33:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[MedicareProviders](
	[NPI] [int] NOT NULL,
	[Entity Type Code] [smallint] NULL,
	[Replacement NPI] [int] NULL,
	[Employer Identification Number (EIN)] [varchar](10) NULL,
	[Provider Organization Name (Legal Business Name)] [varchar](70) NULL,
	[Provider Last Name (Legal Name)] [varchar](35) NULL,
	[Provider First Name] [varchar](20) NULL,
	[Provider Middle Name] [varchar](20) NULL,
	[Provider Name Prefix Text] [varchar](5) NULL,
	[Provider Name Suffix Text] [varchar](5) NULL,
	[Provider Credential Text] [varchar](20) NULL,
	[Provider Other Organization Name] [varchar](70) NULL,
	[Provider Other Organization Name Type Code] [smallint] NULL,
	[Provider Other Last Name] [varchar](35) NULL,
	[Provider Other First Name] [varchar](20) NULL,
	[Provider Other Middle Name] [varchar](20) NULL,
	[Provider Other Name Prefix Text] [varchar](5) NULL,
	[Provider Other Name Suffix Text] [varchar](5) NULL,
	[Provider Other Credential Text] [varchar](20) NULL,
	[Provider Other Last Name Type Code] [smallint] NULL,
	[Provider First Line Business Mailing Address] [varchar](55) NULL,
	[Provider Second Line Business Mailing Address] [varchar](55) NULL,
	[Provider Business Mailing Address City Name] [varchar](40) NULL,
	[Provider Business Mailing Address State Name] [varchar](40) NULL,
	[Provider Business Mailing Address Postal Code] [varchar](20) NULL,
	[Provider Business Mailing Address Country Code (If outside US)] [varchar](2) NULL,
	[Provider Business Mailing Address Telephone Number] [varchar](20) NULL,
	[Provider Business Mailing Address Fax Number] [varchar](20) NULL,
	[Provider First Line Business Practice Location Address] [varchar](55) NULL,
	[Provider Second Line Business Practice Location Address] [varchar](55) NULL,
	[Provider Business Practice Location Address City Name] [varchar](40) NULL,
	[Provider Business Practice Location Address State Name] [varchar](40) NULL,
	[Provider Business Practice Location Address Postal Code] [varchar](20) NULL,
	[Provider Business Practice Location Address Country Code (If outside US)] [varchar](2) NULL,
	[Provider Business Practice Location Address Telephone Number] [varchar](20) NULL,
	[Provider Business Practice Location Address Fax Number] [varchar](20) NULL,
	[Provider Enumeration Date] [datetime] NULL,
	[Last Update Date] [datetime] NULL,
	[NPI Deactivation Reason Code] [varchar](2) NULL,
	[NPI Deactivation Date] [datetime] NULL,
	[NPI Reactivation Date] [datetime] NULL,
	[Provider Gender Code] [varchar](1) NULL,
	[Authorized Official Last Name] [varchar](35) NULL,
	[Authorized Official First Name] [varchar](20) NULL,
	[Authorized Official Middle Name] [varchar](20) NULL,
	[Authorized Official Title or Position] [varchar](35) NULL,
	[Authorized Official Telephone Number] [varchar](20) NULL,
	[Healthcare Provider Taxonomy Code_1] [varchar](10) NULL,
	[Provider License Number_1] [varchar](20) NULL,
	[Provider License Number State Code_1] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_1] [varchar](1) NULL,
	[Healthcare Provider Taxonomy Code_2] [varchar](10) NULL,
	[Provider License Number_2] [varchar](20) NULL,
	[Provider License Number State Code_2] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_2] [varchar](1) NULL,
	[Healthcare Provider Taxonomy Code_3] [varchar](10) NULL,
	[Provider License Number_3] [varchar](20) NULL,
	[Provider License Number State Code_3] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_3] [varchar](1) NULL,
	[Healthcare Provider Taxonomy Code_4] [varchar](10) NULL,
	[Provider License Number_4] [varchar](20) NULL,
	[Provider License Number State Code_4] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_4] [varchar](1) NULL,
	[Healthcare Provider Taxonomy Code_5] [varchar](10) NULL,
	[Provider License Number_5] [varchar](20) NULL,
	[Provider License Number State Code_5] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_5] [varchar](1) NULL,
	[Healthcare Provider Taxonomy Code_6] [varchar](10) NULL,
	[Provider License Number_6] [varchar](20) NULL,
	[Provider License Number State Code_6] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_6] [varchar](1) NULL,
	[Healthcare Provider Taxonomy Code_7] [varchar](10) NULL,
	[Provider License Number_7] [varchar](20) NULL,
	[Provider License Number State Code_7] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_7] [varchar](1) NULL,
	[Healthcare Provider Taxonomy Code_8] [varchar](10) NULL,
	[Provider License Number_8] [varchar](20) NULL,
	[Provider License Number State Code_8] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_8] [varchar](1) NULL,
	[Healthcare Provider Taxonomy Code_9] [varchar](10) NULL,
	[Provider License Number_9] [varchar](20) NULL,
	[Provider License Number State Code_9] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_9] [varchar](1) NULL,
	[Healthcare Provider Taxonomy Code_10] [varchar](10) NULL,
	[Provider License Number_10] [varchar](20) NULL,
	[Provider License Number State Code_10] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_10] [varchar](1) NULL,
	[Healthcare Provider Taxonomy Code_11] [varchar](10) NULL,
	[Provider License Number_11] [varchar](20) NULL,
	[Provider License Number State Code_11] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_11] [varchar](1) NULL,
	[Healthcare Provider Taxonomy Code_12] [varchar](10) NULL,
	[Provider License Number_12] [varchar](20) NULL,
	[Provider License Number State Code_12] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_12] [varchar](1) NULL,
	[Healthcare Provider Taxonomy Code_13] [varchar](10) NULL,
	[Provider License Number_13] [varchar](20) NULL,
	[Provider License Number State Code_13] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_13] [varchar](1) NULL,
	[Healthcare Provider Taxonomy Code_14] [varchar](10) NULL,
	[Provider License Number_14] [varchar](20) NULL,
	[Provider License Number State Code_14] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_14] [varchar](1) NULL,
	[Healthcare Provider Taxonomy Code_15] [varchar](10) NULL,
	[Provider License Number_15] [varchar](20) NULL,
	[Provider License Number State Code_15] [varchar](2) NULL,
	[Healthcare Provider Primary Taxonomy Switch_15] [varchar](1) NULL,
	[Other Provider Identifier_1] [varchar](20) NULL,
	[Other Provider Identifier Type Code_1] [varchar](2) NULL,
	[Other Provider Identifier State_1] [varchar](2) NULL,
	[Other Provider Identifier Issuer_1] [varchar](80) NULL,
	[Other Provider Identifier_2] [varchar](20) NULL,
	[Other Provider Identifier Type Code_2] [varchar](2) NULL,
	[Other Provider Identifier State_2] [varchar](2) NULL,
	[Other Provider Identifier Issuer_2] [varchar](80) NULL,
	[Other Provider Identifier_3] [varchar](20) NULL,
	[Other Provider Identifier Type Code_3] [varchar](2) NULL,
	[Other Provider Identifier State_3] [varchar](2) NULL,
	[Other Provider Identifier Issuer_3] [varchar](80) NULL,
	[Other Provider Identifier_4] [varchar](20) NULL,
	[Other Provider Identifier Type Code_4] [varchar](2) NULL,
	[Other Provider Identifier State_4] [varchar](2) NULL,
	[Other Provider Identifier Issuer_4] [varchar](80) NULL,
	[Other Provider Identifier_5] [varchar](20) NULL,
	[Other Provider Identifier Type Code_5] [varchar](2) NULL,
	[Other Provider Identifier State_5] [varchar](2) NULL,
	[Other Provider Identifier Issuer_5] [varchar](80) NULL,
	[Other Provider Identifier_6] [varchar](20) NULL,
	[Other Provider Identifier Type Code_6] [varchar](2) NULL,
	[Other Provider Identifier State_6] [varchar](2) NULL,
	[Other Provider Identifier Issuer_6] [varchar](80) NULL,
	[Other Provider Identifier_7] [varchar](20) NULL,
	[Other Provider Identifier Type Code_7] [varchar](2) NULL,
	[Other Provider Identifier State_7] [varchar](2) NULL,
	[Other Provider Identifier Issuer_7] [varchar](80) NULL,
	[Other Provider Identifier_8] [varchar](20) NULL,
	[Other Provider Identifier Type Code_8] [varchar](2) NULL,
	[Other Provider Identifier State_8] [varchar](2) NULL,
	[Other Provider Identifier Issuer_8] [varchar](80) NULL,
	[Other Provider Identifier_9] [varchar](20) NULL,
	[Other Provider Identifier Type Code_9] [varchar](2) NULL,
	[Other Provider Identifier State_9] [varchar](2) NULL,
	[Other Provider Identifier Issuer_9] [varchar](80) NULL,
	[Other Provider Identifier_10] [varchar](20) NULL,
	[Other Provider Identifier Type Code_10] [varchar](2) NULL,
	[Other Provider Identifier State_10] [varchar](2) NULL,
	[Other Provider Identifier Issuer_10] [varchar](80) NULL,
	[Other Provider Identifier_11] [varchar](20) NULL,
	[Other Provider Identifier Type Code_11] [varchar](2) NULL,
	[Other Provider Identifier State_11] [varchar](2) NULL,
	[Other Provider Identifier Issuer_11] [varchar](80) NULL,
	[Other Provider Identifier_12] [varchar](20) NULL,
	[Other Provider Identifier Type Code_12] [varchar](2) NULL,
	[Other Provider Identifier State_12] [varchar](2) NULL,
	[Other Provider Identifier Issuer_12] [varchar](80) NULL,
	[Other Provider Identifier_13] [varchar](20) NULL,
	[Other Provider Identifier Type Code_13] [varchar](2) NULL,
	[Other Provider Identifier State_13] [varchar](2) NULL,
	[Other Provider Identifier Issuer_13] [varchar](80) NULL,
	[Other Provider Identifier_14] [varchar](20) NULL,
	[Other Provider Identifier Type Code_14] [varchar](2) NULL,
	[Other Provider Identifier State_14] [varchar](2) NULL,
	[Other Provider Identifier Issuer_14] [varchar](80) NULL,
	[Other Provider Identifier_15] [varchar](20) NULL,
	[Other Provider Identifier Type Code_15] [varchar](2) NULL,
	[Other Provider Identifier State_15] [varchar](2) NULL,
	[Other Provider Identifier Issuer_15] [varchar](80) NULL,
	[Other Provider Identifier_16] [varchar](20) NULL,
	[Other Provider Identifier Type Code_16] [varchar](2) NULL,
	[Other Provider Identifier State_16] [varchar](2) NULL,
	[Other Provider Identifier Issuer_16] [varchar](80) NULL,
	[Other Provider Identifier_17] [varchar](20) NULL,
	[Other Provider Identifier Type Code_17] [varchar](2) NULL,
	[Other Provider Identifier State_17] [varchar](2) NULL,
	[Other Provider Identifier Issuer_17] [varchar](80) NULL,
	[Other Provider Identifier_18] [varchar](20) NULL,
	[Other Provider Identifier Type Code_18] [varchar](2) NULL,
	[Other Provider Identifier State_18] [varchar](2) NULL,
	[Other Provider Identifier Issuer_18] [varchar](80) NULL,
	[Other Provider Identifier_19] [varchar](20) NULL,
	[Other Provider Identifier Type Code_19] [varchar](2) NULL,
	[Other Provider Identifier State_19] [varchar](2) NULL,
	[Other Provider Identifier Issuer_19] [varchar](80) NULL,
	[Other Provider Identifier_20] [varchar](20) NULL,
	[Other Provider Identifier Type Code_20] [varchar](2) NULL,
	[Other Provider Identifier State_20] [varchar](2) NULL,
	[Other Provider Identifier Issuer_20] [varchar](80) NULL,
	[Other Provider Identifier_21] [varchar](20) NULL,
	[Other Provider Identifier Type Code_21] [varchar](2) NULL,
	[Other Provider Identifier State_21] [varchar](2) NULL,
	[Other Provider Identifier Issuer_21] [varchar](80) NULL,
	[Other Provider Identifier_22] [varchar](20) NULL,
	[Other Provider Identifier Type Code_22] [varchar](2) NULL,
	[Other Provider Identifier State_22] [varchar](2) NULL,
	[Other Provider Identifier Issuer_22] [varchar](80) NULL,
	[Other Provider Identifier_23] [varchar](20) NULL,
	[Other Provider Identifier Type Code_23] [varchar](2) NULL,
	[Other Provider Identifier State_23] [varchar](2) NULL,
	[Other Provider Identifier Issuer_23] [varchar](80) NULL,
	[Other Provider Identifier_24] [varchar](20) NULL,
	[Other Provider Identifier Type Code_24] [varchar](2) NULL,
	[Other Provider Identifier State_24] [varchar](2) NULL,
	[Other Provider Identifier Issuer_24] [varchar](80) NULL,
	[Other Provider Identifier_25] [varchar](20) NULL,
	[Other Provider Identifier Type Code_25] [varchar](2) NULL,
	[Other Provider Identifier State_25] [varchar](2) NULL,
	[Other Provider Identifier Issuer_25] [varchar](80) NULL,
	[Other Provider Identifier_26] [varchar](20) NULL,
	[Other Provider Identifier Type Code_26] [varchar](2) NULL,
	[Other Provider Identifier State_26] [varchar](2) NULL,
	[Other Provider Identifier Issuer_26] [varchar](80) NULL,
	[Other Provider Identifier_27] [varchar](20) NULL,
	[Other Provider Identifier Type Code_27] [varchar](2) NULL,
	[Other Provider Identifier State_27] [varchar](2) NULL,
	[Other Provider Identifier Issuer_27] [varchar](80) NULL,
	[Other Provider Identifier_28] [varchar](20) NULL,
	[Other Provider Identifier Type Code_28] [varchar](2) NULL,
	[Other Provider Identifier State_28] [varchar](2) NULL,
	[Other Provider Identifier Issuer_28] [varchar](80) NULL,
	[Other Provider Identifier_29] [varchar](20) NULL,
	[Other Provider Identifier Type Code_29] [varchar](2) NULL,
	[Other Provider Identifier State_29] [varchar](2) NULL,
	[Other Provider Identifier Issuer_29] [varchar](80) NULL,
	[Other Provider Identifier_30] [varchar](20) NULL,
	[Other Provider Identifier Type Code_30] [varchar](2) NULL,
	[Other Provider Identifier State_30] [varchar](2) NULL,
	[Other Provider Identifier Issuer_30] [varchar](80) NULL,
	[Other Provider Identifier_31] [varchar](20) NULL,
	[Other Provider Identifier Type Code_31] [varchar](2) NULL,
	[Other Provider Identifier State_31] [varchar](2) NULL,
	[Other Provider Identifier Issuer_31] [varchar](80) NULL,
	[Other Provider Identifier_32] [varchar](20) NULL,
	[Other Provider Identifier Type Code_32] [varchar](2) NULL,
	[Other Provider Identifier State_32] [varchar](2) NULL,
	[Other Provider Identifier Issuer_32] [varchar](80) NULL,
	[Other Provider Identifier_33] [varchar](20) NULL,
	[Other Provider Identifier Type Code_33] [varchar](2) NULL,
	[Other Provider Identifier State_33] [varchar](2) NULL,
	[Other Provider Identifier Issuer_33] [varchar](80) NULL,
	[Other Provider Identifier_34] [varchar](20) NULL,
	[Other Provider Identifier Type Code_34] [varchar](2) NULL,
	[Other Provider Identifier State_34] [varchar](2) NULL,
	[Other Provider Identifier Issuer_34] [varchar](80) NULL,
	[Other Provider Identifier_35] [varchar](20) NULL,
	[Other Provider Identifier Type Code_35] [varchar](2) NULL,
	[Other Provider Identifier State_35] [varchar](2) NULL,
	[Other Provider Identifier Issuer_35] [varchar](80) NULL,
	[Other Provider Identifier_36] [varchar](20) NULL,
	[Other Provider Identifier Type Code_36] [varchar](2) NULL,
	[Other Provider Identifier State_36] [varchar](2) NULL,
	[Other Provider Identifier Issuer_36] [varchar](80) NULL,
	[Other Provider Identifier_37] [varchar](20) NULL,
	[Other Provider Identifier Type Code_37] [varchar](2) NULL,
	[Other Provider Identifier State_37] [varchar](2) NULL,
	[Other Provider Identifier Issuer_37] [varchar](80) NULL,
	[Other Provider Identifier_38] [varchar](20) NULL,
	[Other Provider Identifier Type Code_38] [varchar](2) NULL,
	[Other Provider Identifier State_38] [varchar](2) NULL,
	[Other Provider Identifier Issuer_38] [varchar](80) NULL,
	[Other Provider Identifier_39] [varchar](20) NULL,
	[Other Provider Identifier Type Code_39] [varchar](2) NULL,
	[Other Provider Identifier State_39] [varchar](2) NULL,
	[Other Provider Identifier Issuer_39] [varchar](80) NULL,
	[Other Provider Identifier_40] [varchar](20) NULL,
	[Other Provider Identifier Type Code_40] [varchar](2) NULL,
	[Other Provider Identifier State_40] [varchar](2) NULL,
	[Other Provider Identifier Issuer_40] [varchar](80) NULL,
	[Other Provider Identifier_41] [varchar](20) NULL,
	[Other Provider Identifier Type Code_41] [varchar](2) NULL,
	[Other Provider Identifier State_41] [varchar](2) NULL,
	[Other Provider Identifier Issuer_41] [varchar](80) NULL,
	[Other Provider Identifier_42] [varchar](20) NULL,
	[Other Provider Identifier Type Code_42] [varchar](2) NULL,
	[Other Provider Identifier State_42] [varchar](2) NULL,
	[Other Provider Identifier Issuer_42] [varchar](80) NULL,
	[Other Provider Identifier_43] [varchar](20) NULL,
	[Other Provider Identifier Type Code_43] [varchar](2) NULL,
	[Other Provider Identifier State_43] [varchar](2) NULL,
	[Other Provider Identifier Issuer_43] [varchar](80) NULL,
	[Other Provider Identifier_44] [varchar](20) NULL,
	[Other Provider Identifier Type Code_44] [varchar](2) NULL,
	[Other Provider Identifier State_44] [varchar](2) NULL,
	[Other Provider Identifier Issuer_44] [varchar](80) NULL,
	[Other Provider Identifier_45] [varchar](20) NULL,
	[Other Provider Identifier Type Code_45] [varchar](2) NULL,
	[Other Provider Identifier State_45] [varchar](2) NULL,
	[Other Provider Identifier Issuer_45] [varchar](80) NULL,
	[Other Provider Identifier_46] [varchar](20) NULL,
	[Other Provider Identifier Type Code_46] [varchar](2) NULL,
	[Other Provider Identifier State_46] [varchar](2) NULL,
	[Other Provider Identifier Issuer_46] [varchar](80) NULL,
	[Other Provider Identifier_47] [varchar](20) NULL,
	[Other Provider Identifier Type Code_47] [varchar](2) NULL,
	[Other Provider Identifier State_47] [varchar](2) NULL,
	[Other Provider Identifier Issuer_47] [varchar](80) NULL,
	[Other Provider Identifier_48] [varchar](20) NULL,
	[Other Provider Identifier Type Code_48] [varchar](2) NULL,
	[Other Provider Identifier State_48] [varchar](2) NULL,
	[Other Provider Identifier Issuer_48] [varchar](80) NULL,
	[Other Provider Identifier_49] [varchar](20) NULL,
	[Other Provider Identifier Type Code_49] [varchar](2) NULL,
	[Other Provider Identifier State_49] [varchar](2) NULL,
	[Other Provider Identifier Issuer_49] [varchar](80) NULL,
	[Other Provider Identifier_50] [varchar](20) NULL,
	[Other Provider Identifier Type Code_50] [varchar](2) NULL,
	[Other Provider Identifier State_50] [varchar](2) NULL,
	[Other Provider Identifier Issuer_50] [varchar](80) NULL,
	[Is Sole Proprietor] [varchar](1) NULL,
	[Is Organization Subpart] [varchar](1) NULL,
	[Parent Organization LBN] [varchar](70) NULL,
	[Parent Organization TIN] [varchar](9) NULL,
	[Authorized Official Name Prefix Text] [varchar](5) NULL,
	[Authorized Official Name Suffix Text] [varchar](5) NULL,
	[Authorized Official Credential Text] [varchar](20) NULL,
	[Healthcare Provider Taxonomy Group_1] [varchar](70) NULL,
	[Healthcare Provider Taxonomy Group_2] [varchar](70) NULL,
	[Healthcare Provider Taxonomy Group_3] [varchar](70) NULL,
	[Healthcare Provider Taxonomy Group_4] [varchar](70) NULL,
	[Healthcare Provider Taxonomy Group_5] [varchar](70) NULL,
	[Healthcare Provider Taxonomy Group_6] [varchar](70) NULL,
	[Healthcare Provider Taxonomy Group_7] [varchar](70) NULL,
	[Healthcare Provider Taxonomy Group_8] [varchar](70) NULL,
	[Healthcare Provider Taxonomy Group_9] [varchar](70) NULL,
	[Healthcare Provider Taxonomy Group_10] [varchar](70) NULL,
	[Healthcare Provider Taxonomy Group_11] [varchar](70) NULL,
	[Healthcare Provider Taxonomy Group_12] [varchar](70) NULL,
	[Healthcare Provider Taxonomy Group_13] [varchar](70) NULL,
	[Healthcare Provider Taxonomy Group_14] [varchar](70) NULL,
	[Healthcare Provider Taxonomy Group_15] [varchar](70) NULL,
	[us_business_practice_location_zip_code_5]  AS (case when isnumeric([Provider Business Practice Location Address Postal Code])=(1) AND [Provider Business Practice Location Address Country Code (If outside US)]='US' then CONVERT([int],substring([Provider Business Practice Location Address Postal Code],(1),(5)),(0))  end) PERSISTED,
 CONSTRAINT [PK_MedicareProviders] PRIMARY KEY CLUSTERED 
(
	[NPI] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[MedicareProvidersAggregates]    Script Date: 8/27/2016 9:33:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[MedicareProvidersAggregates](
	[npi] [int] NOT NULL,
	[year] [smallint] NOT NULL,
	[number_of_hcpcs] [int] NULL,
	[total_services] [real] NULL,
	[total_unique_benes] [int] NULL,
	[total_submitted_chrg_amt] [real] NULL,
	[total_medicare_allowed_amt] [real] NULL,
	[total_medicare_payment_amt] [real] NULL,
	[total_medicare_stnd_amt] [real] NULL,
	[drug_suppress_indicator] [varchar](1) NULL,
	[number_of_drug_hcpcs] [int] NULL,
	[total_drug_services] [real] NULL,
	[total_drug_unique_benes] [int] NULL,
	[total_drug_submitted_chrg_amt] [real] NULL,
	[total_drug_medicare_allowed_amt] [real] NULL,
	[total_drug_medicare_payment_amt] [real] NULL,
	[total_drug_medicare_stnd_amt] [real] NULL,
	[med_suppress_indicator] [varchar](1) NULL,
	[number_of_med_hcpcs] [int] NULL,
	[total_med_services] [real] NULL,
	[total_med_unique_benes] [int] NULL,
	[total_med_submitted_chrg_amt] [real] NULL,
	[total_med_medicare_allowed_amt] [real] NULL,
	[total_med_medicare_payment_amt] [real] NULL,
	[total_med_medicare_stnd_amt] [real] NULL,
	[beneficiary_average_age] [smallint] NULL,
	[beneficiary_age_less_65_count] [int] NULL,
	[beneficiary_age_65_74_count] [int] NULL,
	[beneficiary_age_75_84_count] [int] NULL,
	[beneficiary_age_greater_84_count] [int] NULL,
	[beneficiary_female_count] [int] NULL,
	[beneficiary_male_count] [int] NULL,
	[beneficiary_race_white_count] [int] NULL,
	[beneficiary_race_black_count] [int] NULL,
	[beneficiary_race_api_count] [int] NULL,
	[beneficiary_race_hispanic_count] [int] NULL,
	[beneficiary_race_natind_count] [int] NULL,
	[beneficiary_race_other_count] [int] NULL,
	[beneficiary_nondual_count] [int] NULL,
	[beneficiary_dual_count] [int] NULL,
	[beneficiary_cc_afib_percent] [smallint] NULL,
	[beneficiary_cc_alzrdsd_percent] [smallint] NULL,
	[beneficiary_cc_asthma_percent] [smallint] NULL,
	[beneficiary_cc_cancer_percent] [smallint] NULL,
	[beneficiary_cc_chf_percent] [smallint] NULL,
	[beneficiary_cc_ckd_percent] [smallint] NULL,
	[beneficiary_cc_copd_percent] [smallint] NULL,
	[beneficiary_cc_depr_percent] [smallint] NULL,
	[beneficiary_cc_diab_percent] [smallint] NULL,
	[beneficiary_cc_hyperl_percent] [smallint] NULL,
	[beneficiary_cc_hypert_percent] [smallint] NULL,
	[beneficiary_cc_ihd_percent] [smallint] NULL,
	[beneficiary_cc_ost_percent] [smallint] NULL,
	[beneficiary_cc_raoa_percent] [smallint] NULL,
	[beneficiary_cc_schiot_percent] [smallint] NULL,
	[beneficiary_cc_strk_percent] [smallint] NULL,
	[beneficiary_average_risk_score] [real] NULL,
 CONSTRAINT [PK_MedicareProvidersAggregates] PRIMARY KEY CLUSTERED 
(
	[npi] ASC,
	[year] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[MedicareProvidersUtilizationAndPayments]    Script Date: 8/27/2016 9:33:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[MedicareProvidersUtilizationAndPayments](
	[npi] [int] NOT NULL,
	[year] [int] NOT NULL,
	[place_of_service] [varchar](1) NOT NULL,
	[hcpcs_code] [varchar](5) NOT NULL,
	[line_srvc_cnt] [float] NULL,
	[bene_unique_cnt] [int] NULL,
	[bene_day_srvc_cnt] [int] NULL,
	[average_medicare_allowed_amt] [float] NULL,
	[stdev_medicare_allowed_amt] [float] NULL,
	[average_submitted_chrg_amt] [float] NULL,
	[stdev_submitted_chrg_amt] [float] NULL,
	[average_medicare_payment_amt] [float] NULL,
	[stdev_medicare_payment_amt] [float] NULL,
	[average_medicare_standard_amt] [float] NULL,
 CONSTRAINT [PK_MedicareProvidersUtilizationAndPayments] PRIMARY KEY CLUSTERED 
(
	[npi] ASC,
	[year] ASC,
	[place_of_service] ASC,
	[hcpcs_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Physicians]    Script Date: 8/27/2016 9:33:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Physicians](
	[NPI] [int] NOT NULL,
	[PAC ID] [varchar](10) NULL,
	[Professional Enrollment ID] [varchar](15) NULL,
	[Last Name] [varchar](35) NULL,
	[First Name] [varchar](25) NULL,
	[Middle Name] [varchar](25) NULL,
	[Suffix] [varchar](4) NULL,
	[Gender] [varchar](1) NULL,
	[Credential] [varchar](3) NULL,
	[Medical school name] [varchar](100) NULL,
	[Graduation year] [smallint] NULL,
	[Primary specialty] [varchar](50) NULL,
	[Secondary specialty 1] [varchar](50) NULL,
	[Secondary specialty 2] [varchar](50) NULL,
	[Secondary specialty 3] [varchar](50) NULL,
	[Secondary specialty 4] [varchar](50) NULL,
	[All secondary specialties] [varchar](200) NULL,
	[Organization legal name] [varchar](70) NULL,
	[Organization DBA name] [varchar](70) NULL,
	[Group Practice PAC ID] [varchar](10) NULL,
	[Number of Group Practice members] [smallint] NULL,
	[Line 1 Street Address] [varchar](55) NULL,
	[Line 2 Street Address] [varchar](55) NULL,
	[Marker of address line 2 suppression] [varchar](1) NULL,
	[City] [varchar](30) NULL,
	[State] [varchar](2) NULL,
	[Zip Code] [varchar](9) NULL,
	[Phone Number] [varchar](20) NULL,
	[Claims based hospital affiliation CCN 1] [int] NULL,
	[Claims based hospital affiliation LBN 1] [varchar](70) NULL,
	[Claims based hospital affiliation CCN 2] [int] NULL,
	[Claims based hospital affiliation LBN 2] [varchar](70) NULL,
	[Claims based hospital affiliation CCN 3] [int] NULL,
	[Claims based hospital affiliation LBN 3] [varchar](70) NULL,
	[Claims based hospital affiliation CCN 4] [int] NULL,
	[Claims based hospital affiliation LBN 4] [varchar](70) NULL,
	[Claims based hospital affiliation CCN 5] [int] NULL,
	[Claims based hospital affiliation LBN 5] [varchar](70) NULL,
	[Professional accepts Medicare Assignment] [varchar](1) NULL,
	[Participating in eRx] [varchar](1) NULL,
	[Participating in PQRS] [varchar](1) NULL,
	[Participating in EHR] [varchar](1) NULL,
	[Received PQRS Maintenance of Certification Program Incentive] [varchar](1) NULL,
	[Participated in Million Hearts] [varchar](1) NULL,
	[LastModifiedDate] [datetime] NULL CONSTRAINT [DF_Physicians_LastModifiedDate]  DEFAULT (getdate()),
 CONSTRAINT [PK_Physicians] PRIMARY KEY CLUSTERED 
(
	[NPI] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[TaxonomyCodes]    Script Date: 8/27/2016 9:33:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[TaxonomyCodes](
	[Code] [varchar](10) NOT NULL,
	[Grouping] [varchar](100) NULL,
	[Classification] [varchar](100) NULL,
	[Specialization] [varchar](100) NULL,
	[Definition] [text] NULL,
	[Notes] [text] NULL,
 CONSTRAINT [PK_TaxonomyCodes] PRIMARY KEY CLUSTERED 
(
	[Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[ZipCodes]    Script Date: 8/27/2016 9:33:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ZipCodes](
	[geoid] [int] NOT NULL,
	[aland] [bigint] NULL,
	[awater] [bigint] NULL,
	[aland_sqmi] [float] NULL,
	[awater_sqmi] [float] NULL,
	[intptlat] [float] NULL,
	[intptlong] [float] NULL,
	[point] [geography] NULL,
 CONSTRAINT [PK_ZipCodes] PRIMARY KEY CLUSTERED 
(
	[geoid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  View [dbo].[MedicareExtendedProviders]    Script Date: 8/27/2016 9:33:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[MedicareExtendedProviders]
AS

SELECT
P.NPI, P.[Entity Type Code], P.[Replacement NPI], P.[Employer Identification Number (EIN)], 
P.[Provider Organization Name (Legal Business Name)], P.[Provider Last Name (Legal Name)], P.[Provider First Name], 
P.[Provider Middle Name], P.[Provider Name Prefix Text], P.[Provider Name Suffix Text], 
P.[Provider Credential Text], P.[Provider Other Organization Name], P.[Provider Other Organization Name Type Code], 
P.[Provider Other Last Name], P.[Provider Other First Name], P.[Provider Other Middle Name], 
P.[Provider Other Name Prefix Text], P.[Provider Other Name Suffix Text], P.[Provider Other Credential Text], 
P.[Provider Other Last Name Type Code], P.[Provider First Line Business Mailing Address], 
P.[Provider Second Line Business Mailing Address], P.[Provider Business Mailing Address City Name], 
P.[Provider Business Mailing Address State Name], P.[Provider Business Mailing Address Postal Code], 
P.[Provider Business Mailing Address Country Code (If outside US)], P.[Provider Business Mailing Address Telephone Number], 
P.[Provider Business Mailing Address Fax Number], P.[Provider First Line Business Practice Location Address], 
P.[Provider Second Line Business Practice Location Address], P.[Provider Business Practice Location Address City Name], 
P.[Provider Business Practice Location Address State Name], P.[Provider Business Practice Location Address Postal Code], 
P.[Provider Business Practice Location Address Country Code (If outside US)], P.[Provider Business Practice Location Address Telephone Number], 
P.[Provider Business Practice Location Address Fax Number], P.[Provider Enumeration Date], P.[Last Update Date], 
P.[NPI Deactivation Reason Code], P.[NPI Deactivation Date], P.[NPI Reactivation Date], 
P.[Provider Gender Code],
P.[Authorized Official Last Name],
P.[Authorized Official First Name], 
P.[Authorized Official Middle Name],
P.[Authorized Official Title or Position],
P.[Authorized Official Telephone Number], 

P.[Healthcare Provider Taxonomy Code_1],
T1.Classification AS [Healthcare Provider Taxonomy Code Classification_1],
T1.Specialization AS [Healthcare Provider Taxonomy Code Specialization_1],
T1.Definition AS [Healthcare Provider Taxonomy Code Definition_1],
P.[Provider License Number_1],
P.[Provider License Number State Code_1], 
P.[Healthcare Provider Primary Taxonomy Switch_1],

P.[Healthcare Provider Taxonomy Code_2],
T2.Classification AS [Healthcare Provider Taxonomy Code Classification_2],
T2.Specialization AS [Healthcare Provider Taxonomy Code Specialization_2],
T2.Definition AS [Healthcare Provider Taxonomy Code Definition_2],
P.[Provider License Number_2],
P.[Provider License Number State Code_2], 
P.[Healthcare Provider Primary Taxonomy Switch_2],

P.[Healthcare Provider Taxonomy Code_3],
T3.Classification AS [Healthcare Provider Taxonomy Code Classification_3],
T3.Specialization AS [Healthcare Provider Taxonomy Code Specialization_3],
T3.Definition AS [Healthcare Provider Taxonomy Code Definition_3],
P.[Provider License Number_3],
P.[Provider License Number State Code_3], 
P.[Healthcare Provider Primary Taxonomy Switch_3],

P.[Healthcare Provider Taxonomy Code_4],
T4.Classification AS [Healthcare Provider Taxonomy Code Classification_4],
T4.Specialization AS [Healthcare Provider Taxonomy Code Specialization_4],
T4.Definition AS [Healthcare Provider Taxonomy Code Definition_4],
P.[Provider License Number_4],
P.[Provider License Number State Code_4], 
P.[Healthcare Provider Primary Taxonomy Switch_4],

P.[Healthcare Provider Taxonomy Code_5],
T5.Classification AS [Healthcare Provider Taxonomy Code Classification_5],
T5.Specialization AS [Healthcare Provider Taxonomy Code Specialization_5],
T5.Definition AS [Healthcare Provider Taxonomy Code Definition_5],
P.[Provider License Number_5],
P.[Provider License Number State Code_5], 
P.[Healthcare Provider Primary Taxonomy Switch_5],

P.[Healthcare Provider Taxonomy Code_6],
T6.Classification AS [Healthcare Provider Taxonomy Code Classification_6],
T6.Specialization AS [Healthcare Provider Taxonomy Code Specialization_6],
T6.Definition AS [Healthcare Provider Taxonomy Code Definition_6],
P.[Provider License Number_6],
P.[Provider License Number State Code_6], 
P.[Healthcare Provider Primary Taxonomy Switch_6],

P.[Healthcare Provider Taxonomy Code_7],
T7.Classification AS [Healthcare Provider Taxonomy Code Classification_7],
T7.Specialization AS [Healthcare Provider Taxonomy Code Specialization_7],
T7.Definition AS [Healthcare Provider Taxonomy Code Definition_7],
P.[Provider License Number_7],
P.[Provider License Number State Code_7], 
P.[Healthcare Provider Primary Taxonomy Switch_7],

P.[Healthcare Provider Taxonomy Code_8],
T8.Classification AS [Healthcare Provider Taxonomy Code Classification_8],
T8.Specialization AS [Healthcare Provider Taxonomy Code Specialization_8],
T8.Definition AS [Healthcare Provider Taxonomy Code Definition_8],
P.[Provider License Number_8],
P.[Provider License Number State Code_8], 
P.[Healthcare Provider Primary Taxonomy Switch_8],

P.[Healthcare Provider Taxonomy Code_9],
T9.Classification AS [Healthcare Provider Taxonomy Code Classification_9],
T9.Specialization AS [Healthcare Provider Taxonomy Code Specialization_9],
T9.Definition AS [Healthcare Provider Taxonomy Code Definition_9],
P.[Provider License Number_9],
P.[Provider License Number State Code_9], 
P.[Healthcare Provider Primary Taxonomy Switch_9],

P.[Healthcare Provider Taxonomy Code_10],
T10.Classification AS [Healthcare Provider Taxonomy Code Classification_10],
T10.Specialization AS [Healthcare Provider Taxonomy Code Specialization_10],
T10.Definition AS [Healthcare Provider Taxonomy Code Definition_10],
P.[Provider License Number_10],
P.[Provider License Number State Code_10], 
P.[Healthcare Provider Primary Taxonomy Switch_10],

P.[Healthcare Provider Taxonomy Code_11],
T11.Classification AS [Healthcare Provider Taxonomy Code Classification_11],
T11.Specialization AS [Healthcare Provider Taxonomy Code Specialization_11],
T11.Definition AS [Healthcare Provider Taxonomy Code Definition_11],
P.[Provider License Number_11],
P.[Provider License Number State Code_11], 
P.[Healthcare Provider Primary Taxonomy Switch_11],

P.[Healthcare Provider Taxonomy Code_12],
T12.Classification AS [Healthcare Provider Taxonomy Code Classification_12],
T12.Specialization AS [Healthcare Provider Taxonomy Code Specialization_12],
T12.Definition AS [Healthcare Provider Taxonomy Code Definition_12],
P.[Provider License Number_12],
P.[Provider License Number State Code_12], 
P.[Healthcare Provider Primary Taxonomy Switch_12],

P.[Healthcare Provider Taxonomy Code_13],
T13.Classification AS [Healthcare Provider Taxonomy Code Classification_13],
T13.Specialization AS [Healthcare Provider Taxonomy Code Specialization_13],
T13.Definition AS [Healthcare Provider Taxonomy Code Definition_13],
P.[Provider License Number_13],
P.[Provider License Number State Code_13], 
P.[Healthcare Provider Primary Taxonomy Switch_13],

P.[Healthcare Provider Taxonomy Code_14],
T14.Classification AS [Healthcare Provider Taxonomy Code Classification_14],
T14.Specialization AS [Healthcare Provider Taxonomy Code Specialization_14],
T14.Definition AS [Healthcare Provider Taxonomy Code Definition_14],
P.[Provider License Number_14],
P.[Provider License Number State Code_14], 
P.[Healthcare Provider Primary Taxonomy Switch_14],

P.[Healthcare Provider Taxonomy Code_15],
T15.Classification AS [Healthcare Provider Taxonomy Code Classification_15],
T15.Specialization AS [Healthcare Provider Taxonomy Code Specialization_15],
T15.Definition AS [Healthcare Provider Taxonomy Code Definition_15],
P.[Provider License Number_15],
P.[Provider License Number State Code_15], 
P.[Healthcare Provider Primary Taxonomy Switch_15],

P.[Other Provider Identifier_1], P.[Other Provider Identifier Type Code_1], 
P.[Other Provider Identifier State_1], P.[Other Provider Identifier Issuer_1], P.[Other Provider Identifier_2], 
P.[Other Provider Identifier Type Code_2], P.[Other Provider Identifier State_2], P.[Other Provider Identifier Issuer_2], 
P.[Other Provider Identifier_3], P.[Other Provider Identifier Type Code_3], P.[Other Provider Identifier State_3], 
P.[Other Provider Identifier Issuer_3], P.[Other Provider Identifier_4], P.[Other Provider Identifier Type Code_4], 
P.[Other Provider Identifier State_4], P.[Other Provider Identifier Issuer_4], P.[Other Provider Identifier_5], 
P.[Other Provider Identifier Type Code_5], P.[Other Provider Identifier State_5], P.[Other Provider Identifier Issuer_5], 
P.[Other Provider Identifier_6], P.[Other Provider Identifier Type Code_6], P.[Other Provider Identifier State_6], 
P.[Other Provider Identifier Issuer_6], P.[Other Provider Identifier_7], P.[Other Provider Identifier Type Code_7], 
P.[Other Provider Identifier State_7], P.[Other Provider Identifier Issuer_7], P.[Other Provider Identifier_8], 
P.[Other Provider Identifier Type Code_8], P.[Other Provider Identifier State_8], P.[Other Provider Identifier Issuer_8], 
P.[Other Provider Identifier_9], P.[Other Provider Identifier Type Code_9], P.[Other Provider Identifier State_9], 
P.[Other Provider Identifier Issuer_9], P.[Other Provider Identifier_10], P.[Other Provider Identifier Type Code_10], 
P.[Other Provider Identifier State_10], P.[Other Provider Identifier Issuer_10], P.[Other Provider Identifier_11], 
P.[Other Provider Identifier Type Code_11], P.[Other Provider Identifier State_11], P.[Other Provider Identifier Issuer_11], 
P.[Other Provider Identifier_12], P.[Other Provider Identifier Type Code_12], P.[Other Provider Identifier State_12], 
P.[Other Provider Identifier Issuer_12], P.[Other Provider Identifier_13], P.[Other Provider Identifier Type Code_13], 
P.[Other Provider Identifier State_13], P.[Other Provider Identifier Issuer_13], P.[Other Provider Identifier_14], 
P.[Other Provider Identifier Type Code_14], P.[Other Provider Identifier State_14], P.[Other Provider Identifier Issuer_14], 
P.[Other Provider Identifier_15], P.[Other Provider Identifier Type Code_15], P.[Other Provider Identifier State_15], 
P.[Other Provider Identifier Issuer_15], P.[Other Provider Identifier_16], P.[Other Provider Identifier Type Code_16], 
P.[Other Provider Identifier State_16], P.[Other Provider Identifier Issuer_16], P.[Other Provider Identifier_17], 
P.[Other Provider Identifier Type Code_17], P.[Other Provider Identifier State_17], P.[Other Provider Identifier Issuer_17], 
P.[Other Provider Identifier_18], P.[Other Provider Identifier Type Code_18], P.[Other Provider Identifier State_18], 
P.[Other Provider Identifier Issuer_18], P.[Other Provider Identifier_19], P.[Other Provider Identifier Type Code_19], 
P.[Other Provider Identifier State_19], P.[Other Provider Identifier Issuer_19], P.[Other Provider Identifier_20], 
P.[Other Provider Identifier Type Code_20], P.[Other Provider Identifier State_20], P.[Other Provider Identifier Issuer_20], 
P.[Other Provider Identifier_21], P.[Other Provider Identifier Type Code_21], P.[Other Provider Identifier State_21], 
P.[Other Provider Identifier Issuer_21], P.[Other Provider Identifier_22], P.[Other Provider Identifier Type Code_22], 
P.[Other Provider Identifier State_22], P.[Other Provider Identifier Issuer_22], P.[Other Provider Identifier_23], 
P.[Other Provider Identifier Type Code_23], P.[Other Provider Identifier State_23], P.[Other Provider Identifier Issuer_23], 
P.[Other Provider Identifier_24], P.[Other Provider Identifier Type Code_24], P.[Other Provider Identifier State_24], 
P.[Other Provider Identifier Issuer_24], P.[Other Provider Identifier_25], P.[Other Provider Identifier Type Code_25], 
P.[Other Provider Identifier State_25], P.[Other Provider Identifier Issuer_25], P.[Other Provider Identifier_26], 
P.[Other Provider Identifier Type Code_26], P.[Other Provider Identifier State_26], P.[Other Provider Identifier Issuer_26], 
P.[Other Provider Identifier_27], P.[Other Provider Identifier Type Code_27], P.[Other Provider Identifier State_27], 
P.[Other Provider Identifier Issuer_27], P.[Other Provider Identifier_28], P.[Other Provider Identifier Type Code_28], 
P.[Other Provider Identifier State_28], P.[Other Provider Identifier Issuer_28], P.[Other Provider Identifier_29], 
P.[Other Provider Identifier Type Code_29], P.[Other Provider Identifier State_29], P.[Other Provider Identifier Issuer_29], 
P.[Other Provider Identifier_30], P.[Other Provider Identifier Type Code_30], P.[Other Provider Identifier State_30], 
P.[Other Provider Identifier Issuer_30], P.[Other Provider Identifier_31], P.[Other Provider Identifier Type Code_31], 
P.[Other Provider Identifier State_31], P.[Other Provider Identifier Issuer_31], P.[Other Provider Identifier_32], 
P.[Other Provider Identifier Type Code_32], P.[Other Provider Identifier State_32], P.[Other Provider Identifier Issuer_32], 
P.[Other Provider Identifier_33], P.[Other Provider Identifier Type Code_33], P.[Other Provider Identifier State_33], 
P.[Other Provider Identifier Issuer_33], P.[Other Provider Identifier_34], P.[Other Provider Identifier Type Code_34], 
P.[Other Provider Identifier State_34], P.[Other Provider Identifier Issuer_34], P.[Other Provider Identifier_35], 
P.[Other Provider Identifier Type Code_35], P.[Other Provider Identifier State_35], P.[Other Provider Identifier Issuer_35], 
P.[Other Provider Identifier_36], P.[Other Provider Identifier Type Code_36], P.[Other Provider Identifier State_36], 
P.[Other Provider Identifier Issuer_36], P.[Other Provider Identifier_37], P.[Other Provider Identifier Type Code_37], 
P.[Other Provider Identifier State_37], P.[Other Provider Identifier Issuer_37], P.[Other Provider Identifier_38], 
P.[Other Provider Identifier Type Code_38], P.[Other Provider Identifier State_38], P.[Other Provider Identifier Issuer_38], 
P.[Other Provider Identifier_39], P.[Other Provider Identifier Type Code_39], P.[Other Provider Identifier State_39], 
P.[Other Provider Identifier Issuer_39], P.[Other Provider Identifier_40], P.[Other Provider Identifier Type Code_40], 
P.[Other Provider Identifier State_40], P.[Other Provider Identifier Issuer_40], P.[Other Provider Identifier_41], 
P.[Other Provider Identifier Type Code_41], P.[Other Provider Identifier State_41], P.[Other Provider Identifier Issuer_41], 
P.[Other Provider Identifier_42], P.[Other Provider Identifier Type Code_42], P.[Other Provider Identifier State_42], 
P.[Other Provider Identifier Issuer_42], P.[Other Provider Identifier_43], P.[Other Provider Identifier Type Code_43], 
P.[Other Provider Identifier State_43], P.[Other Provider Identifier Issuer_43], P.[Other Provider Identifier_44], 
P.[Other Provider Identifier Type Code_44], P.[Other Provider Identifier State_44], P.[Other Provider Identifier Issuer_44], 
P.[Other Provider Identifier_45], P.[Other Provider Identifier Type Code_45], P.[Other Provider Identifier State_45], 
P.[Other Provider Identifier Issuer_45], P.[Other Provider Identifier_46], P.[Other Provider Identifier Type Code_46], 
P.[Other Provider Identifier State_46], P.[Other Provider Identifier Issuer_46], P.[Other Provider Identifier_47], 
P.[Other Provider Identifier Type Code_47], P.[Other Provider Identifier State_47], P.[Other Provider Identifier Issuer_47], 
P.[Other Provider Identifier_48], P.[Other Provider Identifier Type Code_48], P.[Other Provider Identifier State_48], 
P.[Other Provider Identifier Issuer_48], P.[Other Provider Identifier_49], P.[Other Provider Identifier Type Code_49], 
P.[Other Provider Identifier State_49], P.[Other Provider Identifier Issuer_49], P.[Other Provider Identifier_50], 
P.[Other Provider Identifier Type Code_50], P.[Other Provider Identifier State_50], P.[Other Provider Identifier Issuer_50], 
P.[Is Sole Proprietor], P.[Is Organization Subpart], P.[Parent Organization LBN], P.[Parent Organization TIN], 
P.[Authorized Official Name Prefix Text], P.[Authorized Official Name Suffix Text], P.[Authorized Official Credential Text], 
P.[Healthcare Provider Taxonomy Group_1], P.[Healthcare Provider Taxonomy Group_2], 
P.[Healthcare Provider Taxonomy Group_3], P.[Healthcare Provider Taxonomy Group_4], 
P.[Healthcare Provider Taxonomy Group_5], P.[Healthcare Provider Taxonomy Group_6], 
P.[Healthcare Provider Taxonomy Group_7], P.[Healthcare Provider Taxonomy Group_8], 
P.[Healthcare Provider Taxonomy Group_9], P.[Healthcare Provider Taxonomy Group_10], 
P.[Healthcare Provider Taxonomy Group_11], P.[Healthcare Provider Taxonomy Group_12], 
P.[Healthcare Provider Taxonomy Group_13], P.[Healthcare Provider Taxonomy Group_14], 
P.[Healthcare Provider Taxonomy Group_15], P.us_business_practice_location_zip_code_5, H.[PAC ID], 
H.[Professional Enrollment ID], H.[Medical school name], H.[Graduation year], H.[Primary specialty], H.[Secondary specialty 1], 
H.[Secondary specialty 2], H.[Secondary specialty 3], H.[Secondary specialty 4], H.[All secondary specialties], 
H.[Organization legal name], H.[Organization DBA name], H.[Group Practice PAC ID], H.[Number of Group Practice members], 
H.[Claims based hospital affiliation CCN 1], H.[Claims based hospital affiliation LBN 1], H.[Claims based hospital affiliation CCN 2], 
H.[Claims based hospital affiliation LBN 2], H.[Claims based hospital affiliation CCN 3], H.[Claims based hospital affiliation LBN 3], 
H.[Claims based hospital affiliation CCN 4], H.[Claims based hospital affiliation LBN 4], H.[Claims based hospital affiliation CCN 5], 
H.[Claims based hospital affiliation LBN 5], H.[Professional accepts Medicare Assignment], H.[Participating in eRx], H.[Participating in PQRS], 
H.[Participating in EHR], H.[Received PQRS Maintenance of Certification Program Incentive], H.[Participated in Million Hearts]
FROM
	dbo.MedicareProviders P WITH(NOLOCK)
LEFT OUTER JOIN
	dbo.Physicians H WITH(NOLOCK)
ON
	P.NPI = H.NPI
LEFT OUTER JOIN
	dbo.TaxonomyCodes T1 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_1] = T1.Code
LEFT OUTER JOIN
	dbo.TaxonomyCodes T2 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_2] = T2.Code
LEFT OUTER JOIN
	dbo.TaxonomyCodes T3 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_3] = T3.Code
LEFT OUTER JOIN
	dbo.TaxonomyCodes T4 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_4] = T4.Code
LEFT OUTER JOIN
	dbo.TaxonomyCodes T5 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_5] = T5.Code
LEFT OUTER JOIN
	dbo.TaxonomyCodes T6 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_6] = T6.Code
LEFT OUTER JOIN
	dbo.TaxonomyCodes T7 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_7] = T7.Code
LEFT OUTER JOIN
	dbo.TaxonomyCodes T8 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_8] = T8.Code
LEFT OUTER JOIN
	dbo.TaxonomyCodes T9 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_9] = T9.Code
LEFT OUTER JOIN
	dbo.TaxonomyCodes T10 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_10] = T10.Code
LEFT OUTER JOIN
	dbo.TaxonomyCodes T11 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_11] = T11.Code
LEFT OUTER JOIN
	dbo.TaxonomyCodes T12 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_12] = T12.Code
LEFT OUTER JOIN
	dbo.TaxonomyCodes T13 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_13] = T13.Code
LEFT OUTER JOIN
	dbo.TaxonomyCodes T14 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_14] = T14.Code
LEFT OUTER JOIN
	dbo.TaxonomyCodes T15 WITH(NOLOCK)
ON
	P.[Healthcare Provider Taxonomy Code_15] = T15.Code


GO
/****** Object:  View [dbo].[MedicareExtendedProvidersAggregates]    Script Date: 8/27/2016 9:33:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE VIEW [dbo].[MedicareExtendedProvidersAggregates]
AS

SELECT
	A.*
	, P.[Entity Type Code]
	, P.[Provider Organization Name (Legal Business Name)]
	, P.[Provider Last Name (Legal Name)]
	, P.[Provider First Name]
	, P.[Provider Middle Name]
	, P.[Provider Name Prefix Text]
	, P.[Provider Name Suffix Text]
	, P.[Provider Credential Text]
	, P.[Provider First Line Business Mailing Address]
	, P.[Provider Second Line Business Mailing Address]
	, P.[Provider Business Mailing Address City Name]
	, P.[Provider Business Mailing Address State Name]
	, P.[Provider Business Mailing Address Postal Code]
	, P.[Provider Business Mailing Address Country Code (If outside US)]
	, P.[Provider Business Mailing Address Telephone Number]
	, P.[Provider Business Mailing Address Fax Number]
	, P.[Provider First Line Business Practice Location Address]
	, P.[Provider Second Line Business Practice Location Address]
	, P.[Provider Business Practice Location Address City Name]
	, P.[Provider Business Practice Location Address State Name]
	, P.[Provider Business Practice Location Address Postal Code]
	, P.[Provider Business Practice Location Address Country Code (If outside US)]
	, P.[Provider Business Practice Location Address Telephone Number]
	, P.[Provider Business Practice Location Address Fax Number]
	, P.[Primary specialty]
	, P.[All secondary specialties]
FROM
	dbo.MedicareProvidersAggregates A WITH(NOLOCK)
INNER JOIN
	dbo.MedicareExtendedProviders P WITH(NOLOCK)
ON
	A.npi = P.NPI



GO
/****** Object:  View [dbo].[MedicareExtendedUtilizationAndPayments]    Script Date: 8/27/2016 9:33:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE VIEW [dbo].[MedicareExtendedUtilizationAndPayments]
AS

SELECT
	U.*
	, C.ShortDescription
	, C.Description
	, C.DrugIndicator
	, P.[Entity Type Code]
	, P.[Provider Organization Name (Legal Business Name)]
	, P.[Provider Last Name (Legal Name)]
	, P.[Provider First Name]
	, P.[Provider Middle Name]
	, P.[Provider Name Prefix Text]
	, P.[Provider Name Suffix Text]
	, P.[Provider Credential Text]
	, P.[Provider First Line Business Mailing Address]
	, P.[Provider Second Line Business Mailing Address]
	, P.[Provider Business Mailing Address City Name]
	, P.[Provider Business Mailing Address State Name]
	, P.[Provider Business Mailing Address Postal Code]
	, P.[Provider Business Mailing Address Country Code (If outside US)]
	, P.[Provider Business Mailing Address Telephone Number]
	, P.[Provider Business Mailing Address Fax Number]
	, P.[Provider First Line Business Practice Location Address]
	, P.[Provider Second Line Business Practice Location Address]
	, P.[Provider Business Practice Location Address City Name]
	, P.[Provider Business Practice Location Address State Name]
	, P.[Provider Business Practice Location Address Postal Code]
	, P.[Provider Business Practice Location Address Country Code (If outside US)]
	, P.[Provider Business Practice Location Address Telephone Number]
	, P.[Provider Business Practice Location Address Fax Number]
	, P.[Primary specialty]
	, P.[All secondary specialties]
FROM
	dbo.MedicareProvidersUtilizationAndPayments U WITH(NOLOCK)
INNER JOIN
	dbo.MedicareExtendedProviders P WITH(NOLOCK)
ON
	U.npi = P.NPI
LEFT OUTER JOIN
	dbo.HCPCSCodes C WITH(NOLOCK)
ON
	U.hcpcs_code = C.HCPCS



GO
/****** Object:  View [dbo].[MedicareExtendedPhysicians]    Script Date: 8/27/2016 9:33:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[MedicareExtendedPhysicians]
AS

SELECT
	dbo.Physicians.*
FROM
	dbo.Physicians WITH(NOLOCK)



GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_MedicareProvidersUtilizationAndPayments_HCPCS]    Script Date: 8/27/2016 9:33:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_MedicareProvidersUtilizationAndPayments_HCPCS] ON [dbo].[MedicareProvidersUtilizationAndPayments]
(
	[hcpcs_code] ASC
)
INCLUDE ( 	[year]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_MedicareProvidersUtilizationAndPayments_Year]    Script Date: 8/27/2016 9:33:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_MedicareProvidersUtilizationAndPayments_Year] ON [dbo].[MedicareProvidersUtilizationAndPayments]
(
	[year] ASC
)
INCLUDE ( 	[hcpcs_code]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_Physicians_GroupPracticePACID]    Script Date: 8/27/2016 9:33:28 AM ******/
CREATE NONCLUSTERED INDEX [IX_Physicians_GroupPracticePACID] ON [dbo].[Physicians]
(
	[Group Practice PAC ID] ASC
)
INCLUDE ( 	[NPI]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[jqGridSavedSearchHistories] ADD  CONSTRAINT [DF_jqGridSavedSearchHistories_CreationTime]  DEFAULT (getdate()) FOR [CreationTime]
GO
ALTER TABLE [dbo].[MedicareProvidersAggregates]  WITH CHECK ADD  CONSTRAINT [FK_MedicareProvidersAggregates_MedicareProviders] FOREIGN KEY([npi])
REFERENCES [dbo].[MedicareProviders] ([NPI])
GO
ALTER TABLE [dbo].[MedicareProvidersAggregates] CHECK CONSTRAINT [FK_MedicareProvidersAggregates_MedicareProviders]
GO
ALTER TABLE [dbo].[MedicareProvidersUtilizationAndPayments]  WITH CHECK ADD  CONSTRAINT [FK_MedicareProvidersUtilizationAndPayments_MedicareProviders] FOREIGN KEY([npi])
REFERENCES [dbo].[MedicareProviders] ([NPI])
GO
ALTER TABLE [dbo].[MedicareProvidersUtilizationAndPayments] CHECK CONSTRAINT [FK_MedicareProvidersUtilizationAndPayments_MedicareProviders]
GO
ALTER TABLE [dbo].[Physicians]  WITH CHECK ADD  CONSTRAINT [FK_Physicians_MedicareProviders] FOREIGN KEY([NPI])
REFERENCES [dbo].[MedicareProviders] ([NPI])
GO
ALTER TABLE [dbo].[Physicians] CHECK CONSTRAINT [FK_Physicians_MedicareProviders]
GO
USE [master]
GO
ALTER DATABASE [Medicare] SET  READ_WRITE 
GO
