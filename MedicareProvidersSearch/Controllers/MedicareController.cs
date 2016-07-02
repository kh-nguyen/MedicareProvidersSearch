using MedicareProvidersSearch.Models;
using ServiceStack;
using System.Infrastructure;
using System.Linq;
using System.Models.jqGrid.Helpers;
using System.Transactions;
using System.Web;
using System.Web.Mvc;

namespace System.Controllers
{
    public class MedicareController : Controller
    {
        private readonly MedicareEntities medicareDatabase;
        private readonly HttpContextBase httpContext;

        public MedicareController(
            MedicareEntities medicareDatabase,
            HttpContextBase httpContext) {
            this.medicareDatabase = medicareDatabase;
            this.httpContext = httpContext;
        }

        [HttpGet]
        public ActionResult Providers() {
            ViewBag.searchYears = medicareDatabase
                .MedicareExtendedUtilizationAndPayments
                .GroupBy(x => x.year).Select(x => x.Key)
                .OrderByDescending(x => x);

            return View();
        }

        [HttpPost]
        public JsonNetResult Providers(jqGridParamModel grid,
            SearchUtilizationAndPayments searchUtilizationAndPayments) {
            // turn off change tracking for high performance
            medicareDatabase.Configuration.AutoDetectChangesEnabled = false;

            using (var scope = Scope.New(IsolationLevel.ReadUncommitted)) {
                var query = medicareDatabase.MedicareExtendedProviders.AsQueryable();

                if (searchUtilizationAndPayments != null) {
                    query = searchUtilizationAndPayments.apply(medicareDatabase, query);
                }

                var result = jqGridResponseDefaultModel.getDefaultResponse(query, grid);

                //convert to JSON and return to client
                return this.JsonEx(result);
            }
        }

        [HttpPost]
        public void ProvidersSave(jqGridParamModel grid) {
            // turn off change tracking for high performance
            medicareDatabase.Configuration.AutoDetectChangesEnabled = false;

            using (var scope = Scope.New(IsolationLevel.ReadUncommitted)) {
                var query = medicareDatabase.MedicareExtendedProviders.AsQueryable();

                query = jqGridResponseDefaultModel.getFilteringAndSorting(query, grid);

                string filename = "result.csv";
                httpContext.Response.ContentType = "text/csv";
                httpContext.Response.AddHeader("Content-Disposition", httpContext.getContentDisposition(filename));
                httpContext.Response.Clear();

                httpContext.Response.Write(query.ToCsv());
                httpContext.Response.End();
            }
        }

        [HttpGet]
        public ActionResult Provider(int ID) {
            using (var scope = Scope.New(IsolationLevel.ReadUncommitted)) {
                return View(medicareDatabase.MedicareExtendedProviders.Find(ID));
            }
        }

        [HttpPost]
        public JsonNetResult Aggregates(int ID, jqGridParamModel grid) {
            // turn off change tracking for high performance
            medicareDatabase.Configuration.AutoDetectChangesEnabled = false;

            using (var scope = Scope.New(IsolationLevel.ReadUncommitted)) {
                var query = medicareDatabase.MedicareExtendedProvidersAggregates
                    .Where(x => x.npi == ID).AsQueryable();

                var result = jqGridResponseDefaultModel.getDefaultResponse(query, grid);

                //convert to JSON and return to client
                return this.JsonEx(result);
            }
        }

        [HttpPost]
        public JsonNetResult UtilizationAndPayments(int ID, jqGridParamModel grid) {
            // turn off change tracking for high performance
            medicareDatabase.Configuration.AutoDetectChangesEnabled = false;

            using (var scope = Scope.New(IsolationLevel.ReadUncommitted)) {
                var query = medicareDatabase.MedicareExtendedUtilizationAndPayments
                    .Where(x => x.npi == ID).AsQueryable();

                var result = jqGridResponseDefaultModel.getDefaultResponse(query, grid);

                //convert to JSON and return to client
                return this.JsonEx(result);
            }
        }

        [HttpPost]
        public JsonNetResult GroupPracticeMembers(int ID, jqGridParamModel grid) {
            // turn off change tracking for high performance
            medicareDatabase.Configuration.AutoDetectChangesEnabled = false;

            using (var scope = Scope.New(IsolationLevel.ReadUncommitted)) {
                var groupPracticeID = medicareDatabase.MedicareExtendedProviders
                    .Where(x => x.NPI == ID)
                    .Select(x => x.Group_Practice_PAC_ID)
                    .FirstOrDefault();

                // returns an empty object if there is no group practice
                if (String.IsNullOrEmpty(groupPracticeID)) {
                    return this.JsonEx(new { });
                }

                // get the list of colleagues with same group practice ID excluding the current NPI
                var query = medicareDatabase.MedicareExtendedProviders
                    .Where(x => x.Group_Practice_PAC_ID == groupPracticeID);

                var result = jqGridResponseDefaultModel.getDefaultResponse(query, grid);

                //convert to JSON and return to client
                return this.JsonEx(result);
            }
        }

        public class SearchUtilizationAndPayments
        {
            public string hcpcs { get; set; }
            public int year { get; set; }
            public int miles { get; set; }
            public int zipcode { get; set; }

            public IQueryable<MedicareExtendedProvider> apply(
                MedicareEntities medicareDatabase,
                IQueryable<MedicareExtendedProvider> query) {
                var hasFilter = false;

                var utilization = medicareDatabase
                    .MedicareExtendedUtilizationAndPayments
                    .AsQueryable();

                if (!String.IsNullOrEmpty(hcpcs)) {
                    utilization = utilization.Where(x => x.hcpcs_code == hcpcs);
                    hasFilter = true;
                }

                if (year > 1900) {
                    utilization = utilization.Where(x => x.year == year);
                    hasFilter = true;
                }

                if (hasFilter) {
                    query =
                        from q in query
                        join npi in utilization.Select(x => x.npi).Distinct()
                        on q.NPI equals npi
                        select q;
                }

                // filter within distance
                if (miles > 0 && zipcode > 0) {
                    var lat_lon = medicareDatabase.ZipCodes.Find(zipcode);

                    if (lat_lon != null) {
                        // convert miles to meters
                        var withinMeters = miles * 1609.344f;

                        query =
                            from q in query
                            join z in medicareDatabase.ZipCodes
                            on q.us_business_practice_location_zip_code_5 equals z.geoid
                            where z.point.Distance(lat_lon.point) <= withinMeters
                            select q;
                    }
                }

                return query;
            }
        }
    }
}