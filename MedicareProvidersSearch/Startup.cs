using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MedicareProvidersSearch.Startup))]
namespace MedicareProvidersSearch
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            
        }
    }
}
