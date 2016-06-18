using System.Infrastructure;
using System.Web.Mvc;
using System.Linq;
using MedicareProvidersSearch.Models;

namespace System.Controllers
{
    public class AccountController : Controller
    {
        private readonly MedicareEntities medicareDatabase;

        public AccountController(MedicareEntities medicareDatabase) {
            this.medicareDatabase = medicareDatabase;
        }

        [HttpGet]
        public JsonNetResult SavedSearchListHistories()
        {
            // not implemented, returns an empty object
            return this.JsonEx(new { });
        }

        [HttpGet]
        [Route("Data/SearchHCPCSCodes")]
        public JsonNetResult SearchHCPCSCodes(string term) {
            if (String.IsNullOrWhiteSpace(term))
                return null;

            term = term.Trim();

            using (var scope = Scope.New(System.Transactions.IsolationLevel.ReadUncommitted)) {
                var result =
                    from i in medicareDatabase.HCPCSCodes
                    where i.ShortDescription.Contains(term) || i.HCPCS.StartsWith(term)
                    select i;

                return this.JsonEx(result.OrderBy(x => x.HCPCS).ToList());
            }
        }
    }
}