﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace System.Databases.Medicare
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class MedicareEntities : DbContext
    {
        public MedicareEntities()
            : base("name=MedicareEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<HCPCSCode> HCPCSCodes { get; set; }
        public virtual DbSet<ZipCode> ZipCodes { get; set; }
        public virtual DbSet<jqGridSavedSearchHistory> jqGridSavedSearchHistories { get; set; }
        public virtual DbSet<MedicareProvidersUtilizationAndPayment> MedicareProvidersUtilizationAndPayments { get; set; }
        public virtual DbSet<Physician> Physicians { get; set; }
        public virtual DbSet<TaxonomyCode> TaxonomyCodes { get; set; }
        public virtual DbSet<MedicareProvider> MedicareProviders { get; set; }
        public virtual DbSet<MedicareProvidersAggregate> MedicareProvidersAggregates { get; set; }
        public virtual DbSet<MedicareExtendedPhysician> MedicareExtendedPhysicians { get; set; }
        public virtual DbSet<MedicareExtendedProvider> MedicareExtendedProviders { get; set; }
        public virtual DbSet<MedicareExtendedProvidersAggregate> MedicareExtendedProvidersAggregates { get; set; }
        public virtual DbSet<MedicareExtendedUtilizationAndPayment> MedicareExtendedUtilizationAndPayments { get; set; }
    }
}
