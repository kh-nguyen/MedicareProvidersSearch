//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class ZipCode
    {
        public int geoid { get; set; }
        public Nullable<long> aland { get; set; }
        public Nullable<long> awater { get; set; }
        public Nullable<double> aland_sqmi { get; set; }
        public Nullable<double> awater_sqmi { get; set; }
        public Nullable<double> intptlat { get; set; }
        public Nullable<double> intptlong { get; set; }
        public System.Data.Entity.Spatial.DbGeography point { get; set; }
    }
}
